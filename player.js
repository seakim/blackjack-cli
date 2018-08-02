/**
 * 
 */

var Table = function () {
    this.dealer = {
        name: "dealer",
        handArea: [],
        handValue: 0,
    };
    this.players = [];
    this.recipients = [];
    this.addPlayer = function (name, budget) {
        var newPlayer = new Player(name,budget);
        this.players.push(newPlayer);
        this.recipients.push(newPlayer);
    }
    this.removePlayer = function (name) {
        for (var i = 0; i < this.players.length; i++) {
            if (name === this.players[i].name) {
                this.players.splice(i, 1);
            }
        }
    }
    this.recipients.push(this.dealer);
}

var Player = function (name, budget) {
    this.name = name;
    this.budget = budget;
    this.bet = 0;
    this.handArea = [];
    this.handValue = 0;
}

// var table = new Table();
// table.addPlayer("Sean",1000);
// table.addPlayer("James",1000);
// // table.removePlayer("sean");
// console.log(table);

module.exports = Table;