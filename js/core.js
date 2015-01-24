var preloadCount = 0;
var preloadTotal = 5;

var stage;
var imgPlayer1 = new Image();
var imgObstacles = [];
var imgGround = new Image();
var imgCommandSet = new Image();
var imgCommandNotSet = new Image();

var commandSetSound = "commandSet";

var players = [];
var GM;
var interfaceElement;

var isKeyPressed = [];

FPS = 60;
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

	for(i = 1; i <= 6; i++)
	{
		var obstacles = new Image();
		obstacles.onload = preloadUpdate();
		obstacles.src = "media/env/bdg" + i + ".png";
		imgObstacles.push(obstacles);
	}

	imgGround.onload = preloadUpdate();
	imgGround.src = "media/env/road_cross.png";

	imgCommandSet.onload = preloadUpdate();
	imgCommandSet.src = "media/commandSet.png";

	imgCommandNotSet.onload = preloadUpdate();
	imgCommandNotSet.src = "media/commandNotSet.png";

	createjs.Sound.registerSound("media/pika.wav", commandSetSound, maxActionsToProgram);
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
	sprites['X'] = imgObstacles;
	sprites['.'] = [imgGround];
	board = new Board(sprites);
	board.Load();

	var playerSheet = new createjs.SpriteSheet({
			images: [imgPlayer1],
			frames: {height: 75, width: 75},
			animations: {
				right: [0, 0],
				down: [1, 1],
				up: [2, 2],
				left: [3, 3],
			}
		});

	var spriteP1 = new createjs.Sprite(playerSheet, "right");
	players.push(new Player(spriteP1, {x:0, y:0}, {up:38, down:40, left:37, right:39}, 0));

	var spriteP2 = new createjs.Sprite(playerSheet, "left");
	players.push(new Player(spriteP2, {x:13, y:0}, {up:90, down:83, left:81, right:68}, 1));

	var spriteP3 = new createjs.Sprite(playerSheet, "right");
	players.push(new Player(spriteP3, {x:0, y:6}, {up:79, down:76, left:75, right:77}, 2));

	var spriteP4 = new createjs.Sprite(playerSheet, "left");
	players.push(new Player(spriteP4, {x:13, y:6}, {up:84, down:71, left:70, right:72}, 3));

	GM = new GameMaster(players);
	interfaceElement = new Interface();
	interfaceElement.load();

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
		for(p in players)
		{
			var player = players[p];
			player.updateProgramPhase();
		}

		if (elapsedFrames >= frameBeforeAction)
		{
			elapsedFrames = 0;
			gameState = "playActions";

			for(p in players)
			{
				var player = players[p];
				player.programmedActions.reverse();
			}
		}

	}
	else
	{
		var allDone = true;
		// Update players
		for(p in players)
		{
			var player = players[p];
			player.updatePlayPhase();
			allDone &= player.animDone;
		}

		if(allDone)
		{
			GM.Update();

			currentTurn++;
			if(currentTurn >= maxActionsToProgram+1)
			{
				gameState = "programActions";
				currentTurn = 0;
			}
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
