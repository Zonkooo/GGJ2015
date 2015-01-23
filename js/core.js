var preloadCount = 0;
var preloadTotal = 2;

var stage;


function startGame()
{
	preloadAssets();
}

function preloadAssets()
{
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
