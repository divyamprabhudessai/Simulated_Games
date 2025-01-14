const images = [
    "Assets/cheeseburger.png",
    "Assets/fries.png",
    "Assets/hotdog.png",
    "Assets/ice-cream.png",
    "Assets/milkshake.png",
    "Assets/pizza.png",
    
  ];
  
  const blankImage = "Assets/blank.png";
  const whiteImage = "Assets/whitee.png";
  
  const cardGrid = document.getElementById("card-grid");
  const startGameButton = document.getElementById("start-game");
  const winMessage = document.getElementById("win-message");
  const scoreElement = document.createElement("p"); // Create a score element
  scoreElement.textContent = "Score: 0";
  scoreElement.id = "score";
  document.querySelector(".game-container").insertBefore(scoreElement, cardGrid);
  
  let cards = [];
  let flippedCards = [];
  let matchedPairs = 0;
  let score = 0;
  
  // Initialize the game
  function shuffleCards() {
    const doubledImages = [...images, ...images];
    return doubledImages
      .sort(() => Math.random() - 0.5)
      .map((image, index) => ({
        id: index,
        image,
        matched: false,
      }));
  }
  
  // Render the cards
  function renderCards(cards) {
    cardGrid.innerHTML = "";
    cards.forEach((card) => {
      const cardElement = document.createElement("div");
      cardElement.classList.add("card");
      cardElement.dataset.id = card.id;
  
      cardElement.innerHTML = `
        <div class="front"><img src="${blankImage}" alt="Blank Card"></div>
        <div class="back"><img src="${card.image}" alt="Card Image"></div>
      `;
  
      cardElement.addEventListener("click", () =>
        handleCardClick(card, cardElement)
      );
      cardGrid.appendChild(cardElement);
    });
  }
  
  // Handle card click
  function handleCardClick(card, cardElement) {
    if (
      flippedCards.length === 2 ||
      card.matched ||
      flippedCards.includes(card)
    ) {
      return;
    }
  
    cardElement.classList.add("flipped");
    flippedCards.push(card);
  
    if (flippedCards.length === 2) {
      setTimeout(checkForMatch, 1000);
    }
  }
  
  // Check for matches
  function checkForMatch() {
    const [card1, card2] = flippedCards;
  
    if (card1.image === card2.image) {
      card1.matched = true;
      card2.matched = true;
      matchedPairs++;
      score += 10;
      updateScore();
  
      document.querySelectorAll(".flipped").forEach((cardElement) => {
        cardElement.classList.add("matched");
        cardElement.classList.remove("flipped");
        cardElement.querySelector(".front img").src = whiteImage; // Change to white.png
      });
    } else {
      document.querySelectorAll(".flipped").forEach((cardElement) => {
        cardElement.classList.remove("flipped");
      });
    }
  
    flippedCards = [];
  
    // Check win condition
    if (matchedPairs === images.length) {
      winMessage.classList.remove("hidden");
    }
  }
  
  // Update score
  function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
  }
  
  // Start game
  function startGame() {
    winMessage.classList.add("hidden");
    matchedPairs = 0;
    score = 0;
    updateScore();
    cards = shuffleCards();
    renderCards(cards);
  }
  
  startGameButton.addEventListener("click", startGame);