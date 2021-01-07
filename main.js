//TO DO:
// GAMEPLAY LOGIC ONLY FOR MOVEMENT OF ONE PLAYER

// - write a small checker function to see if the current player has more more than one piece on the board
// (iterate through positions array of the current player and see if there is more than one element not equal to 0)
// - set starting points of other players to be +10
// - ask user for choice when there is more than one player on the board
// - check if all actions can be performed with the diceChecker function depending on different parameters that are put in
// - also a check to see if players are not on same position (iterate through positions array and check if they would have the same position after the dice roll)
// - also a check if you get a six and you already have a player on the starting plot (then you can't get a new player out)


let initialDOM = document.getElementById("main-board").innerHTML;

localStorage.setItem("initialDOM", initialDOM);

let players = [{
    username: "Antonis",
    color: "red",
    positions: [0, 0, 0, 0],
    allAtHome: true
}, {
    username: "James",
    color: "green",
    positions: [0, 0, 0, 0],
    allAtHome: true
}, {
    username: "Nicklaus",
    color: "yellow",
    positions: [0, 0, 0, 0],
    allAtHome: true
}, {
    username: "Pio",
    color: "blue",
    positions: [0, 0, 0, 0],
    allAtHome: true
}];

function rollDice() {
    const dice = Math.floor(Math.random() * 6) + 1;
    return dice;
}


function diceChecker(dice, currentPlayer) {

    // First roll of the dice when the players are all the home

    // If you don't get a six
    if (dice < 6 && players[currentPlayer]["allAtHome"]) {
        alert(`Sorry ${players[currentPlayer]["username"]}, you need 6! You got ${dice}.`);

        // If you get a six    
    } else if (dice == 6 && players[currentPlayer]["allAtHome"]) {
        players[currentPlayer]["positions"] = [1, 0, 0, 0];
        players[currentPlayer]["allAtHome"] = false;
        alert("Congrats, you're out!");

        // When not all players are at home    
    } else {
        // If user gets six, they should have a choice of which piece to move
        if (dice == 6) {
            let userChoice = parseInt(prompt("Type the number of figure you want to move", 1));

            // Move figure based on user choice, should make it more dynamic
            if (userChoice == 1) {
                players[currentPlayer]["positions"][userChoice] = 1;
            } else {
                players[currentPlayer]["positions"][userChoice] = players[currentPlayer]["positions"][0] + dice;
            }

            // when user doesn't get a six, a figure on the board moves, can't take a new one out of the house
        } else {
            players[currentPlayer]["positions"][0] = players[currentPlayer]["positions"][0] + dice;
        }
    }
}

// DOM Manipulation

function render() {

    document.getElementById("main-board").innerHTML = localStorage.getItem("initialDOM");

    for (let index = 0; index < players.length; index++) {
        const player = players[index];

        for (let i = 0; i < player.positions.length; i++) {
            const position = player.positions[i];

            if (position > 0) {
                // add pawn to the current posiiton
                document.getElementById('pos' + position).innerHTML = '<i class="fas fa-chess-pawn"></i>';

                // remove already exisiting properties from the slot where the player landed
                document.getElementById('pos' + position).classList.remove("white");
                document.getElementById('pos' + position).classList.remove("green");
                document.getElementById('pos' + position).classList.remove("blue");
                document.getElementById('pos' + position).classList.remove("red");
                document.getElementById('pos' + position).classList.remove("yellow");

                // add color of the current player to the slot where the figure is on currently
                document.getElementById('pos' + position).classList.add(player.color);

            } else {
                document.getElementById('initial-' + player.color + '-' + i).innerHTML = '<i class="fas fa-chess-pawn"></i>';
            }
        }
    }
}

function showDice() {
    diceChecker(rollDice(), currentPlayer);
}