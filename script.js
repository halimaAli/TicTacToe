//get buttons and containers
const startbutton = document.querySelector(".startbutton");
const modal = document.querySelector(".modal");
const choiceButtons = document.querySelectorAll(".choiceButton");
const choiceOne = document.querySelector(".choiceOne");
const choiceTwo = document.querySelector(".choiceTwo");
const welcomePage = document.querySelector(".begin");
const retryButton = document.querySelector(".retry");
const main = document.querySelector(".main");
const infoContainer = document.querySelector(".info");
const playerOneScore = document.querySelector(".playerOne-score");
const playerTwoScore = document.querySelector(".playerTwo-score");

//add event listeners
startbutton.addEventListener("click", start);
choiceOne.addEventListener("click", choiceMode);
choiceTwo.addEventListener("click", choiceMode);
welcomePage.addEventListener("animationend", hide)
choiceButtons.forEach(button => {
    button.addEventListener("mouseenter", hover);
    button.addEventListener("mouseleave", notHover)
});

//Gameboard Module
const Gameboard = (() => {
    let board = document.querySelectorAll(".col");
    let currentCell;

    const setCurrentCell = (t) => {
        currentCell = t;
    }

    const loadBoard = () => {
        board.forEach(cell => {
            cell.innerHTML = "";
            cell.classList.add("cell");
            cell.classList.remove(Game.winType);
            cell.addEventListener("click", place);
        });

        retryButton.classList.add("hidden");

        playerOne.turn = true;
        playerTwo.turn = false;
        Game.fullCells = 0;
        Game.showInfo("Player 1's turn");

        if (Game.mode == 1) {
            Com.boardCopy = [0,1,2,3,4,5,6,7,8];
        }
    }

    const removeListeners = () => {
        board.forEach(cell => {
            cell.removeEventListener("click", place);
        });
    }

    const getCurrentRow = () => {
        return currentCell.parentNode.childNodes;
    }

    const getCurrentColumn = () => {
        let getClass = currentCell.classList[1];
        return currentColumn = document.querySelectorAll("." + getClass);
    }

    const getCurrentDiag = () => {
        let diags = [[board[0],board[4],board[8]],[board[2],board[4],board[6]]];
        let diag = [];
        diags.forEach(elem => {
            if (elem.includes(currentCell)){
                diag = elem;
            }
        });
        return diag;
    }

    function highlightCells(winningCells, type){
        if (type === "row") {
            Game.winType = "row-win";
           let n = 5;
            while (n > 0) {
               winningCells[n].classList.add("row-win");  
               winningCells[n].classList.remove("cell");
               n -=2;
            }
        }
        else if (type === "column"){
            Game.winType = "column-win";
            winningCells.forEach(cell => {
            cell.classList.add("column-win");
            cell.classList.remove("cell");
        });
        } else {
            Game.winType = "row-win";
            winningCells.forEach(cell => {
                cell.classList.add("row-win"); ///row and diag have same animation
                cell.classList.remove("cell");
            });
        }
        removeListeners();
    }

    return {removeListeners, loadBoard, currentCell, board, getCurrentRow, getCurrentColumn, getCurrentDiag, setCurrentCell, highlightCells};
})();

function place() {
    if (this.innerHTML == "") {
        Game.fullCells++;
        Gameboard.setCurrentCell(this);
       // Gameboard.currentCell = this;
        if (playerOne.turn){
            this.innerHTML = playerOne.sym;

            if (Game.mode == 1){
                for(let i = 0; i < 10; i++){
                    if (Gameboard.board[i] == this){
                        let deleteAt = Com.boardCopy.indexOf(i);
                        Com.boardCopy.splice(deleteAt,1);
                        break;
                    }
                }
                
                playerOne.turn = false;
                Com.com.turn = true;
                playerOne.moveCounter++;

                Game.showInfo("Com's turn");

                let check = Game.check(playerOne);
                if (!check){
                    Com.placeRandom();
                }
                
            }
            else{
                playerOne.turn = false;
                playerTwo.turn = true;
                playerOne.moveCounter++;
                Game.showInfo("Player 2's turn");
                Game.check(playerOne); 
            }
           
        }
        else{
            this.innerHTML = playerTwo.sym;
            playerTwo.turn = false;
            playerOne.turn = true;
            playerTwo.moveCounter++;
            Game.showInfo("Player 1's turn");
            Game.check(playerTwo);
        }
    }
}

