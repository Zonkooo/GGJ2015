function Board(sprites)
{
	gridInitX = 100;
	gridInitY = 100;
	blockSize = 75;
	blockExtraHeight = 25;

	level = [ // 14 x 7 squares
	"______________",
	"___X_______XX_",
	"_X___XXX_X_XX_",
	"_XX__X_X_X__X_",
	"_X___X_X_X____",
	"_XXX_XXX_XXX__",
	"______________",
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
				if(char == '_')
				{
					//build name of stuff
					l = +l; c = +c; //convert to ints
					var name = "";
					name += l > 0 ? level[l-1][c] : "X";
					name += c < 13 ? level[l][c+1] : "X";
					name += l < 6 ? level[l+1][c] : "X";
					name += c > 0 ? level[l][c-1] : "X";
					var block = new createjs.Sprite(this.textures[char][0], name);
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
