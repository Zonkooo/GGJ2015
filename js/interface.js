function Interface()
{

	this.updateState = function()
	{
		var index;
		for (index = 0; index < player1.programmedActions.length; ++index)
		{
		    var actionSetInterfaceElement = new createjs.Bitmap(imgCommandSet);
		    actionSetInterfaceElement.x = 10 + index * 100;
			actionSetInterfaceElement.y = 1;
			stage.addChild(actionSetInterfaceElement);
		}



	}
}