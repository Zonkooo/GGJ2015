function Board(sprites)
{
	gridInitX = 100;
	gridInitY = 100;
	blockSize = 75;
	blockExtraHeight = 25;

	level = [ // 14 x 7 squares
	"..............",
	".X............",
	"..X...X.XXX...",
	"...X..X...X...",
	"....XXX.X.X...",
	"........X.X...",
	"..............",
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
				var candidates = this.textures[char];
				var block = new createjs.Bitmap(candidates[Math.floor(Math.random() * candidates.length)]);
				block.regY = blockExtraHeight;
				block.x = c*blockSize + gridInitX;
				block.y = l*blockSize + gridInitY;
				stage.addChild(block);

				texturesPerBlock[l].push(block);
			}
		}
	}
}
