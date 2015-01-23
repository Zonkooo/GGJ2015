function Board(sprites)
{
	gridInitX = 100;
	gridInitY = 100;
	blockSize = 75;
	blockExtraHeight = 25;

	this.level = [ // 14 x 7 squares
	"..............",
	".X............",
	"..X...X.XXX...",
	"...X..X...X...",
	"....XXX.X.X...",
	"........X.X...",
	"..............",
	];

	this.textures = sprites;

	this.Load = function()
	{
		for(l in this.level)
		{
			line = this.level[l];
			for(c in line)
			{
				char = line[c];
				var block = new createjs.Bitmap(this.textures[char]);
				block.regY = blockExtraHeight;
				block.x = c*blockSize + gridInitX;
				block.y = l*blockSize + gridInitY;
				stage.addChild(block);
			}
		}
	}
}
