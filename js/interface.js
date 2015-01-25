function Interface()
{
	var timer = new createjs.Text("pouet", "50px Courier", "white");
 	timer.x = 600;
 	timer.y = 20;
	timer.textAlign = "center";
 	stage.addChildAt(timer, 0);

 	this.uiElements = [[]];

	this.positions = [
		{x:28, y:28},
		{x:stage.canvas.width - (maxActionsToProgram*100) + 28, y:28},
		{x:28, y:stage.canvas.height - 60 + 5},
		{x:stage.canvas.width - (maxActionsToProgram*100) + 28, y:stage.canvas.height - 60 + 5},
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
			    interfaceElement = new createjs.Bitmap(imgEmptyGem);
				this.uiElements[playerIndex].push(interfaceElement);
				stage.addChildAt(this.uiElements[playerIndex][index], 0);
			}
		}
		// draw backgound
		var bg = new createjs.Bitmap(imgBg);
		bg.alpha = 0.9;
		stage.addChildAt(bg, 0);

		//play ost
		//createjs.Sound.play(soundtrackSound);
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
					if (playerIndex == 0) {
			    		this.uiElements[playerIndex][index].image = imgGreenGem;
			    	} else if (playerIndex == 1) {
			    		this.uiElements[playerIndex][index].image = imgYellowGem;
			    	} else if (playerIndex == 2) {
			    		this.uiElements[playerIndex][index].image = imgBlueGem;
			    	} else if (playerIndex == 3) {
			    		this.uiElements[playerIndex][index].image = imgPinkGem;
			    	}

			    }
			    else {
			    	this.uiElements[playerIndex][index].image = imgEmptyGem;
			    }
			    this.uiElements[playerIndex][index].x = pos.x + index * 100;
				this.uiElements[playerIndex][index].y = pos.y;
			}
		}

		// update timer
		var remaining = ((frameBeforeAction - elapsedFrames) / FPS).toFixed(2);
		if (remaining == "5.00")
		{
			timer.text = "GO !";
		}
		else
		{
			timer.text = remaining;
		}





	}
}
