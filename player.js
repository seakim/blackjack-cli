/**
 * 
 */
'use strict';

var Player = function (name, budget) {
    this.name = name;
    this.budget = budget;
    this.betAmount = 0;
    this.handArea = [];
    this.handValue = 0;
    this.status = null;
}

var playerSetup = (function () {
    var dealer = {
        name: "dealer",
        handArea: [],
        handValue: 0,
        status: null
    };
    var players = [];

    var addPlayer = function (name, budget) {
        var newPlayer = new Player(name,budget);
        players.push(newPlayer);
    }
    var removePlayer = function (name) {
        for (var i = 0; i < players.length; i++) {
            if (name === this.players[i].name) {
                this.players.splice(i, 1);
            }
        }
    }
    return {
        players: players,
        dealer: dealer,
        addPlayer: addPlayer,
        removePlayer: removePlayer
    }
})();

// playerSetup.addPlayer("Sean",1000);
// playerSetup.addPlayer("James",1000);
// playerSetup.removePlayer("Sean");
// console.log(playerSetup.players);
// console.log(playerSetup.dealer);

module.exports = playerSetup;