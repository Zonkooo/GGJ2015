var preloadCount = 0;
var preloadTotal = 27;

var stage;
var imgPlayers = [];
var imgObstacles = [];
var imgGround = new Image();
var imgFireball = new Image();
var imgAshes = new Image();

var imgAttackIcon = new Image();
var imgMoveIcon = new Image();

var imgEmptyGem = new Image();
var imgBlueGem = new Image();
var imgYellowGem = new Image();
var imgPinkGem = new Image();
var imgGreenGem = new Image();

var imgBg = new Image();

var imgWin = new Image();

var imgStartProg = new Image();
var imgEndProg = new Image();

var commandSetSound = "commandSet";
var commandCompleteSound = "commandComplete";
var attackHitSound = "attackHit";
var attackMissSound = "attackMiss";
var soundtrackSound = "soundtrack";

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

var startProgScreen;
var endProgScreen;

var movePool = [];
var attackPool = [];
var activePool = [];

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

	imgWin.onload = preloadUpdate();
	imgWin.src = "media/lewin.png";

	createjs.Sound.addEventListener("fileload", preloadUpdate);
	createjs.Sound.registerSound("media/sound/sfx_sound_combo.wav", commandSetSound, maxActionsToProgram*4);
	createjs.Sound.registerSound("media/sound/sfx_sound_finishcombo.wav", commandCompleteSound, 4);
	createjs.Sound.registerSound("media/sound/sfx_attack_fail.mp3", attackMissSound, 4);
	createjs.Sound.registerSound("media/sound/sfx_attack_sucess.mp3", attackHitSound, 4);
	createjs.Sound.registerSound("media/sound/mus_loop.mp3", soundtrackSound, 1);

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
	imgFireball.src = "media/fire.png";

	imgAshes.onload = preloadUpdate();
	imgAshes.src = "media/ashes.png";

	imgEmptyGem.onload = preloadUpdate();
	imgEmptyGem.src = "media/spr_gui_gem_empty.png";
	imgBlueGem.onload = preloadUpdate();
	imgBlueGem.src = "media/spr_gui_gem_red.png";
	imgYellowGem.onload = preloadUpdate();
	imgYellowGem.src = "media/spr_gui_gem_jaune.png";
	imgPinkGem.onload = preloadUpdate();
	imgPinkGem.src = "media/spr_gui_gem_purple.png";
	imgGreenGem.onload = preloadUpdate();
	imgGreenGem.src = "media/spr_gui_gem_verte.png";

	imgStartProg.onload = preloadUpdate();
	imgStartProg.src = "media/spr_gui_announcer_whatdo.png";
	imgEndProg.onload = preloadUpdate();
	imgEndProg.src = "media/spr_gui_announcer_herewego.png";

	imgMoveIcon.onload = preloadUpdate();
	imgMoveIcon.src = "media/moveicon.png";
	imgAttackIcon.onload = preloadUpdate();
	imgAttackIcon.src = "media/attackicon.png";

	// render splash screens
	startProgScreen = new createjs.Bitmap(imgStartProg);
	startProgScreen.x = 340;
	startProgScreen.y = 130;
	endProgScreen = new createjs.Bitmap(imgEndProg);
	endProgScreen.x = 390;
	endProgScreen.y = 150;


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
				A: [0,  0],
                B: [1,  1],
                C: [3,  3],
                D: [4,  4],
                E: [6,  6],
                F: [7, 7],
                G: [9, 9],
                H: [10, 10],
                I: [12, 12],
                J: [13, 13],
                K: [14, 14],
                L: [15, 15],
                M: [16, 16],
                N: [17, 17],
                P: [18, 18],
                Q: [19, 19],
                R: [20, 20],
                S: [21, 21],
                T: [22, 22],
                U: [23, 23],
                V: [24, 24],
                W: [25, 25],
                Y: [26, 26],
                Z: [27, 27],
                a: [28, 28],
                b: [29, 29],
                c: [30, 30],
                d: [33, 33],
                e: [36, 36],
                f: [39, 39],
                g: [42, 42]
			}
		});
	sprites['_'] = [groundSheet];
	board = new Board(sprites);
	board.Load();

	var nbPlayers = getParameterByName("nbPlayers");
	if(nbPlayers != 2 && nbPlayers != 3)
		nbPlayers = 4;

	var spriteP1 = new createjs.Sprite(getPlayerSpSheet(1), "right");
	players.push(new Player(spriteP1, {x:0, y:0}, {up:38, down:40, left:37, right:39, attackup:49, attackdown:50, attackleft:51, attackright:52}, 0));

	var spriteP2 = new createjs.Sprite(getPlayerSpSheet(2), "left");
	players.push(new Player(spriteP2, {x:13, y:0}, {up:90, down:83, left:81, right:68, attackup:53, attackdown:54, attackleft:55, attackright:56}, 1));

	if(nbPlayers > 2)
	{
		var spriteP3 = new createjs.Sprite(getPlayerSpSheet(3), "right");
		players.push(new Player(spriteP3, {x:0, y:6}, {up:79, down:76, left:75, right:77, attackup:96, attackdown:97, attackleft:98, attackright:99}, 2));
	}

	if(nbPlayers > 3)
	{
		var spriteP4 = new createjs.Sprite(getPlayerSpSheet(4), "left");
		players.push(new Player(spriteP4, {x:13, y:6}, {up:84, down:71, left:70, right:72, attackup:100, attackdown:101, attackleft:102, attackright:103}, 3));
	}

	GM = new GameMaster(players);
	interfaceElement = new Interface();
	interfaceElement.load();

	//fill pool
	for(i = 0; i < maxActionsToProgram*4; i++)
	{
		var m = new createjs.Bitmap(imgMoveIcon);
		m.visible = false;
		stage.addChild(m);
		movePool.push(m);

		m.myPool = movePool;
		m.update = function() //pure JS evil
		{
			this.y -= 1;
			this.alpha -= 0.1;
			if(this.alpha < 0)
				this.visible = false;
		}

		var a = new createjs.Bitmap(imgAttackIcon);
		a.visible = false;
		stage.addChild(a);
		attackPool.push(a);

		a.myPool = attackPool;
		a.update = function()
		{
			this.y -= 1;
			this.alpha -= 0.1;
			if(this.alpha < 0)
				this.visible = false;
		}
	}

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
					movdown: [0, 3, "movdown", 0.1],
					movup: [8, 11, "movup", 0.1],
					movright: [16, 19, "movright", 0.1],
					movleft: [24, 27, "movleft", 0.1],

					down: [4, 5, "down", 0.1],
					up: [12, 13, "up", 0.1],
					right: [20, 21, "right", 0.1],
					left: [28, 29, "left", 0.1],

					attdown: [6, 6],
					attup: [14, 14],
					attright: [22, 22],
					attleft: [30, 30],
				}
			});
}

