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
				if(action == LEFT && player.gridPosition.x > 0 && level[player.gridPosition.y][player.gridPosition.x-1] == '_') // left
				{
					wantedX--;
				}
				else if(action == RIGHT && player.gridPosition.x < level[0].length-1 && level[player.gridPosition.y][player.gridPosition.x+1] == '_') // right
				{
					wantedX++;
				}
				else if(action == UP && player.gridPosition.y > 0 && level[player.gridPosition.y-1][player.gridPosition.x] == '_') // up
				{
					wantedY--;
				}
				else if(action == DOWN && player.gridPosition.y < level.length-1 && level[player.gridPosition.y+1][player.gridPosition.x] == '_') // down
				{
					wantedY++;
				}

				player.internalBitmap.gotoAndPlay(action);
			}

			playersCurrentPositions.push({x:player.gridPosition.x, y:player.gridPosition.y});
			playersWantedPositions.push({x:wantedX, y:wantedY});
		}

		// STEP 2 : collisions
		// TODO : mecanism to avoid recomputing twice
		var collisionsDone = [];
		for(p in this.players)
		{
			var currentPlayer = this.players[p];
			if (collisionsDone.indexOf(currentPlayer) != -1)
			{
				console.log("skipped one tile");
				continue;
			}
			var collided = false;
			var playerCollidedWith;
			for(o in this.players)
			{
				var otherPlayer = this.players[o];
				if (currentPlayer == otherPlayer) // dont check collision with yourseld
					continue;
				// check for a clash when players are on neighboor tiles and move into each other :  .....xx......
				if (playersWantedPositions[currentPlayer.gamepadId].x == playersCurrentPositions[otherPlayer.gamepadId].x
					&& playersWantedPositions[currentPlayer.gamepadId].y == playersCurrentPositions[otherPlayer.gamepadId].y
					&& playersWantedPositions[otherPlayer.gamepadId].x == playersCurrentPositions[currentPlayer.gamepadId].x
					&& playersWantedPositions[otherPlayer.gamepadId].y == playersCurrentPositions[currentPlayer.gamepadId].y)
				{
					collided = true;
					playerCollidedWith = otherPlayer;
					break;
				}
				// check for a clash when players are separated by one tile and move into each other :  .....x.x.....
				else if (playersWantedPositions[currentPlayer.gamepadId].x == playersWantedPositions[otherPlayer.gamepadId].x
					&& playersWantedPositions[currentPlayer.gamepadId].y == playersWantedPositions[otherPlayer.gamepadId].y)
				{
					collided = true;
					playerCollidedWith = otherPlayer;
					break;
				}			
			}


			if (collided == false) // valid move
			{
				playersPositions[playersWantedPositions[currentPlayer.gamepadId].y][playersWantedPositions[currentPlayer.gamepadId].x] = currentPlayer;
			}
			else // cant move : you and the other stay in place
			{
				playersPositions[playersCurrentPositions[currentPlayer.gamepadId].y][playersCurrentPositions[currentPlayer.gamepadId].x] = currentPlayer;
				playersPositions[playersCurrentPositions[playerCollidedWith.gamepadId].y][playersCurrentPositions[playerCollidedWith.gamepadId].x] = playerCollidedWith;
				collisionsDone.push(playerCollidedWith);
			}
			collisionsDone.push(currentPlayer);
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
				player.animDone = false;
			}
	}
}
