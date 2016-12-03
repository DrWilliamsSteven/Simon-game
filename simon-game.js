$(document).ready(function() {

  var buzzer = $('#buzzer')[0];
  var sounds = [$('#sound0')[0], $('#sound1')[0], $('#sound2')[0], $('#sound3')[0]];

  var power = false;
  var strict = false;
  var repeat = false;
  var counter = 0;
  var arr = [];
  var user_arr = [];
  var correct = true;
  var gameOver = false;
  var timing = 1000;

  //reset function
  var reset = function() {
    repeat = false;
    arr = [];
    user_arr = [];
    counter = 0;
    correct = true;
    $('#counter').html('<h2>' + counter + '</h2>');
    $('.helptext').hide();
   };

  //check if length user_arr === length arr continue to next level, if counter === 20, alert victory, reset.
  var checkIfEnd = function() {
    if (user_arr.length === arr.length) {
      if (counter === 20) { // if (strict) play buzzer, return to start of game repeat = false, clear arr.
        alert('Victory');
        reset();
        setTimeout(function() {gameplay();}, 1000);
      } else {
        repeat = false;
        user_arr = [];
        setTimeout(function() {gameplay();}, 1000);
      }
    }
  };

  //check if user input is correct
  var checkIfCorrect = function() {
    if (user_arr[user_arr.length - 1] !== arr[user_arr.length - 1]) {
      correct = false;
      buzzer.play();
      if (strict) { // if (strict) play buzzer, return to start of game repeat = false, clear arr.
        gameOver = true;
        $('#start').removeClass('button-on');
      } else {
        repeat = true;
        user_arr = [];
      }
    } else {
      correct = true;
    }
  };

  var playLights = function() {
    $(".light").css("pointer-events", "none");
    $('#playerTurn').hide();
    $('#computerTurn').show();

    for (var i = 0; i < arr.length; i++) {
      setTimeout(function(x) {
        return function() {
          var num = arr[x];
          var name = '#light' + num;
          $(name).removeClass('opaque');
          sounds[num].play();
          setTimeout(function() {$(name).addClass('opaque');}, 500);
        };
      }(i), 1000 * i);
    }
    $(".light").css("pointer-events", "auto");
    setTimeout(function() {$('#computerTurn').hide();}, 1000 * arr.length);
    setTimeout(function() {$('#playerTurn').show();}, 1000 * arr.length);
    repeat = false;
  };

  //gameplay function
  var gameplay = function() {
    // (if repeat step !=true) increment counter++, generate random number, log number to array
    if (!repeat || arr === []) {
      counter++;
      $('#counter').html('<h2>' + counter + '</h2>');
      var randomSlot = Math.floor(Math.random() * 4);
      arr.push(randomSlot);
    }
    // play each arr[light[num]] opacity =1 then off, play sound[number].
    playLights();
    // user click light, opacity =1 then off, play sound. log number to user array.
  };

  //player click function
  $('.light').click(function() {
    console.log(arr.length);
    if (arr.length !== 0) {
    var name = $(this).attr('id');
    var num = parseInt(name.charAt(name.length - 1));
    $('#' + name).toggleClass('opaque');
    sounds[num].play();
    setTimeout(function() {$('#' + name).toggleClass('opaque');}, 500);
    user_arr.push(num);

    checkIfCorrect();
    if (correct) { setTimeout(function() {checkIfEnd();}, 1000); }
    if (gameOver) {setTimeout(function() {reset();}, 2000); }
    if (repeat) {
      $('#playerTurn').hide();
      $('#tryAgain').show();
      setTimeout(function() {$('#tryAgain').hide();}, 2000);
      setTimeout(function() {playLights();}, 2000);
    }
    }
  });

  // when click power, opacity = 1, counter text on
  $('#power').click(function() {
    if (power) {
      //$(this).addClass('opaque');
      $('button').addClass('opaque');
      $('button').removeClass('button-on');
      power = false;
      reset();
      $('#counter h2').hide();
    } else {
      $('button').removeClass('opaque');
      $(this).addClass('button-on');
      power = true;
      $('#counter').html('<h2>' + counter + '</h2>');
      $('#counter h2').show();
    }
  });

  // when click strict button, opacity = 1, strict = true
  $('#strict').click(function() {
    if (power) {
      if (strict) {
        $(this).removeClass('button-on');
        strict = false;
      } else {
        $(this).addClass('button-on');
        strict = true;
      }
    }
  });

  // when click start button
  $('#start').click(function() {
    if (power) {
      $(this).addClass('button-on');
      reset();
      gameplay();
    }
  });

  // click reset  button arr=[], counter = 0
  $('#reset').click(function() {
    if (power) {
      $('#reset').addClass('button-on');
      $('#start').removeClass('button-on');
      setTimeout(function() {$('#reset').removeClass('button-on');}, 500);
      reset();
    }
  });

});