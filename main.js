//TO DO 11/01:
// - Eating other players
// - Blocking when landing on your own player

const initialState = document.getElementById("main-board").innerHTML;
let currentPlayer = 0;
let currentPawn;
let lastDice;
let roundCount = 0;
let activeRollCount = 0;
let isLocked = false;

let players = [{
    username: "Antonis",
    color: "red",
    positions: [0, 0, 0, 0],
    activePawnCount: 0
}, {
    username: "Mihaly",
    color: "green",
    positions: [0, 0, 0, 0],
    activePawnCount: 0
}, {
    username: "Ana",
    color: "yellow",
    positions: [0, 0, 0, 0],
    activePawnCount: 0
}, {
    username: "Pio",
    color: "blue",
    positions: [0, 0, 0, 0],
    activePawnCount: 0
}];

// Rolling the dice function
function rollDice() {
    const dice = Math.floor(Math.random() * 6) + 1;
    document.getElementById("dice-img").src = `./dice-${dice}.png`;
    return dice;
}

//Checking if first position taken function
function pawnOverlapHandler(landingPos) {
    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        for (let x = 0; x < player.positions.length; x++) {
            const pos = player.positions[x];
            if (pos == landingPos) {
                if (i == currentPlayer) {
                    return "stop";
                } else {
                    players[i].positions[x] = 0;
                    players[i].activePawnCount--;
                }
            }
        }
    }
    return "move";
}


// Function to move the piece on the board
function movePawn(player, pawnIndex, dice) {
    // Selects the pawn (element in the positions array) and adds to its position the value of rolled dice. 
    // Modulo 40 is there to make sure the circle continues even past the slot with the id of 40
    // e.g. if you roll 5 from position 1, 5%40 will be five, and 45%50 will be five, so it will continue past the circle
    // Not so important for red, but important for other colors, since universal board posiiton indexs spans 1-40

    // Check to see if the player has made the move
    let isMoveDone = true;

    if (pawnOverlapHandler((players[player].positions[pawnIndex] + dice) % 40) == "stop") {
        alert("Your player already took that place.");
        isMoveDone = false;
    }
    // Scenario 1: Going from home to first position
    else if (players[player].positions[pawnIndex] == 0 && dice == 6) {
        // The initial position should be 1, 11, 21, 31 -> so the formula to get the initial position for every starting position is player's index * 10 + 1
        if (pawnOverlapHandler(1 + player * 10) == "stop") {
            alert("You already have a pawn on this position. Please move another one.");
            isMoveDone = false;
        } else {
            players[player].positions[pawnIndex] = 1 + player * 10;
        }

        // Scenario 2: going into end poisitons
        //CHECK TO PREVENT PLAYER FROM GOING INTO THE SECOND CYCLE AND PUT THE PAWN INTO END POSITION
    } else if (players[player].positions[pawnIndex] > 0 && // STEP 1: Check if the pawn is NOT on the starting positions
        (
            // Checking if pawns are in danger zone (aka rolling a dice could get them into a second cycle)
            players[player].positions[pawnIndex] < player * 10 + 1 // STEP 2a: Green, yellow and blue are in positions LESS THAN their starting point
            ||
            (player == 0) && (players[player].positions[pawnIndex] > 34) // STEP 2b: Red is in a position greater than 34
        ) &&
        // Check to see if the new position will take them over the starting point once the dice comes into effect
        dice + players[player].positions[pawnIndex] >= player * 10 + 1) {

        let newPos = -1 * ((dice + players[player].positions[pawnIndex]) % (40 - ((10 * (4 - player)) % 40))); //40-(4-player)*10)%40 - Formula for deciding the point at which the player goes into end positions 

        if (pawnOverlapHandler(newPos) == "stop" || newPos < -4) {
            alert("You already have a pawn on this position. Please move another one.");
            isMoveDone = false;
        } else {
            players[player].positions[pawnIndex] = newPos;
        }

        // Scenario 3: Normal roll on the board    
    } else {
        players[player].positions[pawnIndex] = (players[player].positions[pawnIndex] + dice) % 40;
    }

    // Only when the player has finished the move can we reset the current pawn and unlock the game
    if (isMoveDone) {
        currentPawn = undefined;
        isLocked = false;
    }

}


function nextPawnHandler() {
    for (let i = 0; i < players[currentPlayer].positions.length; i++) {
        if (players[currentPlayer].positions[i] == 0) {
            return i;
        }
    }
}

function currentPawnHandler() {
    for (let i = 0; i < players[currentPlayer].positions.length; i++) {
        if (players[currentPlayer].positions[i] > 0) {
            return i;
        }
    }
}

