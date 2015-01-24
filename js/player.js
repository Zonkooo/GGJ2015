maxActionsToProgram = 3;

function Player(bitmap, position, controls)
{
	this.internalBitmap = bitmap;

	this.gridPosition = position;

	this.internalBitmap.x = gridInitX + position.x*blockSize;
	this.internalBitmap.y = gridInitY + position.y*blockSize;

	this.programmedActions = [];

	this.controls = controls;

	//called at each tick of play phase
	this.updatePlayPhase = function(turn)
	{
		//TODO : deal with incomplete inputs (not all actions have been programed)
		//TODO : solve turn first and then dislay
		// read programmed actions.
		if(this.programmedActions[turn] == this.controls.left && this.gridPosition.x > 0 && level[this.gridPosition.y][this.gridPosition.x-1] == '.') // left
		{
			this.internalBitmap.x -= blockSize;
			this.gridPosition.x -=1;
		}
		if(this.programmedActions[turn] == this.controls.right && this.gridPosition.x < level[0].length-1 && level[this.gridPosition.y][this.gridPosition.x+1] == '.') // right
		{
			this.internalBitmap.x += blockSize;
			this.gridPosition.x +=1;
		}
		if(this.programmedActions[turn] == this.controls.up && this.gridPosition.y > 0 && level[this.gridPosition.y-1][this.gridPosition.x] == '.') // up
		{
			this.internalBitmap.y -= blockSize;
			this.gridPosition.y -=1;
		}
		if(this.programmedActions[turn] == this.controls.down && this.gridPosition.y < level.length-1 && level[this.gridPosition.y+1][this.gridPosition.x] == '.') // down
		{
			this.internalBitmap.y += blockSize;
			this.gridPosition.y +=1;
		}

		if (turn == maxActionsToProgram-1) // All actions have been solved. Switch back to programation phase
		{
			this.programmedActions = [];
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
		if (this.programmedActions.length < maxActionsToProgram)
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