function code(e)
{
	e = e || window.event;
	return(e.keyCode || e.which);
}


freezeDurationInFrames = FPS;
framesSinceFreeze = 0;
frozenState = false;

function update(event)
{
	if (gameState == "win")
	{
		if (isKeyPressed[32]) {
			location.reload();
		} else {
			return;
		}
	}

	for(f in activePool)
	{
		var feedback = activePool[f];
		feedback.update();
	}
	//clean active pool
	for(i = 0; i < activePool.length; i++)
	{
		var item = activePool[i];
		if(item && item.visible == false)
		{
			activePool.splice(i, 1);
			i--;
			item.myPool.push(item);
		}
	}

	// update charachters
	if (gameState == "programActions")
	{
		elapsedFrames++;
		for(p in players)
		{
			var player = players[p];
			player.updateProgramPhase();
		}

		if (elapsedFrames >= frameBeforeAction) // transition to Play phase !
		{

			/*if (framesSinceFreeze <= freezeDurationInFrames) // freeze the update while we display the splash
			{
				if (framesSinceFreeze == 0) {
					stage.addChild(endProgScreen);
				}
				framesSinceFreeze++;
				stage.update();
				return;
			}
			else
			{
				framesSinceFreeze = 0;
				stage.removeChild(endProgScreen);
			}*/

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
	else if(gameState == "playActions")
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
			GM.killPlayers();
			GM.Update();

			currentTurn++;
			if(currentTurn >= maxActionsToProgram+1)  // transition to Program phase !
			{
				/*if (framesSinceFreeze <= freezeDurationInFrames) // freeze the update while we display the splash
				{
					if (framesSinceFreeze == 0) {
						stage.addChild(startProgScreen);
					}
					framesSinceFreeze++;
					stage.update();
					return;
				}
				else
				{
					framesSinceFreeze = 0;
					stage.removeChild(startProgScreen);
				}*/

				gameState = "programActions";
				currentTurn = 0;
			}
		}
	}

	// if 3 players dead, reset the game
	var nbalive = 0;
	for(p in players)
	{
		var player = players[p];
		if (player.aliveStatus != "dead")
		{
			nbalive++;
		}
	}
	if (nbalive == 1) {
		var win = new createjs.Bitmap(imgWin);
		win.x = 320;
		win.y = 0;
		stage.addChild(win);
		gameState = "win";
	}

	//update interface
	interfaceElement.updateState();

	// Update main scene
	stage.update();
}

function resetGame()
{
	// clear everything, relaunch the game (on a new stage ?)
	//TODO
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

function getParameterByName(name) {
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1]);
}
