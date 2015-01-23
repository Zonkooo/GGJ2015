var preloadCount = 0;
var preloadTotal = 1;

var stage;

var imgPlayer1 = new Image();


function startGame()
{
	preloadAssets();
}

function preloadAssets()
{
	imgPlayer.onload = preloadUpdate();
	imgPlayer.src = "media/pacman.png";
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

	


	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener("tick", update);
}


function update(event)
{
	stage.update();
}
