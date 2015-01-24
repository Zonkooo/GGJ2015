maxActionsToProgram = 3;
var controlsPad = {up:12, down:13, left:14, right:15};

LEFT = "left";
RIGHT = "right";
UP = "up";
DOWN = "down";

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

	//	called at each tick of program Phase
	this.updateProgramPhase = function()
	{
		//transform gamepad actions in key presses
		if(gamepads[this.gamepadId])
		{
			isKeyPressed[this.controls.left] |= gamepads[this.gamepadId].buttons[controlsPad.left].value == 1;
			isKeyPressed[this.controls.right] |= gamepads[this.gamepadId].buttons[controlsPad.right].value == 1;
			isKeyPressed[this.controls.up] |= gamepads[this.gamepadId].buttons[controlsPad.up].value == 1;
			isKeyPressed[this.controls.down] |= gamepads[this.gamepadId].buttons[controlsPad.down].value == 1;
		}

		if (this.programmedActions.length < maxActionsToProgram)
		{
			if(!this.prevState[this.controls.left] && isKeyPressed[this.controls.left]) // left
			{
				this.programmedActions.push(LEFT);
				createjs.Sound.play(commandSetSound);
			}
			this.prevState[this.controls.left] = isKeyPressed[this.controls.left];

			if(!this.prevState[this.controls.right] && isKeyPressed[this.controls.right]) // right
			{
				this.programmedActions.push(RIGHT);
				createjs.Sound.play(commandSetSound);
			}
			this.prevState[this.controls.right] = isKeyPressed[this.controls.right];

			if(!this.prevState[this.controls.up] && isKeyPressed[this.controls.up]) // up
			{
				this.programmedActions.push(UP);
				createjs.Sound.play(commandSetSound);
			}
			this.prevState[this.controls.up] = isKeyPressed[this.controls.up];

			if(!this.prevState[this.controls.down] && isKeyPressed[this.controls.down]) // down
			{
				this.programmedActions.push(DOWN);
				createjs.Sound.play(commandSetSound);
			}
			this.prevState[this.controls.down] = isKeyPressed[this.controls.down];
		}
	}
}
