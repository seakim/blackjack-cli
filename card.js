/**
 * 
 */

var Card = function () {
    /** 6 decks */
    this.deckNum = 6;
    this.deck = [];

    /** 
     * Set k decks (52 * k cards); deck of [x,y] * k
     * Shape -- deck[k][i][j]; where i=0 -> spades, i=1 -> hearts, i=2 -> diamonds, i=3 -> clubs
     * Number -- deck[k][i][j]; where j=0 -> A, j=1 -> 2, ..., j=8 -> 9, j=9 -> 10, j=10 -> J, j=11 -> Q, j=12 -> K;
     * deck = [[0,0],[0,1],[0,2],[0,3],[1,0], ..., [x,y], ..., [3,12]];
    */
    this.setDecks = function () {
        for (var k = 0; k < this.deckNum; k++) {
            for (var i = 0; i < 4; i++) {
                for (var j = 0; j < 13; j++) {
                    this.deck.push([i, j]);
                }
            }
        }
        return this.deck;
    }

    /** shuffle deck randomly */
    this.shuffleDecks = function () {
        this.setDecks();
        for (var i = this.deck.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = this.deck[i];
            this.deck[i] = this.deck[j];
            this.deck[j] = temp;
        }
        return this.deck;
    }
    
    /** test code: expect to see same number on each shape. */
    this.test = function () {
        var result = {
            spades: 0,
            hearts: 0,
            diamonds: 0,
            clubs: 0
        };
        for (var i = 0; i < this.deck.length; i++) {
            if (this.deck[i][0] === 0) {
                result.spades += 1;
            } else if (this.deck[i][0] === 1) {
                result.hearts += 1;
            } else if (this.deck[i][0] === 2) {
                result.diamonds += 1;
            } else if (this.deck[i][0] === 3) {
                result.clubs += 1;
            }
        }
        return result;
    }
}

// var card = new Card();
// card.shuffleDecks();
// console.log(card.test());

module.exports = Card;