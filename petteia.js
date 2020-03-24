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
                board[i][j] = 0;
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
        board[yStartPos][xStartPos] = 0;
        takePieces(xEndPos, yEndPos);
    }

    makeTableHTML(board);
}

//Makes sure a move is valid
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
    //TODO check for out of array
    //TODO check for not jumping over any pieces
    else{
        return true;
    }
}

function takePieces(xPos, yPos){
    var team = board[yPos][xPos];

    var northAdjacent = getAdjacent(xPos, yPos, "N");
    var eastAdjacent = getAdjacent(xPos, yPos, "E");
    var southAdjacent = getAdjacent(xPos, yPos, "S");
    var westAdjacent = getAdjacent(xPos, yPos, "W");

    console.log("N adjacent = " + northAdjacent.length)
    console.log("E adjacent = " + eastAdjacent.length)
    console.log("S adjacent = " + southAdjacent.length)
    console.log("W adjacent = " + westAdjacent.length)

    if (northAdjacent.length > 0){
        console.log("Looking to the north")
        var northTake = findPiecesToTake(northAdjacent, team);
        console.log("northTake = " + northTake);
        if (northTake[0]){
            console.log("Taking pieces to the north")
            //for (var i = 0; i < northTake[1].length; i++){
            for (var i = northTake[1].length; i >= 0 ; i--){
                console.log("Replace " + northTake[1][i] + " at " + xPos+i + "," + yPos);
                board[yPos-i][xPos] = northTake[1][i];
            }
        }
        console.log(northTake);
    }

    if (eastAdjacent.length > 0){
        console.log("Looking to the east")
        var eastTake = findPiecesToTake(eastAdjacent, team);
        console.log("eastTake = " + eastTake);
        if (eastTake[0]){
            console.log("Taking pieces to the east")
            //for (var i = 0; i < eastTake[1].length; i++){
            for (var i = eastTake[1].length; i >= 0 ; i--){
                    console.log("Replace " + eastTake[1][i] + " at " + xPos+i + "," + yPos);
                    board[yPos][xPos+i] = eastTake[1][i];
            }
        }
        console.log(eastTake);
    }

    if (southAdjacent.length > 0){
        console.log("Looking to the south")
        var southTake = findPiecesToTake(southAdjacent, team);
        console.log("southTake = " + southTake);
        if (southTake[0]){
            console.log("Taking pieces to the south")
            //for (var i = 0; i < southTake[1].length; i++){
            for (var i = southTake[1].length; i >= 0 ; i--){
                console.log("Replace " + southTake[1][i] + " at " + xPos+i + "," + yPos);
                board[yPos+i][xPos] = southTake[1][i];
            }
        }
        console.log(southTake);
    }
    if (westAdjacent.length > 0){
        console.log("Looking to the west")
        var westTake = findPiecesToTake(westAdjacent, team);
        console.log("westTake = " + westTake);
        if (westTake[0]){
            console.log("Taking pieces to the west")
           // for (var i = 0; i < westTake[1].length; i++){
            for (var i = westTake[1].length; i >= 0 ; i--){
                console.log("Replace " + westTake[1][i] + " at x:" + xPos+i + ", y:" + yPos);
                board[yPos][xPos-i] = westTake[1][i];
            }
        }
        console.log(westTake);
    }
}

//Returns an array of adjacent pieces with the correct ones taken
function findPiecesToTake(adjacent, team){
    var captured = false;
    var result = new Array();
    //If both teams are involved 
    if (adjacent.includes(1, 2)){
        for (var i = adjacent.length - 1; i >= 0; i--) {
            console.log(i + " - " + adjacent[i]);
            //If not already captured, and it's not the next tile and they are your team then you can capture some tiles
            if (!captured && adjacent[i] == team){
                captured = true;
            }
            if (captured && adjacent[i] != team){
                adjacent[i] = 0;
            }
        }
    }
    result.push(captured);
    result.push(adjacent);
    return result;
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
    console.log(pieces.length + " pieces in " + direction);
    return result;
}

//Turns an array into a HTML table
//Adapted from https://stackoverflow.com/questions/15164655/generate-html-table-from-2d-javascript-array
function makeTableHTML(myArray) {
    var result = "<table border=1>";
    for(var i=0; i<myArray.length; i++) {
        result += "<tr>";
        for(var j=0; j<myArray[i].length; j++){
            if (myArray[i][j] != 0){
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