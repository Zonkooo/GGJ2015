var preloadCount = 0;
var preloadTotal = 5;

var stage;
var imgPlayer1 = new Image();
var imgObstacle = new Image();
var imgGround = new Image();
var imgCommandSet = new Image();
var imgCommandNotSet = new Image();

var commandSetSound = "commandSet";

var players = [];
var player1;
var player2;
var GM;
var interfaceElement;

var isKeyPressed = [];

var FPS = 60;
var secondsBeforeAction = 5;
var frameBeforeAction = FPS * secondsBeforeAction;
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

	imgCommandSet.onload = preloadUpdate();
	imgCommandSet.src = "media/commandSet.png";

	imgCommandNotSet.onload = preloadUpdate();
	imgCommandNotSet.src = "media/commandNotSet.png";

	createjs.Sound.registerSound("media/pika.wav", commandSetSound);
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
	player1 = new Player(bitmapPlayer1, {x:0, y:0}, {up:38, down:40, left:37, right:39}, -1);
	stage.addChild(player1.internalBitmap);
	players.push(player1);

	var bitmapPlayer2 = new createjs.Bitmap(imgPlayer1); // will become a sprite
	player2 = new Player(bitmapPlayer2, {x:13, y:0}, {up:90, down:83, left:81, right:68}, -1);
	stage.addChild(player2.internalBitmap);
	players.push(player2);

	GM = new GameMaster([player1, player2]);
	interfaceElement = new Interface();
	
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
	// update charachters
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

	//update interface
	interfaceElement.updateState();

	// Update main scene
	stage.update();
}



/////////////////// Gamepad support //////////////
ticking = false;
prevRawGamepadTypes = [];
prevTimestamps = [];

function initGamepad()
{
	startPolling();
}

function onGamepadConnect(event)
{
    gamepads.push(event.gamepad);
    startPolling();
}

function startPolling()
{
    // Don’t accidentally start a second loop, man.
    if (!ticking) {
      ticking = true;
      gamepadtick();
    }
  }

function gamepadtick()
{	
	pollStatus();
	scheduleNextTick();
}

function scheduleNextTick() 
{
// Only schedule the next frame if we haven’t decided to stop via
// stopPolling() before.
	if (ticking)
	{
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
function pollStatus() 
{
pollGamepads();

	for (var i in gamepads) {
	  var gamepad = gamepads[i];
	  if (gamepad.timestamp &&
	      (gamepad.timestamp == prevTimestamps[i])) {
	    continue;
	  }
	  prevTimestamps[i] = gamepad.timestamp;
	}
}

function pollGamepads()
{
	var rawGamepads =
	    (navigator.getGamepads && navigator.getGamepads()) ||
	    (navigator.webkitGetGamepads && navigator.webkitGetGamepads());

	if (rawGamepads) {
	  gamepads = [];
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
