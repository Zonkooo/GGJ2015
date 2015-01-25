function Board(sprites)
{
	gridInitX = 75;
	gridInitY = 90;
	blockSize = 75;
	blockExtraHeight = 25;

	level = [ // 14 x 7 squares
	"JaadaQKaadadaQ",
	"WXATQCgbRTQDXW",
	"YJMXYXWXBJfaRY",
	"UfdETacaceXJMD",
	"JbfdQXVXVTcfaR",
	"WXBgfbeHeXCBXW",
	"TaffaafafaafaM",
	];

	texturesPerBlock = [];
	this.textures = sprites;

	this.Load = function()
	{
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
					var candidates = this.textures[char];
					var block = new createjs.Bitmap(candidates[Math.floor(Math.random() * candidates.length)]);
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
