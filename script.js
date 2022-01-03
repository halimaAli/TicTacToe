//Gameboard

const Gameboard = (() => {
    let board = [];
    const reloadBoard = () => {
        for(let i = 0; i < 10; i++){
            board[i] = "";
        }
    }

    const place = (pos, sym) => {
        if (board[pos] = "") {
            board[pos] = sym;
        }
    }

    return {reloadBoard, place}
})();

const Player = () => {
    let turn;
    let wins;

    const changeTurn = () => {
        if (!turn) {
            turn = true; 
        }
        else {
            turn = false;
        }
    } 

    const won = () => {
        wins++;
    }

    return {turn, wins, changeTurn, won};
}

const Game = (() => {
    let mode = 0;
    let playerOne = null;
    let playerTwo = null;
    const start = () => {
        
    };

    return {start, mode};
})();

//handle gamemode choice
const startbutton = document.querySelector(".startbutton");
startbutton.addEventListener("click", start);
const modal = document.querySelector(".modal");

function start() {
    modal.style.display = "flex";
}

const choiceButtons = document.querySelectorAll(".choiceButton");
choiceButtons.forEach(button => {
    button.addEventListener("mouseenter", hover);
    button.addEventListener("mouseleave", notHover)
});
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

const welcomePage = document.querySelector(".begin");
welcomePage.addEventListener("animationend", hide)

function choiceMode() {
    if(this == choiceOne){
        Game.mode = 1;
    }
    else{
        Game.mode = 2;
    }
    modal.style.display = "none";
    welcomePage.classList.add('fadeout');  
}

function hide(){
    if(Game.mode != 0){
     welcomePage.classList.add('hidden');
    }   
}


window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
}