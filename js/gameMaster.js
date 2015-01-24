function GameMaster(players)
{
	this.players = players;

	this.Update = function()
	{
		var playersPositions = [[],[],[],[],[],[],[],]; //2D array mofo

		var playersCurrentPositions = [];
		var playersWantedPositions = [];
		var playersWantedAttacks = [];

		// STEP 1 : intentions
		// find out where players want to move, and set the value if terrain allows
		for(p in this.players)
		{
			var player = this.players[p];
			player.animDone = false;

			var wantedX = player.gridPosition.x;
			var wantedY = player.gridPosition.y;
			var wantedAttackX = -1;
			var wantedAttackY = -1;

			var action = player.programmedActions.pop();
			if(action)
			{
				if(action == LEFT && player.gridPosition.x > 0 && level[player.gridPosition.y][player.gridPosition.x-1] == '_')
				{
					wantedX--;
				}
				else if(action == RIGHT && player.gridPosition.x < level[0].length-1 && level[player.gridPosition.y][player.gridPosition.x+1] == '_')
				{
					wantedX++;
				}
				else if(action == UP && player.gridPosition.y > 0 && level[player.gridPosition.y-1][player.gridPosition.x] == '_')
				{
					wantedY--;
				}
				else if(action == DOWN && player.gridPosition.y < level.length-1 && level[player.gridPosition.y+1][player.gridPosition.x] == '_')
				{
					wantedY++;
				}
				else if(action == ATTACKLEFT && player.gridPosition.x > 0 && level[player.gridPosition.y][player.gridPosition.x-1] == '_')
				{
					wantedAttackX = player.gridPosition.x - 1;
					wantedAttackY = player.gridPosition.y;
				}
				else if(action == ATTACKRIGHT && player.gridPosition.x < level[0].length-1 && level[player.gridPosition.y][player.gridPosition.x+1] == '_')
				{
					wantedAttackX = player.gridPosition.x + 1;
					wantedAttackY = player.gridPosition.y;
				}
				else if(action == ATTACKUP && player.gridPosition.y > 0 && level[player.gridPosition.y-1][player.gridPosition.x] == '_')
				{
					wantedAttackX = player.gridPosition.x;
					wantedAttackY = player.gridPosition.y - 1;
				}
				else if(action == ATTACKDOWN && player.gridPosition.y < level.length-1 && level[player.gridPosition.y+1][player.gridPosition.x] == '_')
				{
					wantedAttackX = player.gridPosition.x;
					wantedAttackY = player.gridPosition.y + 1;
				}

				player.internalBitmap.gotoAndPlay(action);
			}

			playersCurrentPositions.push({x:player.gridPosition.x, y:player.gridPosition.y});
			playersWantedPositions.push({x:wantedX, y:wantedY});
			playersWantedAttacks.push({x:wantedAttackX, y:wantedAttackY});
		}

		// STEP 2 : collisions
		var collisionsDone = [];
		for(p in this.players)
		{
			var currentPlayer = this.players[p];
			if (collisionsDone.indexOf(currentPlayer) != -1)
			{
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
					console.log("collision between " + p + " and " + o);
					playerCollidedWith = otherPlayer;
					break;
				}
				// check for a clash when players are separated by one tile and move into each other :  .....x.x.....
				else if (playersWantedPositions[currentPlayer.gamepadId].x == playersWantedPositions[otherPlayer.gamepadId].x
					&& playersWantedPositions[currentPlayer.gamepadId].y == playersWantedPositions[otherPlayer.gamepadId].y)
				{
					collided = true;
					console.log("collision between " + p + " and " + o);
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

		// STEP 3 : attacks
		for(p in this.players)
		{
			var currentPlayer = this.players[p];
			if (playersWantedAttacks[currentPlayer.gamepadId].x != -1) // that player has an attack to do
			{
				//Display attack
				currentPlayer.attackBitmap.x = gridInitX + blockSize * playersWantedAttacks[currentPlayer.gamepadId].x;
				currentPlayer.attackBitmap.y = gridInitY + blockSize * playersWantedAttacks[currentPlayer.gamepadId].y;

				//Check if someone was killed
				for(o in this.players)
				{
					var otherPlayer = this.players[o];
					if (currentPlayer == otherPlayer) // dont check collision with yourseld
						continue;
					if (playersWantedAttacks[currentPlayer.gamepadId].x == playersWantedPositions[otherPlayer.gamepadId].x
						&&  playersWantedAttacks[currentPlayer.gamepadId].y ==playersWantedPositions[otherPlayer.gamepadId].y)
					{
						// we caught another player with the attack
						// TODO : deal with counters.


						otherPlayer.aliveState = "dead";
						otherPlayer.internalBitmap.visible = false;
					}

				}
			}
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