// Function to check dice
function diceChecker(dice) {

    lastDice = dice;

    // If you don't get a six and all players are home
    if (dice < 6 && players[currentPlayer]["activePawnCount"] == 0) {
        alert(`Sorry ${players[currentPlayer]["username"]}, you need 6! You got ${dice}.`);

        // If you get a six and all players are home aka you're getting the first pawn out
    } else if (dice == 6 && players[currentPlayer]["activePawnCount"] == 0) {
        movePawn(currentPlayer, nextPawnHandler(), dice);
        players[currentPlayer]["activePawnCount"] += 1;
        alert(`Congrats ${players[currentPlayer]["username"]}, you're out!`);

        // When you have multiple players active but you don't roll a 6   
    } else if (dice < 6 && players[currentPlayer]["activePawnCount"] > 1) {

        // You need to make a choice, so the board is locked
        isLocked = true;

        if (currentPawn == undefined) {
            alert(`You have more than 1 piece on the board, ${players[currentPlayer].username}. Please choose which piece to play.`);
        } else {

            if (players[currentPlayer].positions[currentPawn] == 0) {
                // movePawn(currentPlayer, currentPawn, dice)
                // players[currentPlayer]["activePawnCount"] += 1;
                alert("Please move one of the pieces on the board.");
            } else {
                movePawn(currentPlayer, currentPawn, dice);
            }

        }

        // Player rolls less than 6 and has only one piece out
    } else if (dice < 6 && players[currentPlayer]["activePawnCount"] == 1) {
        // Can only move the piece that's out aka first piece
        movePawn(currentPlayer, currentPawnHandler(), dice);

        // Player rolls a six and already has more than one piece out
    } else if (dice == 6 && players[currentPlayer]["activePawnCount"] > 0) {

        isLocked = true;

        if (currentPawn == undefined) {
            alert(`You rolled a six, ${players[currentPlayer].username}. Please choose which piece to play.`);
        } else {

            if (players[currentPlayer].positions[currentPawn] == 0) {
                movePawn(currentPlayer, currentPawn, dice)
                players[currentPlayer]["activePawnCount"] += 1;
            } else {
                movePawn(currentPlayer, currentPawn, dice);
            }

        }
    }
}

// Focus legit pieces
// for (let i = 0; i < players[currentPlayer].positions.length; i++) {
//     if (players[currentPlayer].positions[i] !== 0) {
//         document.getElementById('pos' + players[currentPlayer].positions[i]).classList.add("focus");
//     }
// }

function currentPawnDet(id) {
    // References object that activates onclick function and returns its ID
    // For example, if we click on first red pawn with the id of red0
    // it returns the same as alert(document.getElementById("red0").id);
    currentPawn = parseInt(id.slice(-1));
    let currentColor = id.slice(0, -1);
    // console.log(currentPawn);

    if (isLocked && players[currentPlayer].color == currentColor) {
        diceChecker(lastDice);
        render();
    }
}


// DOM Manipulation

function render() {

    // Getting the value stored in local storage under the initialDOM key (aka the inner HTML content of our initial DOM) and loading it into the current "main-board" element
    // AKA reseting the state of the game board to its original version
    document.getElementById("main-board").innerHTML = initialState;

    document.getElementById("player").innerHTML = `${players[currentPlayer].color}, ${players[currentPlayer].username}`;
    // This then renders the changes in the DOM based on gameplay
    for (let index = 0; index < players.length; index++) {
        const player = players[index];

        for (let i = 0; i < player.positions.length; i++) {
            const position = player.positions[i];

            if (position > 0) {
                // add pawn to the current posiiton
                document.getElementById('pos' + position).innerHTML = `<i onClick="currentPawnDet(this.id)" id="${player.color+i}" class="fas fa-chess-pawn"></i>`;

                // remove already exisiting properties from the slot where the player landed
                document.getElementById('pos' + position).classList.remove("white");
                document.getElementById('pos' + position).classList.remove("green");
                document.getElementById('pos' + position).classList.remove("blue");
                document.getElementById('pos' + position).classList.remove("red");
                document.getElementById('pos' + position).classList.remove("yellow");

                // add color of the current player to the slot where the figure is on currently
                document.getElementById('pos' + position).classList.add(player.color);

            } else if (position < 0) {
                document.getElementById(player.color + '-pos' + position).innerHTML = `<i id="${player.color+i}" class="fas fa-chess-pawn"></i>`;
            } else {
                // When this function renders pawn at home, it adds onto them unique IDs based on their color and index (0-4)
                // It also adds to them onclick event function which provides the id of the click element
                document.getElementById('initial-' + player.color + '-' + i).innerHTML = `<i onClick="currentPawnDet(this.id)" id="${player.color+i}" class="fas fa-chess-pawn"></i>`;
            }
        }
    }
}

render();

function nextPlayer() {
    currentPlayer = (currentPlayer + 1) % 4;
}

function iterateGame() {

    // This is for the 
    if (roundCount > 0) {

        if (isLocked) {
            alert("Hey, you cannot roll the dice now. You should wait for " + players[currentPlayer].color + " to finish their turn.");
        } else {

            if (activeRollCount < 3 && players[currentPlayer]["activePawnCount"] == 0) {
                activeRollCount++;
                diceChecker(rollDice());
                render();
            } else if (lastDice == 6) {
                diceChecker(rollDice());
                render();
            } else {
                nextPlayer();
                activeRollCount = 1;
                diceChecker(rollDice());
                render();
            }

        }


    } else {

        let starter = Math.floor(Math.random() * 4);
        alert("First player is " + players[starter].color);
        currentPlayer = starter;
    }

    roundCount += 1;
}