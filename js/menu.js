var stage;
FPS = 5;

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
	imgBg.onload = function(){launchGame();};
	imgBg.src = "media/titre_spritesheet.png";

	createjs.Sound.addEventListener("fileload", playsound);
	createjs.Sound.alternateExtensions = ["mp3"];
	createjs.Sound.registerSound("media/sound/mus_loop.ogg", "soundtrack");
}

function playsound()
{
	createjs.Sound.play("soundtrack", {loop:-1});
}

function launchGame()
{
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
