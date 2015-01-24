function GameMaster(players)
{
	this.players = players;

	this.Update = function()
	{
		var playersPositions = [[],[],[],[],[],[],[],]; //2D array mofo

		var playersCurrentPositions = [];
		var playersWantedPositions = [];

		// STEP 1 : intentions
		// find out where players want to move, and set the value if terrain allows
		for(p in this.players)
		{
			var player = this.players[p];
			var wantedX = player.gridPosition.x;
			var wantedY = player.gridPosition.y;

			var action = player.programmedActions.pop();
			if(action)
			{
				if(action == LEFT && player.gridPosition.x > 0 && level[player.gridPosition.y][player.gridPosition.x-1] == '.') // left
				{
					wantedX--;
				}
				else if(action == RIGHT && player.gridPosition.x < level[0].length-1 && level[player.gridPosition.y][player.gridPosition.x+1] == '.') // right
				{
					wantedX++;
				}
				else if(action == UP && player.gridPosition.y > 0 && level[player.gridPosition.y-1][player.gridPosition.x] == '.') // up
				{
					wantedY--;
				}
				else if(action == DOWN && player.gridPosition.y < level.length-1 && level[player.gridPosition.y+1][player.gridPosition.x] == '.') // down
				{
					wantedY++;
				}

				player.internalBitmap.gotoAndPlay(action);
			}

			playersCurrentPositions.push({x:player.gridPosition.x, y:player.gridPosition.y});
			playersWantedPositions.push({x:wantedX, y:wantedY});
		}


		// STEP 2 : collisions
		/*var collisionsDoneForPlayer = [];
		for(p in this.players)
		{
			var currentPlayer = this.players[p];
			if (collisionsDoneForPlayer[currentPlayer] == true)
			{
				// no need to check collisions for this one...
				continue;
			}

			console.log(currentPlayer.gamepadId);
			for(o in this.players)
			{
				var otherPlayer = this.players[o];
				if (currentPlayer == otherPlayer) // dont check collision with yourseld
					continue;
				// check for a clash when players are on neighboor tiles and move into each other :  .....xx......
				if (playersWantedPositions[currentPlayer.gamepadId] == playersCurrentPositions[otherPlayer.gamepadId] 
					&& playersWantedPositions[otherPlayer.gamepadId] == playersCurrentPositions[currentPlayer.gamepadId])
				{
					playersPositions[wantedY][wantedX] = undefined;
					collisionsDoneForPlayer[currentPlayer] = true;
					collisionsDoneForPlayer[otherPlayer] = true;
				}
				// check for a clash when players are separated by one tile and move into each other :  .....x.x.....
				else if (playersWantedPositions[currentPlayer.gamepadId] == playersWantedPositions[otherPlayer.gamepadId])
				{
					playersPositions[wantedY][wantedX] = undefined;
					collisionsDoneForPlayer[currentPlayer] = true;
					collisionsDoneForPlayer[otherPlayer] = true;
				}
				// valid move !
				else 
				{
					playersPositions[wantedY][wantedX] = currentPlayer;
				}


			}
		}*/

		
		
		// STEP 3 : move players in gamemaster representation
		for(p in this.players)
		{
			player = this.players[p];

			if(!playersPositions[playersWantedPositions[player.gamepadId].y][playersWantedPositions[player.gamepadId].x])
				playersPositions[playersWantedPositions[player.gamepadId].y][playersWantedPositions[player.gamepadId].x] = player;
			else
				playersPositions[playersWantedPositions[player.gamepadId].y][playersWantedPositions[player.gamepadId].x] = undefined;
		}

		// STEP 4 : move update coordinates inside player
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
