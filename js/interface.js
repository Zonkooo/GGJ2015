function Interface()
{
	var timer = new createjs.Text("pouet", "50px Courier", "#ff0000");
 	timer.x = 600;
 	timer.y = 20;
	timer.textAlign = "center";
 	stage.addChild(timer);

 	this.uiElements = [[]];

	this.positions = [
		{x:10, y:10},
		{x:stage.canvas.width - (maxActionsToProgram*100) + 10, y:10},
		{x:10, y:stage.canvas.height - 60 - 10},
		{x:stage.canvas.width - (maxActionsToProgram*100) + 10, y:stage.canvas.height - 60 - 10},
	];

 	this.load = function()
 	{
 		// draw UI for each player
		var playerIndex;
		var index;
		var interfaceElement;

		for (playerIndex = 0; playerIndex < players.length ; ++playerIndex)
		{
		    var pos = this.positions[playerIndex];
			this.uiElements.push([]);
			for (index = 0; index < maxActionsToProgram ; ++index)
			{
			    interfaceElement = new createjs.Bitmap(imgCommandNotSet);
				this.uiElements[playerIndex].push(interfaceElement);
				stage.addChild(this.uiElements[playerIndex][index]);
			}
		}
 	}


	this.updateState = function()
	{
		// update players action
		var playerIndex;
		for (playerIndex = 0; playerIndex < players.length ; ++playerIndex)
		{
		    var pos = this.positions[playerIndex];
			for (index = 0; index < maxActionsToProgram ; ++index)
			{
				if (players[playerIndex].programmedActions.length > index) {
			    	this.uiElements[playerIndex][index].image = imgCommandSet;
			    }
			    else {
			    	this.uiElements[playerIndex][index].image = imgCommandNotSet;
			    }
			    this.uiElements[playerIndex][index].x = pos.x + index * 100;
				this.uiElements[playerIndex][index].y = pos.y;
			}
		}

		// update timer
		timer.text = ((frameBeforeAction - elapsedFrames) / FPS).toFixed(2);

	}
}
