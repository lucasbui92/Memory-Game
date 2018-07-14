/*
 * Create a list that holds all of your cards
 */
var cardList = document.querySelectorAll('.card');

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
var listOfCards = [];
for (var i = 0; i < cardList.length; i++) {
  listOfCards.push(cardList[i]);
}
cardList = shuffle(listOfCards);

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
var timeStart = 0;
var time = 0;
var counter = document.querySelector('.moves');
const mainHeading = document.querySelector('header');
const restartGame = document.querySelector('.restart');

//Increment the counter for each click
function increase_counter() {
  click += 1;
  counter.innerHTML = click;
  return counter.innerHTML;
}

//Remove stars based on performance
function remove_star() {
  const starList = document.querySelector('.stars');
  const a = starList.querySelector('li');
  const stars = starList.querySelector('li > i');

  if (counter.innerHTML == 18) {
    a.remove(stars);
  }
  else if (counter.innerHTML == 26) {
    a.remove(stars);
  }
}

//Reveal the cards
function reveal(card) {
  if (!card.classList.contains('open') || !card.classList.contains('show')) {
    card.classList.add('open', 'show');
    openCards.push(card);
  }
}

//Check if both cards match
function checking(card) {
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
    }, 1000);
  }
}

//Check for the winning condition
function winning(value) {
  var winText = "<p>You Win!!! Your score is " + value + "</p>";
  if (count == cardList.length) {
    /*const modal = document.querySelector('.modal');
    const modalContent = document.createElement('p');
    modalContent.textContent = "You Win";
    modal.style.cssText = 'text-align: center; justify-content: center; align-items: center';
    modal.appendChild(modalContent);*/
    mainHeading.insertAdjacentHTML('afterend', winText);
    const a = document.querySelector('.container > p');
    a.classList.add('winText');
  }
}

//Run the timer
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

//Set up action events for each card
cardList.forEach(function(card) {
  card.addEventListener('click', function(c) {
    var value = increase_counter();
    remove_star();
    reveal(card);
    checking(card);
    winning(value);
    timeStart += 1;
    if (timeStart == 1) {
      count_time();
    }
  });
});

//Restart the game
restartGame.addEventListener('click', function() {
  cardList.forEach(function(card) {
    card.classList.remove('open', 'show', 'match');
  });

  //Reset the counter and the winning count condition
  openCards = [];
  count = 0;
  click = 0;
  counter.innerHTML = 0;

  //Add 3 stars
  const starList = document.querySelector('.stars');
  const stars = starList.querySelectorAll('li');
  if (stars.length == 1) {
    for (var i = 0; i < 2; i++) {
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
  else if (stars.length == 2) {
    const starList = document.querySelector('.stars');
    const newList = document.createElement('li');
    const newStar = document.createElement('i');
    starList.appendChild(newList);
    newList.appendChild(newStar);

    const c = starList.querySelectorAll('li > i');
    for (var j = 0; j < c.length; j++) {
      if (c[j].classList.contains('fa') == false && c[j].classList.contains('fa-star') == false) {
        c[j].classList.add('fa');
        c[j].classList.add('fa-star');
      }
    }
  }

  //Reset the timer
  time = 0;
  document.querySelector('.timer').innerHTML = "0:00:00";

  //Remove the winning message
  var para = document.querySelector('.container');
  var message = para.querySelector('.winText');
  if (message.classList.contains('winText') == true) {
      message.remove();
  }
});
