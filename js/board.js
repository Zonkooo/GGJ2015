function Board(stage) //TODO add all textures as params
{
	level = [
	"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
	"X..............................X",
	"X..............................X",
	"X..............................X",
	"X..............................X",
	"X..............................X",
	"X..............................X",
	"X..............................X",
	"X..............................X",
	"X..............................X",
	"X..............................X",
	"X..............................X",
	"X..............................X",
	"X..............................X",
	"X..............................X",
	"X..............................X",
	"XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
	];

	//TODO save textures here
	this.obstacles = [];

	this.Load = function()
	{
		for(l in level)
		{
			line = level[l];
			for(c in line)
			{
				char = line[c];
				//TODO switch on char, add corresponding obstacle to stage
			}
		}

	}
}
