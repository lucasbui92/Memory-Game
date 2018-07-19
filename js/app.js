/*
 * Create a list that holds all of your cards
 */
var cardList = document.querySelectorAll('.card');
var deckList = document.querySelector('.deck');
var cardValue = deckList.querySelectorAll('.fa');

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
var deck = ["fa-diamond", "fa-diamond", "fa-paper-plane-o", "fa-paper-plane-o", "fa-anchor", "fa-anchor",
           "fa-bolt", "fa-bolt", "fa-cube", "fa-cube", "fa-leaf", "fa-leaf",
           "fa-bicycle", "fa-bicycle", "fa-bomb", "fa-bomb"];

function cards_shuffling() {
  deck = shuffle(deck);
  for (var i = 0; i < cardValue.length; i++) {
    const cardImage = cardValue[i].classList;
    cardValue[i].classList.remove(cardImage[1]);
    cardValue[i].classList.add(deck[i]);
  }
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
var openCards = [];
var count = 0;
var click = 0;
var moves = 0;
var timeStart = 0;
var time = 0;
var counter = document.querySelector('.moves');
const restartGame = document.querySelector('.restart');
cards_shuffling()


/*
 * Increment the counter for each click
 */
function increase_counter(click) {
  if (click % 2 == 0) {
    moves += 1
    counter.innerHTML = moves;
  }
  return counter.innerHTML;
}

/*
 * Remove stars based on performance
 */
function remove_star() {
  const starList = document.querySelector('.stars');
  const a = starList.querySelector('li');
  const stars = starList.querySelector('li > i');

  if (counter.innerHTML == 18 || counter.innerHTML == 26) {
    a.remove(stars);
  }
}

/*
 * Check if both cards match
 */
function reveal_check(card) {
  if (!card.classList.contains('open') || !card.classList.contains('show')) {
    card.classList.add('open', 'show');
    openCards.push(card);
  }

  if (openCards.length == 2) {
    if (openCards[0].innerHTML == openCards[1].innerHTML) {
      openCards.forEach(function(card) {
        card.classList.add('match');
        count += 1;
      });
    }
    setTimeout(function() {
      openCards.forEach(function(card) {
        card.classList.remove('open', 'show');
      });
      openCards = [];
    }, 500);
  }
}

/*
 * Run the timer
 */
function count_time() {
  setTimeout(function() {
    time += 1;
    var mins = Math.floor(time/10/60);
    var secs = Math.floor(time/10%60);
    var hours = Math.floor(time/10/60/60);
    if (mins < 10) {
      mins = '0' + mins;
    }
    if (secs < 10) {
      secs = '0' + secs;
    }
    document.querySelector('.timer').innerHTML = hours + ":" + mins + ":" + secs;
    if (count != cardList.length) {
      count_time();
    }
  }, 100);
}

/*
 * Add stars back to the game
 */
function addingStars(starList, stars) {
  for (var i = 3; stars.length < i; i--) {
    const starList = document.querySelector('.stars');
    const newList = document.createElement('li');
    const newStar = document.createElement('i');
    starList.appendChild(newList);
    newList.appendChild(newStar);
  }

  const c = starList.querySelectorAll('li > i');
  for (var j = 0; j < c.length; j++) {
    if (c[j].classList.contains('fa') == false && c[j].classList.contains('fa-star') == false) {
      c[j].classList.add('fa');
      c[j].classList.add('fa-star');
    }
  }
}

function showModal() {
  const winModal = document.querySelector('.modal');
  winModal.style.display = 'block';
}

function closeModal() {
  const winModal = document.querySelector('.modal');
  winModal.style.display = 'none';
}

/*
 * Reset all values for the game
 */
function reset() {
  cardList.forEach(function(card) {
    card.classList.remove('open', 'show', 'match');
  });

  cards_shuffling();
  openCards = [];
  count = 0;
  click = 0;
  moves = 0;
  counter.innerHTML = 0;

  //Add until the game has 3 stars
  const starList = document.querySelector('.stars');
  const stars = starList.querySelectorAll('li');
  if (stars.length < 3) {
    addingStars(starList, stars);
  }

  //Reset the timer
  time = 0;
  timeStart = 0;
  document.querySelector('.timer').innerHTML = "0:00:00";

  //Remove the winning message
  const modalBox = document.querySelectorAll('.modal-content > p');
  for (var i = 0; i < modalBox.length; i++) {
    modalBox[i].remove();
  }
}

/*
 * Check for the winning condition
 */
function winning(value) {
  const stars = document.querySelectorAll('.stars > li');
  const time = document.querySelector('.timer').innerHTML;
  const closeButton = document.querySelector('.close');
  const playAgain = document.querySelector('.play-again');

  var winText = "<p>YOU WON!! The number of moves taken is " + value
  + ". The total time taken is " + time + ". Your star rating is "
  + stars.length + ".</p>";

  if (count == cardList.length) {
    showModal();
    closeButton.insertAdjacentHTML('afterend', winText);
  }
  playAgain.addEventListener('click', function() {
    reset();
    closeModal();
  });
  closeButton.addEventListener('click', function() {
    closeModal();
  });
}

/*
 * Set up action events for each card
 */
cardList.forEach(function(card) {
  card.addEventListener('click', function(c) {
    click += 1;
    var value = increase_counter(click);
    remove_star();
    reveal_check(card);
    winning(value);
    timeStart += 1;
    if (timeStart == 1) {
      count_time();
    }
  });
});

/*
 * Restart the game
 */
restartGame.addEventListener('click', function() {
  reset();
});
