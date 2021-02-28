
let gameMode;

askMode();

// Player factory function.
const Player = (sign)=>{
    this.sign = sign;

    const getSign = ()=>{
        return sign;
    };

    return {getSign};
};

const theGame = (()=>{
    let gameBoard = ["", "", "", "", "", "", "", "", ""];
    const getSquare = (ind)=>{
        return gameBoard[ind];
    };

    const setSquare = (ind, sign)=>{
        gameBoard[ind] = sign;
    };

    const resetBoard = ()=>{
        for(let i = 0; i < 9; i++){
            gameBoard[i] = "";
        }
    };

    return{getSquare, setSquare, resetBoard, emptySquares, gameBoard};
})();

const resultControl = (()=>{
    const allSquares = document.querySelectorAll('.square');
    const message = document.querySelector('.round-text');
    const restartButton = document.querySelector('.restart-button');

    allSquares.forEach((square)=>{
        square.addEventListener("click",(txt)=>{
            if(playGame.isOver() || txt.target.textContent !== ""){
                return;
            }else{
                playGame.playRound(parseInt(txt.target.dataset.index));
                refreshGameBoard();
            }
        });
    });

    restartButton.addEventListener("click",(txt)=>{
        theGame.resetBoard();
        playGame.resetGame();
        refreshGameBoard();
        message.textContent = "Player X's turn";
    });

    function refreshGameBoard(){
        for(let i = 0; i < 9; i++){
            allSquares[i].textContent = theGame.getSquare(i);
        }
    }

    function setResult(res){
        if(res === "draw"){
            setMessage("It's a draw!");
        }else{
            setMessage(`Player ${res} has won!`);
        }
    }

    function setMessage(txt){
        message.textContent = txt;
    }
    return {setResult, setMessage};
})();



const playGame = (()=>{
    const firstPlayer = Player("X");
    const secondPlayer = Player("O");

    let over = false;
    let round = 1;
    
    function playRound(index){
        theGame.setSquare(index, currentSign());

        // This place is for AI.
        if(gameMode === "pvc"){
            if(isThereWinner() === false){
                bestSpot();
            }
        }
        
        if(isThereWinner()){
            resultControl.setResult(currentSign());
            over = true;    
            return;
        }
        if(round === 9){
            resultControl.setResult("draw");
            over = true;
            return;
        } 

        if(gameMode === "pvc"){
            round += 2;
        }else round++;

        resultControl.setMessage(`Player ${currentSign()}'s turn`);
    }

    function currentSign(){
        return round % 2 == 1 ? firstPlayer.getSign() : secondPlayer.getSign();
    }

    function isOver(){
        return over;
    }

    function resetGame(){
        round = 1;
        over = false;
    }

    function isThereWinner(){
        let conditions = [[0,1,2], [3,4,5], [6,7,8], [0,4,8], [2,4,6], [0,3,6], [1,4,7], [2,5,8]];
        let result = 0;
        let flag = false;
        let winner;
        conditions.forEach(condition=>{
            result = 0;
            for(let i = 0; i < 3; i++){
                if(theGame.getSquare(condition[i]) === ""){
                    result += 5;
                    break;
                }else{
                    if(theGame.getSquare(condition[i]) === firstPlayer.getSign()){
                        result++;
                    }
                }
            }
            if(result < 4 && result % 3 === 0){
                flag =  true;
                winner = theGame.gameBoard[condition[0]];
            }
        });
        if(flag){
            return winner;
        }for(let i = 0; i < theGame.gameBoard.length; i++){
            if(theGame.gameBoard[i] === ""){
                return false;
            }
        }
        return "tie";
    }
    return {isOver,resetGame, playRound, isThereWinner};
})();

function emptySquares(tmpGrid){
    let empties = [];
    for(let i = 0; i < 9; i++){
        if(tmpGrid[i] == ""){
            empties.push(i);
        }
    }return empties;
}

function bestSpot(){
    let bestScore = -Infinity;
    let bestMove;

    let availableSpots = emptySquares(theGame.gameBoard);

    for(let i = 0; i < availableSpots.length; i++){

        theGame.gameBoard[availableSpots[i]] = 'O';

        let score = minimax(theGame.gameBoard, 0, false);

        theGame.gameBoard[availableSpots[i]] = '';
        if(score > bestScore){
            bestScore = score;
            bestMove = availableSpots[i];
        }
    }
    theGame.setSquare(bestMove, 'O');
}

function minimax(board, depth, isMaximizing){
    let result = playGame.isThereWinner();

    if(result){
        if(result === 'X'){
            return -10;
        }else if(result === 'O'){
            return 10;
        }else if(result === "tie"){
            return 0;
        }
    }

    if(isMaximizing){
        let bestScore = -Infinity;

        let availableSpots = emptySquares(theGame.gameBoard);
        for(let i = 0; i < availableSpots.length; i++){
            board[availableSpots[i]] = 'O';
            let score = minimax(board, depth+1, false);
            board[availableSpots[i]] = '';
            if(score > bestScore){
                bestScore = score;
            }
        }
        return bestScore;
    }
    else{
        let bestScore = Infinity;
        
        let availableSpots = emptySquares(theGame.gameBoard);
        for(let i = 0; i < availableSpots.length; i++){
            board[availableSpots[i]] = 'X';
            let score = minimax(board, depth+1, true);
            board[availableSpots[i]] = '';
            if(score < bestScore){
                bestScore = score;
            }     
        }
        return bestScore;
    }
}


function askMode(){
    const bodyElement = document.querySelector('body');

    const firstScreen = document.createElement('div');
    firstScreen.classList.add('firstScreen');

    const buttonConrainer = document.createElement('div');
    buttonConrainer.classList.add('button-container');

    const gameText = document.createElement("p");
    gameText.textContent = "Let's choose the game mode..";
    gameText.classList.add('game-text');

    firstScreen.appendChild(gameText);

    const playerButton = document.createElement('div');
    const computerButton = document.createElement('div');

    playerButton.classList.add('modeButton');
    computerButton.classList.add('modeButton');

    playerButton.textContent = "Player vs Player";
    computerButton.textContent = "Player vs Computer";

    playerButton.addEventListener("click",()=>{
        gameMode = "pvp";
        bodyElement.removeChild(firstScreen);
    });

    computerButton.addEventListener("click",()=>{
        gameMode = "pvc";
        bodyElement.removeChild(firstScreen);
    });

    buttonConrainer.appendChild(playerButton);
    buttonConrainer.appendChild(computerButton);

    firstScreen.appendChild(buttonConrainer);

    bodyElement.appendChild(firstScreen);
}