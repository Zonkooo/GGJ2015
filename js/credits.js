var preloadCount = 0;
var preloadTotal = 7;

var stage;
FPS = 15;

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
		var line = loadImage("media/credits/spr_menu_title_" + i + ".png");
		text.push(line);
	}
	imgBg = loadImage("media/credits/spr_menu_background.png");
	imgCred = loadImage("media/credits/spr_menu_cred.png");
}

function loadImage(src)
{
	var img = new Image();
	img.onload = function(event){
		preloadCount++;
		if(preloadCount == preloadTotal)
			launchGame();
	};
	img.src = src;
	return img;
}

function launchGame()
{
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
						text: [0, 12],
					}
				});
		var sprite = new createjs.Sprite(spSheet, "text");
		sprite.x = offset.x;
		sprite.y = offset.y + i*50;
		stage.addChild(sprite);
	}

	createjs.Ticker.setFPS(FPS);
	createjs.Ticker.addEventListener("tick", update);
}

function update(event)
{
	// Update main scene
	stage.update();
}
