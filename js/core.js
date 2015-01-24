var preloadCount = 0;
var preloadTotal = 3;

var stage;
var imgPlayer1 = new Image();
var imgObstacle = new Image();
var imgGround = new Image();

var player1;
var player2;
var GM;

var isKeyPressed = [];

var FPS = 60;
var frameBeforeAction = FPS * 5;
var elapsedFrames = 0;
var currentTurn = 0;
var gameState = "programActions";

var gamepads = [];


function startGame()
{
	stage = new createjs.Stage(document.getElementById("gameCanvas"));
	var text = new createjs.Text("Loading...");
	text.x = 600; text.y = 350;
	text.textAlign = "center"; text.textBaseline = "middle";
	stage.addChild(text);
	stage.update();

	preloadAssets();
}

function preloadAssets()
{
	imgPlayer1.onload = preloadUpdate();
	imgPlayer1.src = "media/pacman.png";

	imgObstacle.onload = preloadUpdate();
	imgObstacle.src = "media/obstacle.png";

	imgGround.onload = preloadUpdate();
	imgGround.src = "media/ground.png";
}

function preloadUpdate()
{
	preloadCount++;
	if(preloadCount == preloadTotal)
		launchGame();
}

function launchGame()
{
	initGamepad();

	var sprites = [];
	sprites['X'] = imgObstacle;
	sprites['.'] = imgGround;
	board = new Board(sprites);
	board.Load();

	var bitmapPlayer1 = new createjs.Bitmap(imgPlayer1); // will become a sprite
	player1 = new Player(bitmapPlayer1, {x:0, y:0}, {up:38, down:40, left:37, right:39});
	stage.addChild(player1.internalBitmap);

	var bitmapPlayer2 = new createjs.Bitmap(imgPlayer1); // will become a sprite
	player2 = new Player(bitmapPlayer2, {x:13, y:0}, {up:90, down:83, left:81, right:68});
	stage.addChild(player2.internalBitmap);

	GM = new GameMaster([player1, player2]);

	createjs.Ticker.setFPS(FPS);
	createjs.Ticker.addEventListener("tick", update);


	//manage keyboard state
	document.onkeydown = function(e){
	    var key = code(e);
	    isKeyPressed[key] = true;
	};
	document.onkeyup = function(e){
	    var key = code(e);
	    isKeyPressed[key] = false;
	};
}

function code(e)
{
	e = e || window.event;
	return(e.keyCode || e.which);
}

function update(event)
{
	if (gameState == "programActions")
	{
		elapsedFrames++;
		player1.updateProgramPhase();
		player2.updateProgramPhase();


		if (elapsedFrames >= frameBeforeAction)
		{
			elapsedFrames = 0;
			gameState = "playActions";

			player1.programmedActions.reverse();
			player2.programmedActions.reverse();
		}

	}
	else
	{
		GM.Update();

		// Update players
		player1.updatePlayPhase();
		player2.updatePlayPhase();

		currentTurn++;
		if(currentTurn >= maxActionsToProgram)
		{
			gameState = "programActions";
			currentTurn = 0;
		}
	}
	// Update main scene
	stage.update();
}

function initGamepad()
{
	// Check and see if gamepadconnected/gamepaddisconnected is supported.
	// If so, listen for those events and don't start polling until a gamepad
	// has been connected.
	if ('ongamepadconnected' in window) 
	{
	window.addEventListener('gamepadconnected',
	              onGamepadConnect, false);
	window.addEventListener('gamepaddisconnected',
	                onGamepadDisconnect, false);
	} 
	else 
	{
	// If connection events are not supported just start polling
	startPolling();
	}
}

/**
   * React to the gamepad being connected.
   */
function  onGamepadConnect(event) {
    // Add the new gamepad on the list of gamepads to look after.
    gamepads.push(event.gamepad);

    // Ask the tester to update the screen to show more gamepads.
    //tester.updateGamepads(gamepadSupport.gamepads);

    // Start the polling loop to monitor button changes.
    startPolling();
  }

  /**
   * Starts a polling loop to check for gamepad state.
   */
   ticking = false;
   prevRawGamepadTypes = [];
   prevTimestamps = [];
function  startPolling() {
    // Don’t accidentally start a second loop, man.
    if (!ticking) {
      ticking = true;
      gamepadtick();
    }
  }

  function gamepadtick() {
    pollStatus();
    scheduleNextTick();
  }

  function scheduleNextTick() 
  {
    // Only schedule the next frame if we haven’t decided to stop via
    // stopPolling() before.
    if (ticking) {
      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(gamepadtick);
      } else if (window.mozRequestAnimationFrame) {
        window.mozRequestAnimationFrame(gamepadtick);
      } else if (window.webkitRequestAnimationFrame) {
        window.webkitRequestAnimationFrame(gamepadtick);
      }
      // Note lack of setTimeout since all the browsers that support
      // Gamepad API are already supporting requestAnimationFrame().
    }
  }

  /**
   * Checks for the gamepad status. Monitors the necessary data and notices
   * the differences from previous state (buttons for Chrome/Firefox,
   * new connects/disconnects for Chrome). If differences are noticed, asks
   * to update the display accordingly. Should run as close to 60 frames per
   * second as possible.
   */
  function pollStatus() 
  {
    // Poll to see if gamepads are connected or disconnected. Necessary
    // only on Chrome.
    pollGamepads();

    for (var i in gamepads) {
      var gamepad = gamepads[i];

      // Don’t do anything if the current timestamp is the same as previous
      // one, which means that the state of the gamepad hasn’t changed.
      // This is only supported by Chrome right now, so the first check
      // makes sure we’re not doing anything if the timestamps are empty
      // or undefined.
      if (gamepad.timestamp &&
          (gamepad.timestamp == prevTimestamps[i])) {
        continue;
      }
      prevTimestamps[i] = gamepad.timestamp;

      updateButtonsPressed(i);
    }
  }

  function pollGamepads() {
    // Get the array of gamepads – the first method (getGamepads)
    // is the most modern one and is supported by Firefox 28+ and
    // Chrome 35+. The second one (webkitGetGamepads) is a deprecated method
    // used by older Chrome builds.
    var rawGamepads =
        (navigator.getGamepads && navigator.getGamepads()) ||
        (navigator.webkitGetGamepads && navigator.webkitGetGamepads());

    if (rawGamepads) {
      // We don’t want to use rawGamepads coming straight from the browser,
      // since it can have “holes” (e.g. if you plug two gamepads, and then
      // unplug the first one, the remaining one will be at index [1]).
      gamepads = [];

      // We only refresh the display when we detect some gamepads are new
      // or removed; we do it by comparing raw gamepad table entries to
      // “undefined.”
      var gamepadsChanged = false;

      for (var i = 0; i < rawGamepads.length; i++) {
        if (typeof rawGamepads[i] != prevRawGamepadTypes[i]) {
          gamepadsChanged = true;
          prevRawGamepadTypes[i] = typeof rawGamepads[i];
        }

        if (rawGamepads[i]) {
          gamepads.push(rawGamepads[i]);
        }
      }
    }
  }

  function updateButtonsPressed(gamepadId)
  {
  	var gamepad = gamepads[gamepadId];
  }
