var preloadCount = 0;
var preloadTotal = 1;

var stage;
var imgPlayer1 = new Image();

var player1;

var isKeyPressed = [];

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
}

function preloadUpdate()
{
	preloadCount++;
	if(preloadCount == preloadTotal)
		launchGame();
}

function launchGame()
{
	stage = new createjs.Stage(document.getElementById("gameCanvas"));

	var bitmapPlayer1 = new createjs.Bitmap(imgPlayer1); // will become a sprite
	player1 = new Player(bitmapPlayer1);
	stage.addChild(player1.internalBitmap);

	createjs.Ticker.setFPS(60);
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
	// Update players
	player1.updateState();

	// Update main scene
	stage.update();
}