//Player constructor
const Player = (name, sym) => {
    let turn;
    let wins = 0;
    let moveCounter = 0;

    const scored = () => {
        wins++;
        if (name === "Player 1"){
            playerOneScore.innerHTML = wins;
        } else {
            playerTwoScore.innerHTML = wins;
        }
    };
    return {moveCounter, sym, name, turn, scored};
}

//Game Module
const Game = (() => {
    let mode = 0;  
    let winner = "";
    let winType = "placeholder";
    let fullCells = 0;
    retryButton.addEventListener("click", Gameboard.loadBoard);
    
    //add game logic
    const check = (player) =>  {
        if (player.moveCounter >= 3) {
            let currentRow = Gameboard.getCurrentRow();
            let currentColumn = Gameboard.getCurrentColumn();
            let currentDiag = Gameboard.getCurrentDiag();

            //check if current row is a match
            if (currentRow[1].innerHTML == player.sym & currentRow[3].innerHTML == player.sym & currentRow[5].innerHTML == player.sym){ //check pos 1,3,5
                player.scored();
                Gameboard.highlightCells(currentRow,"row");
                showInfo(player.name + " won ");
                restart();
                return true;
            }
            //check current column
            else if (currentColumn[0].innerHTML == player.sym & currentColumn[1].innerHTML == player.sym & currentColumn[2].innerHTML == player.sym) {
                player.scored();
                Gameboard.highlightCells(currentColumn,"column");
                showInfo(player.name + " won ");
                restart();
                return true;
            }
            //check current diag
            else if (currentDiag.length != 0){   

                if (currentDiag[0].innerHTML == player.sym & currentDiag[1].innerHTML == player.sym & currentDiag[2].innerHTML == player.sym) {
                     player.scored();
                     Gameboard.highlightCells(currentDiag,"diag");
                     showInfo(player.name + " won ");
                     restart();
                     return true;
                }
            }
            else if (Game.fullCells === 9){
                restart();
                showInfo("It's a tie!");
                return true;
            }
        }
    }

    const showInfo = (info) => {
        infoContainer.innerHTML = info;   
    }

    const restart = () => {
        retryButton.classList.remove("hidden");
    }

    return {winner, mode, check, showInfo, winType , fullCells};
})();

const Com = (() => {
    let com = Player("Com", 'O');
    let mode = "easy";
    let boardCopy = [0,1,2,3,4,5,6,7,8];
    
    const placeRandom = () => {
        
        let index = Com.boardCopy[Math.floor(Math.random() * Com.boardCopy.length)];
        let randomCell = Gameboard.board[index];
        
        if (randomCell.innerHTML == "" & Com.boardCopy.length > 0){
            Game.fullCells++;
            Gameboard.setCurrentCell(randomCell);
            randomCell.innerHTML = 'O';

            let deleteAt = Com.boardCopy.indexOf(index);
            Com.boardCopy.splice(deleteAt,1);

            com.turn = false;
            playerOne.turn = true;
            com.moveCounter++;
            Game.showInfo("Player 1's turn");
            Game.check(com);
       }
    };

    return {placeRandom, com, boardCopy};
})();

//initizialze two players
let playerOne = Player("Player 1", "X");
let playerTwo = Player("Player 2", "O");

function start() {
    modal.style.display = "flex";
}

//changes mode-selection-buttons from static to animated
function notHover(){
    this.classList.remove("animated");
    this.classList.add("static")
}

function hover(){
    this.classList.remove("static");
    this.classList.add("animated");
}

//handle mode-selection-buttons
function choiceMode() {
    modal.style.display = "none";
    welcomePage.classList.add('fadeout'); 

    if(this == choiceOne){
        Game.mode = 1;
    }
    else{
        Game.mode = 2;
    }
    Gameboard.loadBoard();
}

//hides welcomepage and mode-selection-buttons
function hide(){
    if(Game.mode != 0){
     welcomePage.classList.add('hidden');
     main.classList.remove("hidden");
    }   
}


window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
}