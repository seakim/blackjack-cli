/**
 * burnCard, cutCard, bet, bettingLimit, deal hit, stand, blackjack, bust, push, doubleDown, insurance, pair, split, surrender, upcard
 */

var Table = require('./player.js');
var Card = require('./card.js');
var PlayerAction = require('./playerAction.js');

var table = new Table();
table.addPlayer("Sean",1000);
table.addPlayer("Mike",1000);

var card = new Card();
card.shuffleDecks();
// console.log(card.deck);

var Game = (function () {
    var calculateCardValue = function (card) {
        var value = 0;
        if (card[1] === 0) {
            if (value + card[1] <= 21) {
                value += 11;
            } else {
                value += 1;
            }
        } else if (card[1] >= 9 && card[1] <= 12) {
            value += 10;
        } else {
            value += card[1] + 1;
        }
        return value;
    };

    return {
        deal: function () {
            for (var i = 0; i < 2; i++) {
                for (var j = 0; j < table.players.length; j++) {
                    var dealtCardtoPlayers = card.deck.shift();
                    table.players[j].handArea.push(dealtCardtoPlayers);
                    table.players[j].handValue += calculateCardValue(dealtCardtoPlayers);
                }
                var dealtCardtoDealer = card.deck.shift();
                table.dealer.handArea.push(dealtCardtoDealer);
                table.dealer.handValue += calculateCardValue(dealtCardtoDealer);
            }
            return table;
        }
    }
})();



console.log(Game.deal());
console.log(card.deck.length);
// console.log(table.recipients)
console.log(table.players[0]);
console.log(table.players[1]);
console.log(table.dealer);


module.exports = Game;