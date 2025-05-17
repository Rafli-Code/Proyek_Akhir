// Memory Game for Banjar Language
let gameState = {
  score: 0,
  level: 1,
  flippedCards: [],
  matchedPairs: 0,
  totalPairs: 0,
  canFlip: true
};

document.addEventListener('DOMContentLoaded', function() {
  const startButton = document.getElementById('start-game');
  const playAgainButton = document.getElementById('play-again');
  
  if (startButton) {
      startButton.addEventListener('click', startGame);
  }
  
  if (playAgainButton) {
      playAgainButton.addEventListener('click', resetGame);
  }
});

function startGame() {
  const gameBoard = document.getElementById('game-board');
  gameBoard.innerHTML = '';
  
  // Determine number of pairs based on level
  const pairsCount = 4 + (gameState.level - 1) * 2;
  gameState.totalPairs = pairsCount;
  gameState.matchedPairs = 0;
  gameState.flippedCards = [];
  
  // Select random vocabulary for the game
  const gameVocabulary = getRandomVocabulary(pairsCount);
  
  // Create cards
  const cards = [];
  gameVocabulary.forEach(item => {
      cards.push({
          type: 'banjar',
          content: item.banjar,
          pairId: item.banjar
      });
      cards.push({
          type: 'indonesian',
          content: item.indonesian,
          pairId: item.banjar
      });
  });
  
  // Shuffle cards
  shuffleArray(cards);
  
  // Display cards
  cards.forEach((card, index) => {
      const cardElement = document.createElement('div');
      cardElement.className = 'game-card';
      cardElement.dataset.index = index;
      cardElement.dataset.pairId = card.pairId;
      cardElement.dataset.type = card.type;
      cardElement.textContent = '?';
      
      cardElement.addEventListener('click', () => flipCard(cardElement));
      gameBoard.appendChild(cardElement);
  });
  
  // Update game info
  updateGameInfo();
  
  // Hide start button and result
  document.getElementById('start-game').style.display = 'none';
  document.getElementById('game-result').classList.add('hidden');
}

function flipCard(cardElement) {
  // If already flipped or matched, or already 2 cards flipped, or game not ready
  if (cardElement.classList.contains('flipped') || 
      cardElement.classList.contains('matched') || 
      gameState.flippedCards.length >= 2 || 
      !gameState.canFlip) {
      return;
  }
  
  // Flip the card
  cardElement.classList.add('flipped');
  cardElement.textContent = cardElement.dataset.type === 'banjar' 
      ? vocabularyData.find(v => v.banjar === cardElement.dataset.pairId).banjar
      : vocabularyData.find(v => v.banjar === cardElement.dataset.pairId).indonesian;
  
  // Add to flipped cards
  gameState.flippedCards.push(cardElement);
  
  // Check for match if 2 cards are flipped
  if (gameState.flippedCards.length === 2) {
      checkForMatch();
  }
}

function checkForMatch() {
  const [card1, card2] = gameState.flippedCards;
  
  // Disable flipping while checking
  gameState.canFlip = false;
  
  if (card1.dataset.pairId === card2.dataset.pairId && card1.dataset.type !== card2.dataset.type) {
      // Match found
      setTimeout(() => {
          card1.classList.add('matched');
          card2.classList.add('matched');
          gameState.flippedCards = [];
          gameState.score += 10 * gameState.level;
          gameState.matchedPairs++;
          gameState.canFlip = true;
          updateGameInfo();
          
          // Check if all pairs matched
          if (gameState.matchedPairs === gameState.totalPairs) {
              endGame();
          }
      }, 500);
  } else {
      // No match
      setTimeout(() => {
          card1.classList.remove('flipped');
          card2.classList.remove('flipped');
          card1.textContent = '?';
          card2.textContent = '?';
          gameState.flippedCards = [];
          gameState.canFlip = true;
          
          // Penalize for wrong match
          gameState.score = Math.max(0, gameState.score - 2);
          updateGameInfo();
      }, 1000);
  }
}

function endGame() {
  // Show result
  const resultElement = document.getElementById('game-result');
  document.getElementById('final-score').textContent = Skor akhir: ${gameState.score};
  resultElement.classList.remove('hidden');
  
  // Level up if score is good
  if (gameState.score >= gameState.level * 30) {
      gameState.level++;
  }
}

function resetGame() {
  gameState.score = 0;
  updateGameInfo();
  document.getElementById('game-result').classList.add('hidden');
  document.getElementById('start-game').style.display = 'block';
}

function updateGameInfo() {
  document.getElementById('score').textContent = gameState.score;
  document.getElementById('level').textContent = gameState.level;
}

function getRandomVocabulary(count) {
  // Make sure we don't request more items than available
  const actualCount = Math.min(count, vocabularyData.length);
  
  // Shuffle and take the first 'actualCount' items
  const shuffled = [...vocabularyData].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, actualCount);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}