var sizeOfTileInPixels = 75;
var maxActionsToProgram = 3;

function Player(bitmap, position, controls)
{
	this.internalBitmap = bitmap;

	this.gridPosition = position;

	this.internalBitmap.x = gridInitX + position.x*blockSize;
	this.internalBitmap.y = gridInitY + position.y*blockSize;

	this.programmedActions = [];
	this.currentActionPlaying = 0;

	this.controls = controls;

	//called at each tick of play phase
	this.updatePlayPhase = function()
	{
		//TODO : deal with incomplete inputs (not all actions have been programed)
		//TODO : solve turn first and then dislay
		// read programmed actions.
		if(this.programmedActions[this.currentActionPlaying] == this.controls.left && this.gridPosition.x > 0 && level[this.gridPosition.y][this.gridPosition.x-1] == '.') // left
		{
			this.internalBitmap.x -= sizeOfTileInPixels;
			this.gridPosition.x -=1;
		}
		if(this.programmedActions[this.currentActionPlaying] == this.controls.right && this.gridPosition.x < level[0].length-1 && level[this.gridPosition.y][this.gridPosition.x+1] == '.') // right
		{
			this.internalBitmap.x += sizeOfTileInPixels;
			this.gridPosition.x +=1;
		}
		if(this.programmedActions[this.currentActionPlaying] == this.controls.up && this.gridPosition.y > 0 && level[this.gridPosition.y-1][this.gridPosition.x] == '.') // up
		{
			this.internalBitmap.y -= sizeOfTileInPixels;
			this.gridPosition.y -=1;
		}
		if(this.programmedActions[this.currentActionPlaying] == this.controls.down && this.gridPosition.y < level.length-1 && level[this.gridPosition.y+1][this.gridPosition.x] == '.') // down
		{
			this.internalBitmap.y += sizeOfTileInPixels;
			this.gridPosition.y +=1;
		}

		this.currentActionPlaying++; // TODO : attendre la fin de l'animation de cette action
		if (this.currentActionPlaying > this.programmedActions.length) // All actions have been solved. Switch back to programation phase
		{
			this.programmedActions = [];
			this.currentActionPlaying = 0;
			gameState = "programActions";
		}

		var spriteUnderPlayer = texturesPerBlock[this.gridPosition.y][this.gridPosition.x];
		stage.removeChild(this.internalBitmap);
		var index = stage.getChildIndex(spriteUnderPlayer);
		stage.addChildAt(this.internalBitmap, index+1);
	}

	this.prevState = [];

	//	called at each tick of program Phase
	this.updateProgramPhase = function()
	{
		// store actions
		if (this.programmedActions.length <= maxActionsToProgram)
		{
			if(!this.prevState[this.controls.left] && isKeyPressed[this.controls.left]) // left
			{
				this.programmedActions.push(this.controls.left);
			}
			this.prevState[this.controls.left] = isKeyPressed[this.controls.left];

			if(!this.prevState[this.controls.right] && isKeyPressed[this.controls.right]) // right
			{
				this.programmedActions.push(this.controls.right);
			}
			this.prevState[this.controls.right] = isKeyPressed[this.controls.right];

			if(!this.prevState[this.controls.up] && isKeyPressed[this.controls.up]) // up
			{
				this.programmedActions.push(this.controls.up);
			}
			this.prevState[this.controls.up] = isKeyPressed[this.controls.up];

			if(!this.prevState[this.controls.down] && isKeyPressed[this.controls.down]) // down
			{
				this.programmedActions.push(this.controls.down);
			}
			this.prevState[this.controls.down] = isKeyPressed[this.controls.down];
		}
	}
}
