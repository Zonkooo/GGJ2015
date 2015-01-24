function Interface()
{

	this.updateState = function()
	{
		// player 1
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

	}
}