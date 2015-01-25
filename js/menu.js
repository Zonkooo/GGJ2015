var preloadCount = 0;
var preloadTotal = 4;

var stage;
var isKeyPressed = [];
FPS = 60;
var gamepads = [];

var imgBg = new Image();

var img2p = new Image();
var img3p = new Image();
var img4p = new Image();

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
	imgBg.src = "media/menubg.png";

	img2p.onload = preloadUpdate();
	img2p.src = "media/spr_gui_gem_jaune.png";
	img3p.onload = preloadUpdate();
	img3p.src = "media/spr_gui_gem_purple.png";
	img4p.onload = preloadUpdate();
	img4p.src = "media/spr_gui_gem_red.png";

	createjs.Sound.registerSound("media/sound/mus_loop.mp3", soundtrackSound, 1);
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

	var bg = new createjs.Bitmap(imgBg);
	stage.addChild(bg);

	var btn2p = new createjs.Bitmap(img2p);
	btn2p.addEventListener("click", function(event) { gotoGame(2); })
	btn2p.x = 200;
	btn2p.y = 500;
	stage.addChild(btn2p);
	var btn3p = new createjs.Bitmap(img3p);
	btn3p.addEventListener("click", function(event) { gotoGame(3); })
	btn3p.x = 400;
	btn3p.y = 500;
	stage.addChild(btn3p);
	var btn4p = new createjs.Bitmap(img4p);
	btn4p.addEventListener("click", function(event) { gotoGame(4); })
	btn4p.x = 600;
	btn4p.y = 500;
	stage.addChild(btn4p);

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
	if(isKeyPressed[13])
		gotoGame();
	// Update main scene
	stage.update();
}

function gotoGame(nbPlayers)
{
	location = "game.html?nbPlayers=" + nbPlayers;
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
