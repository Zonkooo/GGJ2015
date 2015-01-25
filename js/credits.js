var preloadCount = 0;
var preloadTotal = 7;

var stage;
var isKeyPressed = [];
FPS = 60;
var gamepads = [];

var imgBg = new Image();
var imgCred = new Image();

var text = [];

function startGame()
{
	stage = new createjs.Stage(document.getElementById("gameCanvas"));
	var loadingtxt = new createjs.Text("Loading...", "20px Arial", "white");
	loadingtxt.x = 600; loadingtxt.y = 350;
	loadingtxt.textAlign = "center"; loadingtxt.textBaseline = "middle";
	stage.addChild(loadingtxt);
	stage.update();

	preloadAssets();
}

function preloadAssets()
{
	for(i = 1; i <= 5; i++)
	{
		var line = new Image();
		line.onload = preloadUpdate();
		line.src = "media/credits/spr_menu_title_" + i + ".png";
		text.push(line);
	}

	imgBg.onload = preloadUpdate();
	imgBg.src = "media/credits/spr_menu_background.png";

	imgCred.onload = preloadUpdate();
	imgCred.src = "media/credits/spr_menu_cred.png";

	preloadTotal++;
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
	var cred = new createjs.Bitmap(imgCred);
	cred.x = 140;
	cred.y = 250;
	stage.addChild(cred);

	var offset = {x:600, y:-120};
	for(i in text)
	{
		var spSheet = new createjs.SpriteSheet({
					images: [text[i]],
					frames: {height: 512, width: 512},
					animations: {
						text: [0, 12, "text", 0.3],
					}
				});
		var sprite = new createjs.Sprite(spSheet, "text");
		sprite.x = offset.x;
		sprite.y = offset.y + i*50;
		stage.addChild(sprite);
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
