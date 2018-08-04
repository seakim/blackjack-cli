var inquirer = require("inquirer");

/**
 * USER ACTIONS: cutCard, bet, deal hit, stand, doubleDown, insurance, surrender
 * GAME ACTIONS: burnCard, blackjack, bust, push, pair, upcard
 * OTHER PROPERTIES: bettingLimit
 */

 // bug: nextPlayer(), calculateValue() - for Ace
 
 var playerSetup = require('./player.js');
 var cardSetup = require('./card.js');
 
 var gamePlay = (function () {
 
     /** SETUP SHOE OF DECKS */
     var shoe = cardSetup.shoe;
     cardSetup.shuffleDecks();
 
     /** SETUP DEALER AND PLAYERS */
     var dealer = playerSetup.dealer,
         players = playerSetup.players;
     playerSetup.addPlayer("Sean",1000);
     playerSetup.addPlayer("Mike",1000);
 
     /** SETUP CURRENT PLAYER */
     var current = 0;
     var currentPlayer = players[current];
 
     /**  */
 
     /** CALCULATE HANDS VALUE */
     var calculateCardValue = function (card) {
         var cardValue = 0;
         if (card[1] === 0) {
             if (cardValue > 10) {
                 console.log("22?")
                 cardValue += 1;
             } else {
                 cardValue += 11;
             }
         } else if (card[1] >= 9 && card[1] <= 12) {
             cardValue += 10;
         } else {
             cardValue += card[1] + 1;
         }
         return cardValue;
     };
 
     /** DEAL 2 CARDS TO THE PLAYERS AND THE DEALER */
     var deal = function () {
         for (var i = 0; i < 2; i++) {
             for (var j = 0; j < playerSetup.players.length; j++) {
                 var dealtCardtoPlayers = cardSetup.shoe.shift();
                 playerSetup.players[j].handArea.push(dealtCardtoPlayers);
                 playerSetup.players[j].handValue += calculateCardValue(dealtCardtoPlayers);
             }
             var dealtCardtoDealer = cardSetup.shoe.shift();
             /** */
             playerSetup.dealer.handArea.push(dealtCardtoDealer);
             playerSetup.dealer.handValue += calculateCardValue(dealtCardtoDealer);
 
             // calculateCardValue does not work (asyncronous)
             // playerSetup.dealer.handArea.push([0,0]);
             // playerSetup.dealer.handValue += calculateCardValue([0,0]);
             // console.log(playerSetup.dealer.handValue);
         }
     }
     
     var bust = function () {
         if (currentPlayer !== dealer) {
             currentPlayer.betAmount = 0;
             currentPlayer.handArea = [];
             currentPlayer.handValue = 0;
         }
     }
 
     /** USER ACTIONS: cutCard, bet, hit, doubleDown, stand, insurance, surrender */
     var cutCard = function (num) {
         cardSetup.shoe = cardSetup.shoe.concat(cardSetup.shoe.splice(0, num));
     }
     var bet = function (amt) {
         currentPlayer.budget -= amt;
         currentPlayer.betAmount = amt;
     }
     var insurance = function () {
         insuranceAmt = currentPlayer.betAmount / 2;
         if (dealer.handValue === 21) {
             currentPlayer.budget += insuranceAmt * 2;
         } else {
             currentPlayer.budget -= insuranceAmt;
         }
     }
     var hit = function () {
         var dealtCardtoPlayers = cardSetup.shoe.shift();
         currentPlayer.handArea.push(dealtCardtoPlayers);
         currentPlayer.handValue += calculateCardValue(dealtCardtoPlayers);
     }
     var doubleDown = function () {
         hit();
         currentPlayer.budget -= currentPlayer.betAmount;
         currentPlayer.betAmount += currentPlayer.betAmount;
         toNextPlayer();
     }
     var stand = function () {
         toNextPlayer();
     }
     var surrender = function () {
         bust();
         toNextPlayer();
     }
 
     // does not update currentPlayer
     var toNextPlayer = function () {
         if (current < players.length) {
             current += 1;
             currentPlayer = players[current];
         } else {
             currentPlayer = dealer;
         }
         return currentPlayer;
     }
 
     return {
         deal: deal,
         dealer: dealer,
         players: players,
         shoe: shoe,
 
         /** USER ACTIONS */
         cutCard: cutCard,
         bet: bet,
         hit: hit,
         doubleDown: doubleDown,
         stand: stand,
         surrender: surrender,
         insurance: insurance,
 
         /** MOVE TO NEXT PLAYER */
         currentPlayer: currentPlayer,
         toNextPlayer: toNextPlayer
     }
 })();
 
 /** SIMULATION TEST */
 // gamePlay.cutCard(10);
 gamePlay.deal();
 
     // does not update currentPlayer
 // console.log(gamePlay.toNextPlayer());
 
 console.log(gamePlay.dealer);
 console.log(gamePlay.currentPlayer);
 
 gamePlay.bet(25);
 
 // gamePlay.insurance();
 // gamePlay.hit();
 // gamePlay.doubleDown();
 // gamePlay.stand();
 // gamePlay.surrender();
 
 gamePlay.toNextPlayer();
 console.log(gamePlay.currentPlayer);