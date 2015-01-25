function GameMaster(players)
{
	this.players = players;

	this.Update = function()
	{
		var playersPositions = [[],[],[],[],[],[],[],]; //2D array mofo
		//var ashesPositions = [[],[],[],[],[],[],[],];

		var playersCurrentPositions = [];
		var playersWantedPositions = [];
		var playersUpdatedPositions = [];
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
				if(action == LEFT && player.gridPosition.x > 0 && level[player.gridPosition.y][player.gridPosition.x-1] != 'X')
				{
					wantedX--;
				}
				else if(action == RIGHT && player.gridPosition.x < level[0].length-1 && level[player.gridPosition.y][player.gridPosition.x+1] != 'X')
				{
					wantedX++;
				}
				else if(action == UP && player.gridPosition.y > 0 && level[player.gridPosition.y-1][player.gridPosition.x] != 'X')
				{
					wantedY--;
				}
				else if(action == DOWN && player.gridPosition.y < level.length-1 && level[player.gridPosition.y+1][player.gridPosition.x] != 'X')
				{
					wantedY++;
				}
				else if(action == ATTACKLEFT && player.gridPosition.x > 0 && level[player.gridPosition.y][player.gridPosition.x-1] != 'X')
				{
					wantedAttackX = player.gridPosition.x - 1;
					wantedAttackY = player.gridPosition.y;
				}
				else if(action == ATTACKRIGHT && player.gridPosition.x < level[0].length-1 && level[player.gridPosition.y][player.gridPosition.x+1] != 'X')
				{
					wantedAttackX = player.gridPosition.x + 1;
					wantedAttackY = player.gridPosition.y;
				}
				else if(action == ATTACKUP && player.gridPosition.y > 0 && level[player.gridPosition.y-1][player.gridPosition.x] != 'X')
				{
					wantedAttackX = player.gridPosition.x;
					wantedAttackY = player.gridPosition.y - 1;
				}
				else if(action == ATTACKDOWN && player.gridPosition.y < level.length-1 && level[player.gridPosition.y+1][player.gridPosition.x] != 'X')
				{
					wantedAttackX = player.gridPosition.x;
					wantedAttackY = player.gridPosition.y + 1;
				}

				player.internalBitmap.gotoAndPlay(action);

				//Display attack
				if(action.indexOf("att") == 0)
				{
					player.timerAttack = 40;
					player.attackBitmap.x = player.internalBitmap.x;
					player.attackBitmap.y = player.internalBitmap.y;
					player.attackBitmap.gotoAndPlay(toIdle[action]);
					player.attackBitmap.visible = true;
				}
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
			if (collisionsDone.indexOf(currentPlayer) != -1 || currentPlayer.aliveState == "dead")
			{
				continue;
			}
			var collided = false;
			var playerCollidedWith;
			for(o in this.players)
			{
				var otherPlayer = this.players[o];
				if (currentPlayer == otherPlayer || otherPlayer.aliveState == "dead") // dont check collision with yourseld
					continue;
				// check for a clash when players are on neighboor tiles and move into each other :  .....xx......
				if (playersWantedPositions[p].x == playersCurrentPositions[o].x
					&& playersWantedPositions[p].y == playersCurrentPositions[o].y
					&& playersWantedPositions[o].x == playersCurrentPositions[p].x
					&& playersWantedPositions[o].y == playersCurrentPositions[p].y)
				{
					collided = true;
					//console.log("collision between " + p + " and " + o);
					playerCollidedWith = otherPlayer;
					break;
				}
				// check for a clash when players are separated by one tile and move into each other :  .....x.x.....
				else if (playersWantedPositions[p].x == playersWantedPositions[o].x
					&& playersWantedPositions[p].y == playersWantedPositions[o].y)
				{
					collided = true;
					//console.log("collision between " + p + " and " + o);
					playerCollidedWith = otherPlayer;
					break;
				}
			}


			if (collided == false) // valid move
			{
				playersPositions[playersWantedPositions[p].y][playersWantedPositions[p].x] = currentPlayer;
				playersUpdatedPositions[p] = {x:playersWantedPositions[p].x, y:playersWantedPositions[p].y};
			}
			else // cant move : you and the other stay in place
			{
				playersPositions[playersCurrentPositions[p].y][playersCurrentPositions[p].x] = currentPlayer;
				playersPositions[playersCurrentPositions[playerCollidedWith.gamepadId].y][playersCurrentPositions[playerCollidedWith.gamepadId].x] = playerCollidedWith;
				collisionsDone.push(playerCollidedWith);

				playersUpdatedPositions[p] = {x:playersWantedPositions[p].x, y:playersWantedPositions[p].y};
				playersUpdatedPositions[playerCollidedWith.gamepadId] = {x:playersCurrentPositions[playerCollidedWith.gamepadId].x, y:playersCurrentPositions[playerCollidedWith.gamepadId].y}
			};
			collisionsDone.push(currentPlayer);
		}

		// STEP 3 : attacks
		for(p in this.players)
		{
			var currentPlayer = this.players[p];
			if (playersWantedAttacks[p].x != -1) // that player has an attack to do
			{
				//Check if someone was killed
				for(o in this.players)
				{
					var otherPlayer = this.players[o];
					if (currentPlayer == otherPlayer) // dont check collision with yourself
						continue;
					if (playersWantedAttacks[p].x == playersUpdatedPositions[o].x
						&&  playersWantedAttacks[p].y ==playersUpdatedPositions[o].y)
					{
						// we caught another player with the attack
						// Check if he counters...
						if (playersWantedAttacks[o].x != -1
							&& playersWantedAttacks[o].x == playersUpdatedPositions[p].x
						&&  playersWantedAttacks[o].y ==playersUpdatedPositions[p].y)
						{
							currentPlayer.attackBitmap.gotoAndPlay("counter" + currentPlayer.attackBitmap.currentAnimation);
						}
						else // or else he dies
						{
							otherPlayer.aliveState = "dead";
						}
						createjs.Sound.play(attackHitSound);
					}
					else
					{
						createjs.Sound.play(attackMissSound);
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

	this.killPlayers = function()
	{
		for(i = 0; i < 4; i++)
		{
			var player = players[i];
			if(player && player.aliveState == "dead")
			{
				var ashes = new createjs.Bitmap(imgAshes);
				ashes.x = player.internalBitmap.x;
				ashes.y = player.internalBitmap.y;

				stage.removeChild(player.attackBitmap);
				stage.removeChild(player.internalBitmap);
				stage.addChildAt(ashes);

				//ashesPositions[ashes.y][ashes.x] = ashes;

				players.splice(i, 1);
				i--; //so evil

				/*var minPlayerImgIndexInStage = 100;
				for(p in this.players)
				{
					var currentPlayer = this.players[p];
					var index = stage.children.indexOf(currentPlayer.internalBitmap);
					console.log(index);
					if (minPlayerImgIndexInStage > index) {
						minPlayerImgIndexInStage = index;
					}

				}
				console.log("----");
				console.log(minPlayerImgIndexInStage);
				console.log("----");
				stage.addChildAt(ashes, minPlayerImgIndexInStage);*/


			}
		}
	}
}
