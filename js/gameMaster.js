function GameMaster(players)
{
	this.players = players;

	this.Update = function()
	{
		var playersPositions = [[],[],[],[],[],[],[],]; //2D array mofo

		for(p in this.players)
		{
			var player = this.players[p];
			var wantedX = player.gridPosition.x;
			var wantedY = player.gridPosition.y;

			var action = player.programmedActions.pop();
			if(action == player.controls.left && player.gridPosition.x > 0 && level[player.gridPosition.y][player.gridPosition.x-1] == '.') // left
			{
				wantedX--;
			}
			else if(action == player.controls.right && player.gridPosition.x < level[0].length-1 && level[player.gridPosition.y][player.gridPosition.x+1] == '.') // right
			{
				wantedX++;
			}
			else if(action == player.controls.up && player.gridPosition.y > 0 && level[player.gridPosition.y-1][player.gridPosition.x] == '.') // up
			{
				wantedY--;
			}
			else if(action == player.controls.down && player.gridPosition.y < level.length-1 && level[player.gridPosition.y+1][player.gridPosition.x] == '.') // down
			{
				wantedY++;
			}

			if(!playersPositions[wantedY][wantedX])
				playersPositions[wantedY][wantedX] = player;
			else
				playersPositions[wantedY][wantedX] = undefined; //none will move
		}

		for(y in playersPositions)
			for(x in playersPositions[y])
			{
				player = playersPositions[y][x];
				if(!player)
					continue;
				player.gridPosition.x = +x;
				player.gridPosition.y = +y;
			}
	}
}
