// Main JavaScript for the website
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('nav ul');
  
  menuToggle.addEventListener('click', function() {
      nav.classList.toggle('show');
  });
  
  // Smooth scrolling for navigation
  document.querySelectorAll('nav a').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
          e.preventDefault();
          
          const targetId = this.getAttribute('href');
          const targetElement = document.querySelector(targetId);
          
          nav.classList.remove('show');
          
          window.scrollTo({
              top: targetElement.offsetTop - 80,
              behavior: 'smooth'
          });
          
          // Update active link
          document.querySelectorAll('nav a').forEach(link => {
              link.classList.remove('active');
          });
          this.classList.add('active');
      });
  });
  
  // Filter vocabulary by category
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(button => {
      button.addEventListener('click', function() {
          // Remove active class from all buttons
          filterButtons.forEach(btn => btn.classList.remove('active'));
          // Add active class to clicked button
          this.classList.add('active');
          
          const category = this.dataset.category;
          filterVocabulary(category);
      });
  });
  
  // Add new vocabulary
  const addVocabForm = document.getElementById('add-vocab-form');
  if (addVocabForm) {
      addVocabForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          const banjarWord = document.getElementById('banjar-word').value;
          const indonesianWord = document.getElementById('indonesian-word').value;
          const category = document.getElementById('vocab-category').value;
          
          // Add to vocabulary list
          addNewVocabularyItem(banjarWord, indonesianWord, category);
          
          // Reset form
          this.reset();
          
          // Show success message
          alert('Kosakata berhasil ditambahkan!');
      });
  }
  
  // Initialize vocabulary
  initializeVocabulary();
});

function filterVocabulary(category) {
  const vocabItems = document.querySelectorAll('.vocab-card');
  
  vocabItems.forEach(item => {
      if (category === 'all' || item.dataset.category === category) {
          item.style.display = 'block';
      } else {
          item.style.display = 'none';
      }
  });
}

function addNewVocabularyItem(banjarWord, indonesianWord, category) {
  const vocabList = document.getElementById('vocabulary-list');
  
  // Create new card
  const vocabCard = document.createElement('div');
  vocabCard.className = 'vocab-card';
  vocabCard.dataset.category = category;
  
  // Get category display name
  let categoryDisplay;
  switch(category) {
      case 'common': categoryDisplay = 'Umum'; break;
      case 'family': categoryDisplay = 'Keluarga'; break;
      case 'food': categoryDisplay = 'Makanan'; break;
      case 'nature': categoryDisplay = 'Alam'; break;
      default: categoryDisplay = 'Umum';
  }
  
  vocabCard.innerHTML = `
      <span class="vocab-category">${categoryDisplay}</span>
      <h3>${banjarWord}</h3>
      <p><strong>Arti:</strong> ${indonesianWord}</p>
  `;
  
  // Add to the beginning of the list
  vocabList.prepend(vocabCard);
  
  // Also add to the vocabulary data for the game
  vocabularyData.push({
      banjar: banjarWord,
      indonesian: indonesianWord,
      category: category
  });
}

function searchVocabulary() {
  const searchInput = document.getElementById('vocab-search').value.toLowerCase();
  const vocabItems = document.querySelectorAll('.vocab-card');
  
  vocabItems.forEach(item => {
      const banjarWord = item.querySelector('h3').textContent.toLowerCase();
      const indonesianWord = item.querySelector('p').textContent.toLowerCase();
      
      if (banjarWord.includes(searchInput) || indonesianWord.includes(searchInput)) {
          item.style.display = 'block';
      } else {
          item.style.display = 'none';
      }
  });
}

// Initialize search functionality
document.getElementById('search-btn').addEventListener('click', searchVocabulary);
document.getElementById('vocab-search').addEventListener('keyup', function(e) {
  if (e.key === 'Enter') {
      searchVocabulary();
  }
});