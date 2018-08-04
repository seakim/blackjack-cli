
/**
 * 
 */
'use strict';

var cardSetup = (function () {
    /** 6 decks */
    var deckNum = 6,
        shoe = [];
    /** 
     * Shoe: (deckNum) * (52) - composed of [x,y] * 52 * (deckNum)
     * setShoe: [[0,0],[0,1],[0,2],[0,3],[1,0], ..., [x,y], ..., [3,12]]
     * Suit -- shoe[i][0]; x=0 -> spades, x=1 -> hearts, x=2 -> diamonds, x=3 -> clubs
     * Value -- shoe[i][1]; y=0 -> A, y=1 -> 2, ..., y=8 -> 9, y=9 -> 10, y=10 -> J, y=11 -> Q, y=12 -> K
    */
    var setDecks = function () {
        for (var k = 0; k < deckNum; k++) {
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 13; j++) {
                    shoe.push([i, j]);
                }
            }
        }
        return shoe;
    }

    /** shuffle deck randomly */
    var shuffleDecks = function () {
        setDecks();
        for (var i = shoe.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = shoe[i];
            shoe[i] = shoe[j];
            shoe[j] = temp;
        }
        return shoe;
    }
    
    /** test code: expect to see same number on each shape. */
    var test = function () {
        var result = {
            spades: 0,
            hearts: 0,
            diamonds: 0,
            clubs: 0
        };
        for (var i = 0; i < shoe.length; i++) {
            if (shoe[i][0] === 0) {
                result.spades += 1;
            } else if (shoe[i][0] === 1) {
                result.hearts += 1;
            } else if (shoe[i][0] === 2) {
                result.diamonds += 1;
            } else if (shoe[i][0] === 3) {
                result.clubs += 1;
            }
        }
        return result;
    };

    return {
        test: test,
        shuffleDecks: shuffleDecks,
        shoe: shoe
    }
})();

// cardSetup.shuffleDecks();
// console.log(cardSetup.shoe);
// console.log(cardSetup.test());

module.exports = cardSetup;