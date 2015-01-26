var preloadCount = 0;
var preloadTotal = 1;

var stage;
var isKeyPressed = [];
FPS = 5;
var gamepads = [];

var imgBg = new Image();

function startGame()
{
	stage = new createjs.Stage(document.getElementById("gameCanvas"));
	var text = new createjs.Text("Loading...", "20px Arial", "white");
	text.x = 600; text.y = 350;
	text.textAlign = "center"; text.textBaseline = "middle";
	stage.addChild(text);
	stage.update();

	preloadAssets();
}

function preloadAssets()
{
	imgBg.onload = preloadUpdate();
	imgBg.src = "media/titre_spritesheet.png";
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
	stage.enableMouseOver();

	var spSheet = new createjs.SpriteSheet({
				images: [imgBg],
				frames: {height: 700, width: 1200},
				animations: {
					incoming: [0, 7, "sta", 0.3],
					sta: [8, 9, "sta", 0.3],
				}
			});
	var sprite = new createjs.Sprite(spSheet, "incoming");

	var cred = new createjs.Shape();
	cred.graphics.beginFill("#000").rect(950, 590, 200, 70);
	cred.addEventListener("click", function(event) { location = "credits.html"; });
	cred.cursor = "pointer";
	stage.addChild(cred);

	var btn2p = new createjs.Shape();
	btn2p.graphics.beginFill("#000000").drawRect(455, 480, 100, 100);
	btn2p.addEventListener("click", function(event) { gotoGame(2); });
	btn2p.cursor = "pointer";
	stage.addChild(btn2p);
	var btn3p = new createjs.Shape();
	btn3p.graphics.beginFill("#000000").drawRect(580, 480, 100, 100);
	btn3p.addEventListener("click", function(event) { gotoGame(3); });
	btn3p.cursor = "pointer";
	stage.addChild(btn3p);
	var btn4p = new createjs.Shape();
	btn4p.graphics.beginFill("#000000").drawRect(697, 480, 100, 100);
	btn4p.addEventListener("click", function(event) { gotoGame(4); });
	btn4p.cursor = "pointer";
	stage.addChild(btn4p);

	stage.addChild(new createjs.Bitmap(imgBg));

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
