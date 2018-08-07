var inquirer = require("inquirer");

/**
 * USER ACTIONS: cutCard, bet, deal hit, stand, doubleDown, insurance, surrender
 * GAME ACTIONS: burnCard, blackjack, bust, push, pair, upcard
 * OTHER PROPERTIES: bettingLimit
 */

// bug: calculateValue() - for Ace
 
 
var playerSetup = require('./player.js');
var cardSetup = require('./card.js');

var GamePlay = (function () {

    /** SETUP SHOE OF DECKS */
    var shoe = cardSetup.shoe;
    cardSetup.shuffleDecks();

    /** SETUP DEALER AND PLAYERS */
    var dealer = playerSetup.dealer,
        players = playerSetup.players;
    playerSetup.addPlayer("Sean",1000);
    playerSetup.addPlayer("James",1000);

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
                // playerSetup.players[j].handValue = 21; // for testing 
            }
            var dealtCardtoDealer = cardSetup.shoe.shift();
            
        //  comment the below and test
            playerSetup.dealer.handArea.push(dealtCardtoDealer);
            playerSetup.dealer.handValue += calculateCardValue(dealtCardtoDealer);
            // playerSetup.dealer.handValue = 21; // for testing 

        //  calculateCardValue does not work (asyncronous)
        //  uncomment the below and test
            // playerSetup.dealer.handArea.push([0,0]);
            // playerSetup.dealer.handValue += calculateCardValue([0,0]);
            // console.log(playerSetup.dealer.handValue);
        }
    }
     
    var resetPlayerStatus = function () {
        if (currentPlayer !== dealer) {
            currentPlayer.betAmount = 0;
            currentPlayer.handArea = [];
            currentPlayer.handValue = 0;
        }
    }
 
    /** USER ACTIONS */
    /** BEFORE DEAL ACTIONS: cutCard, bet */
    var cutCard = function (num) {
        cardSetup.shoe = cardSetup.shoe.concat(cardSetup.shoe.splice(0, num));
    }
    var bet = function (amt) {
        currentPlayer.budget -= amt;
        currentPlayer.betAmount = amt;
        if (current < players.length - 1) {
            current += 1;
            currentPlayer = players[current];
        } else {
            current = 0;
            currentPlayer = players[current];
        }
    }

    /** AFTER DEAL ACTIONS: hit, doubleDown, stand, insurance, surrender */
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
    //  console.log(currentPlayer);
        if (current < players.length - 1) {
            console.log("current",current);
            console.log("players.length", players.length);
            current += 1;
            currentPlayer = players[current];
        } 
        else {
            currentPlayer = dealer;
        }
    //  console.log(currentPlayer);
        return currentPlayer;
    }

    var optionWithInsurance = {
        name: "select", type: "list", message: "OPTIONS:",
        choices: [ "HIT", "DOUBLEDOWN", "STAND", "INSURANCE", "SURRENDER" ]
    }
    var optionWithDoubleDownNoinsurance = {
        name: "select", type: "list", message: "OPTIONS:",
        choices: [ "HIT", "DOUBLEDOWN", "STAND", "SURRENDER" ]
    }
    var optionRegular = {
        name: "select", type: "list", message: "OPTIONS:",
        choices: [ "HIT", "STAND", "SURRENDER" ]
    }
    var play = function () {
        if (currentPlayer.handArea.length === 2) {
            /** PLAYER ACTIONS RIGHT AFTER DEAL */

            if (currentPlayer.handValue === 21 && dealer.handValue !== 21) {
                /** BLACKJACK */

                currentPlayer.budget += currentPlayer.betAmount * 2.5;
                resetPlayerStatus();

            } else if (dealer.handArea[0][1] === 0) {
                /** IF DEALER'S FACECARD === ACE, OPTION INCLUDES INSURANCE */

                inquirer.prompt(
                    optionWithInsurance
                ).then( function(response) {
                    console.log(response.select);
                });
            } else {
                /** OPTION INCLUDES DOUBLEDOWN */

                inquirer.prompt(
                    optionWithDoubleDownNoinsurance
                ).then( function(response) {
                    console.log(response.select);
                });
            }
        } else {
            /** PLAYER ACTIONS AFTER FIRST ACTION */
            inquirer.prompt(
                optionRegular
            ).then( function(response) {
                console.log(response.select);
            });
        }

        if (currentPlayer.handValue > 21) {
            /** PLAYER BUST */
            resetPlayerStatus();
            toNextPlayer();
        } else {
            play();
        }
    }
    var action = function (response) {
        switch (response) {
            case "HIT":
                hit();
                break;
            case "STAND":
                stand();
                break;
            case "DOUBLEDOWN":
                doubleDown();
                break;
            case "SURRENDER":
                surrender();
                break;
            case "INSURANCE":
                insurance();
                break;
        }
    }
    
    return {
        init: function () {
            /** FIRST USER GET TO CUT CARDS */
            cutCard(30);

            /** PLAYERS BET BEFORE DEAL */
            // temporarily using for loop to automate the bet
            for (var i = 0; i < players.length; i++) {
                bet(50);
            }

            /** DEAL 2 CARDS TO THE EACH PLAYERS & THE DEALER */
            deal();

            console.log(players);
            console.log(dealer);
            console.log("\n");

            // play();

            
            // console.log(players);


            /** TESTING FOR CURRENT PLAYER */
            // console.log(currentPlayer);
            // toNextPlayer();
            // console.log(currentPlayer);
            // toNextPlayer();
            // console.log(currentPlayer);
            /** */
        }
    }
 })();
 

GamePlay.init();




//  /** SIMULATION TEST */
//  // gamePlay.cutCard(10);
//  gamePlay.deal();
 
//      // does not update currentPlayer
//  // console.log(gamePlay.toNextPlayer());
 
//  console.log(gamePlay.dealer);
// //  console.log(gamePlay.currentPlayer);
 
//  gamePlay.bet(25);
 
//  // gamePlay.insurance();
//  // gamePlay.hit();
//  // gamePlay.doubleDown();
//  // gamePlay.stand();
//  // gamePlay.surrender();
 
//  gamePlay.toNextPlayer();
// //  console.log(gamePlay.toNextPlayer());
//  console.log(gamePlay.currentPlayer);