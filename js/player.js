maxActionsToProgram = 3;
var controlsPad = {up:12, down:13, left:14, right:15};

function Player(bitmap, position, controls, gamepadId)
{
	this.internalBitmap = bitmap;
	this.gamepadId = gamepadId;

	this.gridPosition = position;

	this.internalBitmap.x = gridInitX + position.x*blockSize;
	this.internalBitmap.y = gridInitY + position.y*blockSize;

	this.programmedActions = [];

	this.controls = controls;

	//called at each tick of play phase
	this.updatePlayPhase = function()
	{
		this.internalBitmap.x = gridInitX + this.gridPosition.x*blockSize;
		this.internalBitmap.y = gridInitY + this.gridPosition.y*blockSize;

		var spriteUnderPlayer = texturesPerBlock[this.gridPosition.y][this.gridPosition.x];
		stage.removeChild(this.internalBitmap);
		var index = stage.getChildIndex(spriteUnderPlayer);
		stage.addChildAt(this.internalBitmap, index+1);
	}

	this.prevState = [];
	this.prevStatePad = [];

	//	called at each tick of program Phase
	this.updateProgramPhase = function()
	{
		//store actions
		if (this.gamepadId == -1) // keyboard
		{
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
		else
		{
			if (this.programmedActions.length <= maxActionsToProgram)
			{
				if (this.prevStatePad[controlsPad.left] == 0 && gamepads[this.gamepadId].buttons[controlsPad.left].value == 1)
				{
					this.programmedActions.push(this.controls.left);
				}
				this.prevStatePad[controlsPad.left] = gamepads[this.gamepadId].buttons[controlsPad.left].value;

				if (this.prevStatePad[controlsPad.right] == 0 && gamepads[this.gamepadId].buttons[controlsPad.right].value == 1)
				{
					this.programmedActions.push(this.controls.right);
				}
				this.prevStatePad[controlsPad.right] = gamepads[this.gamepadId].buttons[controlsPad.right].value;

				if (this.prevStatePad[controlsPad.up] == 0 && gamepads[this.gamepadId].buttons[controlsPad.up].value== 1)
				{
					this.programmedActions.push(this.controls.up);
				}
				this.prevStatePad[controlsPad.up] = gamepads[this.gamepadId].buttons[controlsPad.up].value;

				if (this.prevStatePad[controlsPad.down] == 0 && gamepads[this.gamepadId].buttons[controlsPad.down].value == 1)
				{
					this.programmedActions.push(this.controls.down);
				}
				this.prevStatePad[controlsPad.down] = gamepads[this.gamepadId].buttons[controlsPad.down].value;
			}
		}
	}
}
