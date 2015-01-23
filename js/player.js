var sizeOfTileInPixels = 75;

function Player(bitmap)
{
	var self = this;
	this.internalBitmap = bitmap;
	this.internalBitmap.x = gridInitX;
	this.internalBitmap.y = gridInitY;

	//called at each tick
	this.updateState = function()
	{
		// update coordinates
		if(isKeyPressed[37]) // left
		{
			this.internalBitmap.x -= sizeOfTileInPixels;
		}
		if(isKeyPressed[39]) // right
		{
			this.internalBitmap.x += sizeOfTileInPixels;
		}
		if(isKeyPressed[38]) // up
		{
			this.internalBitmap.y -= sizeOfTileInPixels;
		}
		if(isKeyPressed[40]) // down
		{
			this.internalBitmap.y += sizeOfTileInPixels;
		}

		// draw new shape
		//this.internalBitmap.draw();

	}

}