// first wait for the load!
$(function () {

  // Slap a universal jQuery event handler on the buttons
  // Then drive the whole program from two on-click events!

  var xPlayerState = true;
  var winner = false;
  var catsLives = 0;
  var catsGame = false;
  var buttons = null;
  var upFlashingTimer = null;
  var downFlashingTimer = null;
  var upTimer = null;
  var delayTimer = null;
  var whooshO = $("audio")[0];
  var whooshX = $("audio")[1];
  var applause = $("audio")[2];
  var meow = $("audio")[3];
  $("#X").css("background-color", "blue");
  $("#O").css("background-color", ""); // vs firebrick

  // create an object to store the field state so we can check for a winner;
  // note: there is a one-to-one correspondence to each field button id.
  var fldBtnState = {
    a1: "", a2: "", a3: "",
    b1: "", b2: "", b3: "",
    c1: "", c2: "", c3: "",
  };

  var resetBoard = function () {

    // Make sure a timer doesn't fire after we reset!
    clearTimeout(delayTimer); //kill first to preempt spawning another upFlasher.
    clearTimeout(upTimer);
    clearInterval(upFlashingTimer);
    clearInterval(downFlashingTimer);

    // Reset the fldBtnState object.
    for (var buttonId in fldBtnState) {
      fldBtnState[buttonId] = "";
    };

    // Reset everything else.
    $(".field").html("click me");
    $(".field").css("background-color", "");
    catsLives = 0;
    xPlayerState = true;
    winner = false;
    catsGame = false;
    buttons = null;
    $("#X").css("background-color", "blue");
    $("#O").css("background-color", "");
    $("button").css("opacity", 1);

    // strangle the cat, the people, and the whoosh.
    meow.pause();
    meow.currentTime = 0;
    applause.pause();
    applause.currentTime = 0;
    whooshO.pause();
    whooshO.currentTime = 0;
    whooshX.pause();
    whooshX.currentTime = 0;
  };

  var processWinner = function (winningRow) {
    // disable the click handler;
    winner = true;

    // play either the cat or the applause audio.
    catsGame ? meow.play() : applause.play();

    // turn off the player indicator buttons background color.
    $("#X, #O").css("background-color", "");

    // get a handle on the winning buttons.
    buttons = $(winningRow);

    // start the first flash down cycle asap.
    buttons.css("opacity", 0.6);

    // start up cycle 600ms after asap.
    upTimer = setTimeout(function () { buttons.css("opacity", 1.0) }, 600);

    // downFlashingTimer starts 1200ms after asap and repeats every 1200ms.
    downFlashingTimer = setInterval(function () {
      buttons.css("opacity", 0.6);
    }, 1200);

    // delay upFlasher by 600ms putting it 180 deg out of phase with downFlasher
    delayTimer = setTimeout(function () {

      // upFlashingTimer starts 1800 ms after asap and repeats every 1200 ms.
      upFlashingTimer = setInterval(function () {
        buttons.css("opacity", 1.0);
      }, 1200);
    }, 600);
  };

  // check to see if player won, brute force, no finesse...
  var checkWinner = function () {
    var player = xPlayerState ? "X" : "O";

    // check each row;
    if ((fldBtnState.a1 === player) && (fldBtnState.a2 === player) && (fldBtnState.a3 === player)) {
      processWinner(".r1"); return true;
    };
    if ((fldBtnState.b1 === player) && (fldBtnState.b2 === player) && (fldBtnState.b3 === player)) {
      processWinner(".r2"); return true;
    };
    if ((fldBtnState.c1 === player) && (fldBtnState.c2 === player) && (fldBtnState.c3 === player)) {
      processWinner(".r3"); return true;
    };

    // check each column;
    if ((fldBtnState.a1 === player) && (fldBtnState.b1 === player) && (fldBtnState.c1 === player)) {
      processWinner(".c1"); return true;
    };
    if ((fldBtnState.a2 === player) && (fldBtnState.b2 === player) && (fldBtnState.c2 === player)) {
      processWinner(".c2"); return true;
    };
    if ((fldBtnState.a3 === player) && (fldBtnState.b3 === player) && (fldBtnState.c3 === player)) {
      processWinner(".c3"); return true;
    };

    // check each diagonal;
    if ((fldBtnState.a1 === player) && (fldBtnState.b2 === player) && (fldBtnState.c3 === player)) {
      processWinner(".d1"); return true;
    };
    if ((fldBtnState.c1 === player) && (fldBtnState.b2 === player) && (fldBtnState.a3 === player)) {
      processWinner(".d2"); return true;
    };

    // no winner yet.
    return false;
  }

  // First event handler.
  // When the reset button is clicked on...
  $("#reset").on("click", function () { resetBoard() });

  // Second event handler.
  // When a field button is clicked on...
  $("button.field").on("click", function () {

    // Kill all field click events until reset (New Game) is Selected.
    if (winner) return;

    var buttonId = $(this).attr('id');
    var button = $("#" + buttonId);

    // If square already played! Wait for another click.
    if (fldBtnState[buttonId] !== "") return;

    catsLives++;       // Increment the cat!
    if (xPlayerState) { // it was X's turn.
      // reset the whoosh making sure it isn't still playing then play it.
      whooshX.pause();
      whooshX.currentTime = 0;
      whooshX.play();
      fldBtnState[buttonId] = "X";
      button.html("X");
      button.css("background-color", "blue");
      $("#X").css("background-color", "");
      $("#O").css("background-color", "firebrick");
      if (checkWinner()) return;
      xPlayerState = false;
    }
    else {              // it was O's turn.
      // reset the whoosh making sure it isn't still playing then play it.
      whooshO.pause();
      whooshO.currentTime = 0;
      whooshO.play();
      fldBtnState[buttonId] = "O";
      button.html("O");
      button.css("background-color", "firebrick");
      $("#X").css("background-color", "blue");
      $("#O").css("background-color", "");
      if (checkWinner()) return;
      xPlayerState = true;
    };
    // no winner and 9 plays? The cat wins.
    if (catsLives === 9) {
      catsGame = true; processWinner(".field");
    };
  });
});
