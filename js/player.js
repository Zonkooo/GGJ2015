maxActionsToProgram = 5;
var controlsPad = {up:12, down:13, left:14, right:15};

LEFT = "left";
RIGHT = "right";
UP = "up";
DOWN = "down";

function Player(bitmap, position, controls, gamepadId)
{
	var speed = 3;

	this.internalBitmap = bitmap;
	stage.addChild(bitmap);

	this.gamepadId = gamepadId;

	this.gridPosition = position;

	this.aliveState = "alive";

	this.internalBitmap.x = gridInitX + position.x*blockSize;
	this.internalBitmap.y = gridInitY + position.y*blockSize;

	this.programmedActions = [];
	this.animDone = true;


	this.controls = controls;

	//called at each tick of animation phase
	this.updatePlayPhase = function()
	{
		if(!this.animDone)
		{
			var target = {x:gridInitX + this.gridPosition.x*blockSize, y:gridInitY + this.gridPosition.y*blockSize};

			this.internalBitmap.x += Math.max(Math.min(target.x - this.internalBitmap.x, speed), -speed);
			this.internalBitmap.y += Math.max(Math.min(target.y - this.internalBitmap.y, speed), -speed);

			if(this.internalBitmap.x == target.x && this.internalBitmap.y == target.y)
				this.animDone = true;

			var dx = target.x - this.internalBitmap.x < 0 ? 1 : 0;
			var dy = target.y - this.internalBitmap.y < 0 ? 1 : 0;
			var redrawJustBefore = texturesPerBlock[this.gridPosition.y + dy][this.gridPosition.x + dx];
			stage.removeChild(this.internalBitmap);
			var index = stage.getChildIndex(redrawJustBefore);
			stage.addChildAt(this.internalBitmap, index+1);
		}
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
