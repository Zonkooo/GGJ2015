var sizeOfTileInPixels = 75;
var maxActionsToProgram = 3;

function Player(startx, starty, bitmap)
{
	this.internalBitmap = bitmap;
	this.internalBitmap.x = startx;
	this.internalBitmap.y = starty;

	this.gridPosition = {x:0, y:0};

	this.programmedActions = [];
	this.currentActionPlaying = 0;

	//called at each tick of play phase
	this.updatePlayPhase = function()
	{
		//TODO : deal with incomplete inputs (not all actions have been programed)
		//TODO : solve turn first and then dislay 
		// read programmed actions.
		if(this.programmedActions[this.currentActionPlaying] == 37 && this.gridPosition.x > 0 && level[this.gridPosition.y][this.gridPosition.x-1] == '.') // left
		{
			this.internalBitmap.x -= sizeOfTileInPixels;
			this.gridPosition.x -=1;
		}
		if(this.programmedActions[this.currentActionPlaying] == 39 && this.gridPosition.x < level[0].length-1 && level[this.gridPosition.y][this.gridPosition.x+1] == '.') // right
		{
			this.internalBitmap.x += sizeOfTileInPixels;
			this.gridPosition.x +=1;
		}
		if(this.programmedActions[this.currentActionPlaying] == 38 && this.gridPosition.y > 0 && level[this.gridPosition.y-1][this.gridPosition.x] == '.') // up
		{
			this.internalBitmap.y -= sizeOfTileInPixels;
			this.gridPosition.y -=1;
		}
		if(this.programmedActions[this.currentActionPlaying] == 40 && this.gridPosition.y < level.length-1 && level[this.gridPosition.y+1][this.gridPosition.x] == '.') // down
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
			if(!this.prevState[37] && isKeyPressed[37]) // left
			{
				this.programmedActions.push(37);
			}
			this.prevState[37] = isKeyPressed[37];

			if(!this.prevState[39] && isKeyPressed[39]) // right
			{
				this.programmedActions.push(39);
			}
			this.prevState[39] = isKeyPressed[39];

			if(!this.prevState[38] && isKeyPressed[38]) // up
			{
				this.programmedActions.push(38);
			}
			this.prevState[38] = isKeyPressed[38];

			if(!this.prevState[40] && isKeyPressed[40]) // down
			{
				this.programmedActions.push(40);
			}
			this.prevState[40] = isKeyPressed[40];
		}
	}
}
