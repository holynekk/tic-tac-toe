"use strict";


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

    return{getSquare, setSquare, resetBoard};
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
        round++;
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
            }
        });
        return flag;
    }
    return {isOver,resetGame, playRound};
})();