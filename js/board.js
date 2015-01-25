function Board(sprites)
{
	gridInitX = 75;
	gridInitY = 90;
	blockSize = 75;
	blockExtraHeight = 25;

	level = [];
	levels = [];

	levels[1] = [ // 14 x 7 squares
	"JaadaQKaadadaQ",
	"WXATQCgbRTQDXW",
	"YJMXYXWXBJfaRY",
	"UfdETacaceXJMD",
	"JbfdQXVXVTcfaR",
	"WXBgfbeHeXCBXW",
	"TaffaafafaafaM",
	];

	levels[0] = [ // 14 x 7 squares
	"JaRXJabZdRXIZE",
	"TRgEYBXXDgZeKF",
	"XSeXSfddZLXgLX",
	"XXVXXXgeXXXVXX",
	"XGeXJdffdPXgPX",
	"KbcZeVXXgcbeUQ",
	"UaNXSfFHfNXUaM",
	];

	levels[2] = [
	"IZZZPXXXXJabdR",
	"gEXXgPXXGeXXSe",
	"VXXcccZZdfPXXV",
	"gZZeXgEHeXgZZe",
	"VXXTdfZZcdLXXV",
	"gPXXgFXXSeXXIe",
	"DUaaMXXXXSZZfL",
	];

	texturesPerBlock = [];
	this.textures = sprites;

	this.Load = function()
	{
		level = levels[Math.floor(Math.random()*levels.length)];
		for(l in level)
		{
			texturesPerBlock.push([]);

			line = level[l];
			for(c in line)
			{
				char = line[c];
				if(char != 'X')
				{
					//build name of stuff
					var name = char;
					var block = new createjs.Sprite(this.textures['_'][0], name);
				}
				else
				{
					var block = new createjs.Sprite(buildingSprites[Math.floor(Math.random() * buildingSprites.length)], "idle");
				}
				block.regY = blockExtraHeight;
				block.x = c*blockSize + gridInitX;
				block.y = l*blockSize + gridInitY;
				stage.addChild(block);

				texturesPerBlock[l].push(block);
			}
		}
	}
}
