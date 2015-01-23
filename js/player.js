var sizeOfTileInPixels = 75;
var maxActionsToProgram = 3;

function Player(bitmap)
{
	var self = this;
	this.internalBitmap = bitmap;
	this.internalBitmap.x = gridInitX;
	this.internalBitmap.y = gridInitY;

	this.gridPosition = {x:0, y:0};


	var programmedActions = [];
	

	//called at each tick of play phase
	this.updatePlayPhase = function()
	{
		// read programmed actions
		if(isKeyPressed[37] && this.gridPosition.x > 0 && level[this.gridPosition.y][this.gridPosition.x-1] == '.') // left
		{
			this.internalBitmap.x -= sizeOfTileInPixels;
			this.gridPosition.x -=1;
		}
		if(isKeyPressed[39] && this.gridPosition.x < level[0].length-1 && level[this.gridPosition.y][this.gridPosition.x+1] == '.') // right
		{
			this.internalBitmap.x += sizeOfTileInPixels;
			this.gridPosition.x +=1;
		}
		if(isKeyPressed[38] && this.gridPosition.y > 0 && level[this.gridPosition.y-1][this.gridPosition.x] == '.') // up
		{
			this.internalBitmap.y -= sizeOfTileInPixels;
			this.gridPosition.y -=1;
		}
		if(isKeyPressed[40] && this.gridPosition.y < level.length-1 && level[this.gridPosition.y+1][this.gridPosition.x] == '.') // down
		{
			this.internalBitmap.y += sizeOfTileInPixels;
			this.gridPosition.y +=1;
		}

		var spriteUnderPlayer = texturesPerBlock[this.gridPosition.y][this.gridPosition.x];
		stage.removeChild(this.internalBitmap);
		var index = stage.getChildIndex(spriteUnderPlayer);
		stage.addChildAt(this.internalBitmap, index+1);
		// draw new shape
		//this.internalBitmap.draw();
	}


	//	called at each tick of program Phase
	this.updateProgramPhase = function()
	{
		// store actions
		if (programmedActions.length <= maxActionsToProgram)
		{
			if(isKeyPressed[37]) // left
			{
				programmedActions.Push(37);
			}
			if(isKeyPressed[39]) // right
			{
				programmedActions.Push(39);
			}
			if(isKeyPressed[38]) // up
			{
				programmedActions.Push(38);
			}
			if(isKeyPressed[40]) // down
			{
				programmedActions.Push(40);
			}
		}
	}
}
