function Interface()
{
	var timer = new createjs.Text("Starting...", "50px Courier", "#ff0000");
 	timer.x = 600;
 	timer.y = 20;
 	stage.addChild(timer);

	this.updateState = function()
	{
		// update players action
		var playerIndex;
		for (playerIndex = 0; playerIndex < players.length ; ++playerIndex)
		{
			var index;
			var interfaceElement
			for (index = 0; index < maxActionsToProgram ; ++index)
			{
				if (players[playerIndex].programmedActions.length > index) {
			    	interfaceElement = new createjs.Bitmap(imgCommandSet);
			    }
			    else {
			    	interfaceElement = new createjs.Bitmap(imgCommandNotSet);
			    } 
			    interfaceElement.x = 10 + index * 100;
				interfaceElement.y = playerIndex * 100;
				stage.addChild(interfaceElement);
			}
		}

		// update timer
		timer.text = Math.round((frameBeforeAction - elapsedFrames) / 60 * 100) /100;

	}
}