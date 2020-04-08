// //function makeDeck() {
// const deck = [];
// const suits = ['hearts', 'diamonds', ' spades', 'clubs'];
// const values = '2,3,4,5,6,7,8,9,10,J,Q,K,A';
// for (let val of values.split(',')) {
//     for (let suit of suits) {
//         deck.push({ val, suit });
//     }
// }
//     //return deck;
// }

// //function drawCard(deck) {
// return deck.pop();
// //}

// //const myDeck = makeDeck();

// //const card1 = drawCard(myDeck);

const myDeck = {
  deck: [],
  drawnCards: [],
  suits: ["hearts", "diamonds", " spades", "clubs"],
  values: "2,3,4,5,6,7,8,9,10,J,Q,K,A",
  intializeDeck() {
    const { suits, values, deck } = this;
    for (let val of values.split(",")) {
      for (let suit of suits) {
        deck.push({ val, suit });
      }
    }
  },
  drawCard() {
    const card = this.deck.pop();
    this.drawnCards.push(card);
    return card;
  },
  drawMultiple(numCards) {
    const cards = [];
    for (let i = 0; i < numCards; i++) {
      cards.push(this.drawCard());
    }
    return cards;
  },
  shuffle() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  },
};
