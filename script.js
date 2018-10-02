//results will store all results of game. 0 for empty, 1 and 2 for players.
//NOTICE: results doesn't has buttons header as graphic boardTable.
//therefore, results has only 6 rows, while boardTable has 7.
var results;
//populate results with empty boardTable
function getEmptyboardTable()
{
	var emptyboardTable=[];
	for (var i=0;i<6;i++)
		emptyboardTable[i]=[0,0,0,0,0,0,0];
	return emptyboardTable;
}
//sets table to display 6x7 table plus buttons on top of each column. also, sets results to empty boardTable.
function startGame()
{
	//store results with an empty boardTable for start of game.
	results=getEmptyboardTable();
	var boardTable=document.getElementById("boardTable");
	var line,boardTableHtml;
	boardTableHtml="<tr>\n" //for first table row opening tag
	//add html for buttons row.
	for (var i=0;i<7;i++)
	{
		line="<th><button id=\"col_"+i+"_bt\"onClick=\"playTurn("+i+")\">Pick<br>Col "+(i+1)+"</button></th>";
		boardTableHtml+=line+"\n";
	}
	boardTableHtml+="</tr>\n"// for first table row closing tag
	//add html for all other rows.
	for (var i=0;i<6;i++)
	{
		boardTableHtml+="<tr>\n";//opening tag for row
		for (var j=0;j<7;j++)
		{
			line="<td id=cell_"+i+"_"+j+"></td>";//add cell id - cell_i_j
			boardTableHtml+=line+"\n";
		}
		boardTableHtml+="</tr>\n";//closing tag for row
	}
	boardTable.innerHTML=boardTableHtml
	//add empty line to boardTable's cells to have space on cells
	cells=document.getElementsByTagName("td");
	for(var i=0;i<cells.length;i++)
		cells[i].innerHTML="<br>";
}	
	

function playTurn(col)
{
	var gameboardTable=document.getElementById("boardTable");
	var player=parseInt(document.getElementById("player").innerHTML);//to get current player
	var currentCell;
	var row=5 //start from the lowest cell on the column.
	//get to first blank cell from the lowest cell.
	currentCell=document.getElementById("cell_"+row+"_"+col);
	//find cell with default background color, that's to say, not red or blue.
	while (currentCell.style.backgroundColor==="red" || currentCell.style.backgroundColor==="blue")
	{
		row--;
		currentCell=document.getElementById("cell_"+row+"_"+col);
		if (row<0)
		{
			alert("Column "+(col+1)+" is full! try a different column.");
			return;
		}
	}
	//change color for selected cell
	changeColor(currentCell,player);
	//update results on 'results' for status checking
	results[row][col]=player;
	//check status. if needs to end, end game.
	var currentStatus=checkEndGame();
	if (currentStatus!==0)
	{
		endGame(currentStatus);
		return
	}
	//if game didn't end, change player to next one
	changePlayer();
}
//changer color for cell by player. red for player 1, blue for player 2.
function changeColor(cell,player)
{
	var color;
	if (player===1)
		color="red";
	else
		color="blue";
	cell.style.backgroundColor=color;
}
//change player for next turn. if current player was player 1 change to player 2, etc.
function changePlayer()
{
	var nextPlayer;
	//get turnMsg to change it to player's color
	var turnMsg=document.getElementById("turnMsg");
	if (parseInt(document.getElementById("player").innerHTML)===1)
	{
		nextPlayer="2";
		turnMsg.style.color="blue";
	}
	else
	{	
		nextPlayer="1";
		turnMsg.style.color="red";
	}
	//change number of player to next player's number.
	document.getElementById("player").innerHTML=nextPlayer;
	
}
//check status of game. if red/blue won, return 1/2. if table full, return -1.
function checkEndGame()
{
	var status;
	if(checkTableFull())
		return -1;
	status=checkVert();
	if (status)
		return status;
	status=checkHorizon();
	if (status)
		return status;
	status=checkDiagonalsDownwards();
	if (status)
		return status;
	return checkDiagonalsUpwards()
}
function checkTableFull()
{
	for(var i=0;i<6;i++)
		for(var j=0;j<7;j++)
			if (results[i][j]===0)
				return false
	return true;
}
function checkVert()
{
	var firstElm;
	for(var i=0;i<6;i++)
		for(var j=0;j<4;j++)
		{
			firstElm=results[i][j];
			if (firstElm===0)
				continue;
			if (firstElm===results[i][j+1] &&
				firstElm===results[i][j+2] &&
				firstElm===results[i][j+3])
				return firstElm;
		}
	return 0;
}
function checkHorizon()
{
	var firstElm;
	for(var i=0;i<3;i++)
		for(var j=0;j<7;j++)
		{
			firstElm=results[i][j];
			if (firstElm===0)
				continue;
			if (firstElm===results[i+1][j] &&
				firstElm===results[i+2][j] &&
				firstElm===results[i+3][j])
				return firstElm;
		}
	return 0;
}
function checkDiagonalsDownwards()
{
	var firstElm;
	//omit rows 3-5 as can't have downward diagonal
	for(var i=0;i<3;i++)
		//omit cols 4-6 as can't have downward diagonal
		for(var j=0;j<4;j++)
		{
			firstElm=results[i][j];
			if (firstElm===0)
				continue;
			if (firstElm===results[i+1][j+1] &&
				firstElm===results[i+2][j+2] &&
				firstElm===results[i+3][j+3])
				return firstElm;
		}
	return 0;
}
function checkDiagonalsUpwards()
{
	var firstElm;
	//omit rows 0-2 as can't have upward diagonal
	for(var i=3;i<6;i++)
		//omit cols 4-6 as can't have upward diagonal
		for(var j=0;j<4;j++)
		{
			firstElm=results[i][j];
			if (firstElm===0)
				continue;
			if (firstElm===results[i-1][j+1] &&
				firstElm===results[i-2][j+2] &&
				firstElm===results[i-3][j+3])
				return firstElm;
		}
	return 0;
}
function endGame(playerWon)
{
	//if any player won
	if (playerWon>0)
	{

		//display result msg in color
		document.getElementById("resultMsg").innerHTML="Player "+playerWon+" won!!!";
		if (playerWon===1)
			document.getElementById("resultMsg").style.color="red";
		else
			document.getElementById("resultMsg").style.color="blue";
	}
	//if board full
	else
	{
		document.getElementById("resultMsg").innerHTML="Board is full.";
	}
	//display GAME OVER msg.
	document.getElementById("gameOverMsg").innerHTML="GAME OVER";
	//disable table's buttons
	for (var i=0;i<7;i++)
		document.getElementById("col_"+i+"_bt").disabled=true;
	//hide turn message
	document.getElementById("turnMsg").style.visibility="hidden";				
	//show start over button
	document.getElementById("tryAgainButton").style.visibility = "visible"
}
function startOver()
{
	location.reload();
}
