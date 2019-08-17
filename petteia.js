var board;

setupBoard(8, 8);

function setupBoard(boardX, boardY){
    board = new Array(boardY);
    for (var i = 0; i < board.length; i++) {
        //console.log("i = " + i)
        board[i] = new Array(boardX);

        //Setup pieces for player 1
        if (i <= 1){
            for (var j = 0; j < board[i].length; j++) {
                //console.log("j = " + j)
                board[i][j] = 1;
            }
        }

        //Setup pieces for player 2
        else if (i >= board.length - 2){
            for (var j = 0; j < board[i].length; j++) {
                //console.log("j = " + j)
                board[i][j] = 2;
            }
        }

        //Otherwise it's a blank space
        else{
            for (var j = 0; j < board[i].length; j++) {
                //console.log("j = " + j)
                board[i][j] = null;
            }
            
        }
    }
    //console.log(board);
    makeTableHTML(board);
}

//Call the move function from a HTML input
function moveButton(){
    var xStartPos = document.getElementById("xStartPos").value;
    var yStartPos = document.getElementById("yStartPos").value;
    var xEndPos = document.getElementById("xEndPos").value;
    var yEndPos = document.getElementById("yEndPos").value;
    // console.log(xStartPos);
    // console.log(yStartPos);
    // console.log(xEndPos);
    // console.log(yEndPos);
    move(xStartPos, yStartPos, xEndPos, yEndPos);
}

function move(xStartPos, yStartPos, xEndPos, yEndPos){
    var activePiece;
    //console.log(board[yStartPos][xStartPos]);

    if (checkRules(xStartPos, yStartPos, xEndPos, yEndPos)){
        activePiece = board[yStartPos][xStartPos];
        board[yEndPos][xEndPos] = activePiece;
        board[yStartPos][xStartPos] = null;
    }

    takePieces(xEndPos, yEndPos);

    makeTableHTML(board);
}

function checkRules(xStartPos, yStartPos, xEndPos, yEndPos){
    if (!board[yStartPos][xStartPos]){
        alert("No piece selected");
        return false;
    }
    else if (xStartPos != xEndPos && yStartPos != yEndPos){
        alert("You can only move in straight lines");
        return false;
    }
    else if (board[yEndPos][xEndPos]){
        alert("Destination position is already taken");
        return false;
    }
    else{
        return true;
    }
}

function takePieces(xEndPos, yEndPos){
    console.log("N " + getAdjacent(xEndPos, yEndPos, "N").length)
    console.log("E " + getAdjacent(xEndPos, yEndPos, "E").length)
    console.log("S " + getAdjacent(xEndPos, yEndPos, "S").length)
    console.log("W " + getAdjacent(xEndPos, yEndPos, "W").length)

    var team = board[yEndPos][xEndPos];

    var northAdjacent = getAdjacent(xEndPos, yEndPos, "N");
    var eastAdjacent = getAdjacent(xEndPos, yEndPos, "E");
    var southAdjacent = getAdjacent(xEndPos, yEndPos, "S");
    var westAdjacent = getAdjacent(xEndPos, yEndPos, "W");

    if (northAdjacent.length > 0){
        var northTake = findPiecesToTake(northAdjacent, team);
        for (var i = northTake.length - 1; i >= 0; i--){
            //TODO - Add code for taking pieces
        }
        console.log(northTake);
    }
}

function findPiecesToTake(adjacent, team){
    var result = 0;
    var captured = false;
    for (var i = adjacent.length - 1; i >= 0; i--) {
        console.log(i + " - " + adjacent[i]);
        if (!captured && adjacent[i] == team){
            captured = true;
        }
        if (captured && adjacent[i] != team){
            adjacent[i] = null;
        }
    }
    return adjacent;
}

//Get the adjacent pieces
//Directon can be N, E, S, W (compass points)
function getAdjacent(xPos, yPos, direction, pieces){
    if (!pieces){
        pieces = new Array();
    }

    var result = pieces;

    switch (direction){
        case "N":
            yPos--;
            if (yPos >= 0 && board[yPos][xPos] ){
                pieces.push(board[yPos][xPos]);
                result = getAdjacent(xPos, yPos, direction, pieces);
            }

        break;
        case "E":
            xPos++;
            if (xPos < board[0].length && board[yPos][xPos] ){
                pieces.push(board[yPos][xPos]);
                result = getAdjacent(xPos, yPos, direction, pieces);
            }

        break;
        case "S":
            yPos++;
            if (yPos < board.length && board[yPos][xPos]){
                pieces.push(board[yPos][xPos]);
                result = getAdjacent(xPos, yPos, direction, pieces);
            }
        break;
        case "W":
            xPos--;
            if (xPos >= 0 && board[yPos][xPos] ){
                pieces.push(board[yPos][xPos]);
                result = getAdjacent(xPos, yPos, direction, pieces);
            }
        break;
        default:
            console.log("Invalid direction " + direction);
        break;
    }
    return result;
}

//Adapted from https://stackoverflow.com/questions/15164655/generate-html-table-from-2d-javascript-array
function makeTableHTML(myArray) {
    var result = "<table border=1>";
    for(var i=0; i<myArray.length; i++) {
        result += "<tr>";
        for(var j=0; j<myArray[i].length; j++){
            if (myArray[i][j]){
                result += "<td>"+myArray[i][j]+"</td>";
            }
            else{
                result += "<td></td>";
            }
        }
        result += "</tr>";
    }
    result += "</table>";
    //console.log(myArray);

    document.getElementById("boardOutput").innerHTML = result;
}