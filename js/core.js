var preloadCount = 0;
var preloadTotal = 18;

var stage;
var imgPlayers = [];
var imgObstacles = [];
var imgGround = new Image();
var imgFireball = new Image();

var imgEmptyGem = new Image();
var imgBlueGem = new Image();
var imgYellowGem = new Image();
var imgPinkGem = new Image();
var imgGreenGem = new Image();

var imgBg = new Image();

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

	imgBg.onload = preloadUpdate();
	imgBg.src = "media/spr_gui_background.png";

	for(i = 1; i <= 4; i++)
	{
		var player = new Image();
		player.onload = preloadUpdate();
		player.src = "media/gozilla_spritesheet" + i + ".png";
		imgPlayers.push(player);
	}

	for(i = 1; i <= 6; i++)
	{
		var obstacles = new Image();
		obstacles.onload = preloadUpdate();
		obstacles.src = "media/env/bdg" + i + ".png";
		imgObstacles.push(obstacles);
	}

	imgGround.onload = preloadUpdate();
	imgGround.src = "media/env/roads.png";
	
	imgFireball.onload = preloadUpdate();
	imgFireball.src = "media/fireball.png";

	imgEmptyGem.onload = preloadUpdate();
	imgEmptyGem.src = "media/spr_gui_gem_empty.png";
	imgBlueGem.onload = preloadUpdate();
	imgBlueGem.src = "media/spr_gui_gem_blue.png";
	imgYellowGem.onload = preloadUpdate();
	imgYellowGem.src = "media/spr_gui_gem_jaune.png";
	imgPinkGem.onload = preloadUpdate();
	imgPinkGem.src = "media/spr_gui_gem_purple.png";
	imgGreenGem.onload = preloadUpdate();
	imgGreenGem.src = "media/spr_gui_gem_verte.png";


	createjs.Sound.registerSound("media/pika.wav", commandSetSound, maxActionsToProgram*4);


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

	var groundSheet = new createjs.SpriteSheet({
			images: [imgGround],
			frames: {height: 100, width: 75},
			animations: {
				XX_X: [0,  0],
				_XXX: [2,  2],
				XXX_: [4,  4],
				X_XX: [6,  6],
				X__X: [8,  8],
				_XX_: [10, 10],
				XX__: [12, 12],
				__XX: [14, 14],
				_X_X: [16, 16],
				X_X_: [18, 18],
				____: [20, 20],
				X___: [22, 22],
				_X__: [24, 24],
				__X_: [26, 26],
				___X: [28, 28],
			}
		});
	sprites['_'] = [groundSheet];
	board = new Board(sprites);
	board.Load();

	var spriteP1 = new createjs.Sprite(getPlayerSpSheet(1), "idleright");
	players.push(new Player(spriteP1, {x:0, y:0}, {up:38, down:40, left:37, right:39, attackup:49, attackdown:50, attackleft:51, attackright:52}, 0));

	var spriteP2 = new createjs.Sprite(getPlayerSpSheet(2), "idleleft");
	players.push(new Player(spriteP2, {x:13, y:0}, {up:90, down:83, left:81, right:68, attackup:53, attackdown:54, attackleft:55, attackright:56}, 1));

	var spriteP3 = new createjs.Sprite(getPlayerSpSheet(3), "idleright");
	players.push(new Player(spriteP3, {x:0, y:6}, {up:79, down:76, left:75, right:77, attackup:96, attackdown:97, attackleft:98, attackright:99}, 2));

	var spriteP4 = new createjs.Sprite(getPlayerSpSheet(4), "idleleft");
	players.push(new Player(spriteP4, {x:13, y:6}, {up:84, down:71, left:70, right:72, attackup:100, attackdown:101, attackleft:102, attackright:103}, 3));

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

function getPlayerSpSheet(num)
{
	return new createjs.SpriteSheet({
				images: [imgPlayers[num-1]],
				frames: {height: 225, width: 225, regX: 75, regY: 75},
				animations: {
					down: [0, 3, "down", 0.1],
					up: [8, 11, "up", 0.1],
					right: [16, 19, "right", 0.1],
					left: [24, 27, "left", 0.1],

					idledown: [4, 5, "idledown", 0.1],
					idleup: [12, 13, "idleup", 0.1],
					idleright: [20, 21, "idleright", 0.1],
					idleleft: [28, 29, "idleleft", 0.1],
				}
			});
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
				if(player.programmedActions.length > 0)
					console.log(p + " at " + player.gridPosition.x + "," + player.gridPosition.y + " does " + player.programmedActions);
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

				// TODO : this should be done properly
				for(p in players)
				{
					var player = players[p];
					player.attackBitmap.visible = false;
				}


			}
		}
	}

	// if 3 players dead, reset the game


	//update interface
	interfaceElement.updateState();

	// Update main scene
	stage.update();
}

function resetGame()
{
	// TODO
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
