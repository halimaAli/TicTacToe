//Gameboard Module
const Gameboard = (() => {
    let board = document.querySelectorAll(".col");

    const loadBoard = () => {
        board.forEach(cell => {
            cell.innerHTML = "";
            cell.addEventListener("click", place);
        });
    }

    function place() {
        if (this.innerHTML == "") {
            if (playerOne.turn){
                this.innerHTML = playerOne.sym;
                playerOne.turn = false;
                playerTwo.turn = true;
            }
            else{
                this.innerHTML = playerTwo.sym;
                playerTwo.turn = false;
                playerOne.turn = true;
            }
        }
    }

    return {loadBoard}
})();

//Player constructor
const Player = (name, sym) => {
    let turn;
    let wins = 0;
    let counter;

    const changeTurn = (newTurn) => {
        turn = newTurn;
    } ;

    const won = () => {
        wins++;
    };

    return {counter, sym, name, turn, changeTurn, won};
}

//Game Module
const Game = (() => {
    let mode = 0;  
    let winner = "";

    //add game logic
    //add ai player
    return {winner, mode};
})();

//initizialze two players
let playerOne = Player("playerOne", "X");
let playerTwo = Player("playerTwo", "O");

//handle start button
const startbutton = document.querySelector(".startbutton");
startbutton.addEventListener("click", start);
const modal = document.querySelector(".modal");

function start() {
    modal.style.display = "flex";
}

//handle game mode selection
const choiceButtons = document.querySelectorAll(".choiceButton");
choiceButtons.forEach(button => {
    button.addEventListener("mouseenter", hover);
    button.addEventListener("mouseleave", notHover)
});

  //change button from static to animated
function notHover(){
    this.classList.remove("animated");
    this.classList.add("static")
}

function hover(){
    this.classList.remove("static");
    this.classList.add("animated");
}

const choiceOne = document.querySelector(".choiceOne");
const choiceTwo = document.querySelector(".choiceTwo");

choiceOne.addEventListener("click", choiceMode);
choiceTwo.addEventListener("click", choiceMode);

//lets modal and welcome text vanish and then hides it completly with hide()
const welcomePage = document.querySelector(".begin");

welcomePage.addEventListener("animationend", hide)
 const main = document.querySelector(".main");

function choiceMode() {
    modal.style.display = "none";
    welcomePage.classList.add('fadeout'); 

    if(this == choiceOne){
        Game.mode = 1;
    }
    else{
        Game.mode = 2;
    }

    playerOne.turn = true;
    playerTwo.turn = false;
    Gameboard.loadBoard();
}

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