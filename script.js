/** Global variables and constants for the Pokédex application.
 * This file contains the main application state, including all Pokémon data,
 */
let allPokemon = [];
let allPokemonIndex = [];
let activeGeneration = 1;
let currentPokemonId = null;

/**
 * @description Ranges of Pokémon IDs for each generation.
 * Used to determine which Pokémon belong to which generation.
 */
const generationIdRanges = {
  1: [1, 151],
  2: [152, 251],
  3: [252, 386],
  4: [387, 493],
  5: [494, 649],
  6: [650, 721],
  7: [722, 809],
  8: [810, 905],
  9: [906, 1025],
};

/**
 * @description Keeps track of the current page for each generation.
 * Used for pagination in the Pokédex.
 */
let currentPagePerGeneration = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  7: 0,
  8: 0,
  9: 0,
};

/**
 * @description Number of Pokémon displayed per page in the Pokédex.
 */
const pokemonPerPage = 20;

/**
 * @description Handles audio playback and volume control.
 * @module audioPlayer
 */
const audio = document.getElementById('background-music');
const button = document.getElementById('start_btn');
const volumeSlider = document.getElementById('volume-slider');

audio.volume = 0.2;
audio.loop = true;

button.addEventListener('click', function () {
  audio.play();
});

volumeSlider.addEventListener('input', function () {
  audio.volume = volumeSlider.value;
});

/**
 * @description Initializes the application by loading data and setting up event handlers.
 */
function init() {
  const header = document.getElementById('hero_header');
  header.classList.add('visible');
  loadAllPokemonIndex();
  setupOverlayCloseHandler();
}

/**
 * @description Displays the main content by fading out the header.
 */
function showMainContent() {
  const header = document.getElementById('hero_header');
  const main = document.querySelector('main');
  const body = document.body;

  header.classList.remove('visible');
  header.classList.add('fade-out');

  setTimeout(function () {
    header.style.display = 'none';
    main.classList.remove('hidden');
    body.classList.remove('header-active');

    const fadeElements = document.querySelectorAll('.fade-in');
    for (let i = 0; i < fadeElements.length; i++) {
      fadeElements[i].classList.add('visible');
    }
  }, 1200);
}

/**
 * @description Toggles visibility of the Oak UI and related elements.
 */
function toggleOakUI() {
  const oakUI = document.getElementById('oak_ui_elements');
  const professorBtn = document.getElementById('professor-button');
  const tap_Right = document.getElementById('tap_right');
  const tap_Down = document.getElementById('tap_down');

  const isVisible = oakUI.classList.contains('show');

  oakUI.classList.toggle('show');
  oakUI.classList.toggle('hidden');

  if (!isVisible) {
    tap_Right.classList.add('hidden');
    tap_Down.classList.add('hidden');
    professorBtn.classList.add('hidden');
  } else {
    tap_Right.classList.remove('hidden');
    tap_Down.classList.remove('hidden');
    professorBtn.classList.remove('hidden');
  }
}

/**
 * @description Toggles the monitor section and scrolls into view when shown.
 */
function toggleMonitor() {
  const monitor = document.getElementById('monitor_section');
  const isVisible = monitor.classList.contains('show');

  monitor.classList.toggle('show');

  if (!isVisible) {
    setTimeout(() => {
      monitor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 380);
  }
}

/**
 * @description Closes the Oak UI and resets related buttons.
 */
function closeOakUI() {
  const oakUI = document.getElementById('oak_ui_elements');
  const professorBtn = document.getElementById('professor-button');
  const tap_Right = document.getElementById('tap_right');
  const tap_Down = document.getElementById('tap_down');

  oakUI.classList.remove('show');
  oakUI.classList.add('hidden');

  setTimeout(() => {
    professorBtn.classList.remove('hidden');
    tap_Right.classList.remove('hidden');
    tap_Down.classList.remove('hidden');
  }, 300);
}

/**
 * @description Opens the selected generation's Pokédex section and resets pagination.
 * @param {number} genNumber - Generation number to display.
 */
function showPokedexGenSection(genNumber) {
  const mainSection = document.getElementById('pokedex_main_section');
  const genSection = document.getElementById('pokedex_gen_section');

  mainSection.classList.remove('show');
  genSection.classList.add('show');

  activeGeneration = genNumber;
  currentPagePerGeneration[genNumber] = 0;
  showGenerationPage(genNumber);
}

/**
 * @description Closes the generation view and shows the main Pokédex section.
 */
function closePokedexGenSection() {
  const mainSection = document.getElementById('pokedex_main_section');
  const genSection = document.getElementById('pokedex_gen_section');

  genSection.classList.remove('show');
  mainSection.classList.add('show');
}

/**
 * @description Loads the entire Pokédex index with names, IDs, and sprites.
 * @async
 * @returns {Promise<void>}
 */
async function loadAllPokemonIndex() {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1300');
  const data = await response.json();

  allPokemonIndex = data.results.map((pokemon, index) => ({
    name: pokemon.name,
    id: index + 1,
    sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
  }));
}

/**
 * @description Gets the cleaned value of the search input field.
 * @returns {string} Lowercase trimmed input string.
 */
function getSearchInput() {
  return document.getElementById('oak_search').value.toLowerCase().trim();
}

/**
 * @description Renders a message in the search result area.
 * @param {string} message - Message text to be shown.
 */
function renderSearchMessage(message) {
  const oakResult = document.getElementById('oak_result');
  const oakLabel = document.getElementById('oak_result_label');
  oakLabel.textContent = '';
  oakResult.innerHTML = getSearchMessageHTML(message);
}

/**
 * @description Searches for a Pokémon and shows suggestions or errors.
 */
function searchPokemon() {
  const input = getSearchInput();
  const oakResultBox = document.querySelector('.oak-result-box');
  const oakLabel = document.getElementById('oak_result_label');
  const oakResult = document.getElementById('oak_result');

  oakResult.innerHTML = '';
  oakResultBox.style.display = 'block';

  if (input.length < 3) {
    renderSearchMessage('Please enter at least 3 characters.');
    return;
  }

  const match = allPokemonIndex.find((p) => p.name.toLowerCase().includes(input));

  if (!match) {
    renderSearchMessage('No results found.');
    return;
  }

  oakLabel.textContent = 'Did you mean this Pokémon?';
  oakResult.innerHTML = getPokemonSearchResultHTML(match);
}

/**
 * @description Returns a list of Pokémon IDs for the given generation.
 * @param {number} genNumber - Generation number (1-9).
 * @returns {number[]} List of Pokémon IDs.
 */
function getPokemonIdsForGeneration(genNumber) {
  const [startId, endId] = generationIdRanges[genNumber];
  const ids = [];
  for (let i = startId; i <= endId; i++) ids.push(i);
  return ids;
}

/**
 * @description Creates and returns a rendered Pokémon card element.
 * @param {Object} pokemonData - Data of the Pokémon.
 * @returns {HTMLElement} Rendered Pokémon card.
 */
function renderPokemonCard(pokemonData) {
  const card = document.createElement('div');
  card.classList.add('pokemon-card');
  card.innerHTML = getPokemonCardHTML(pokemonData);
  card.onclick = () => showPokemonCard(pokemonData);
  return card;
}

/**
 * @description Adds fade-in animation to a card with delay.
 * @param {HTMLElement} card - The card element.
 * @param {number} delayIndex - Delay multiplier for appearance.
 */
function animateCardAppearance(card, delayIndex) {
  setTimeout(() => {
    card.classList.add('visible');
  }, 80 * delayIndex);
}

/**
 * @description Toggles visibility of the loading screen.
 * @param {boolean} show - Whether to show or hide the loading screen.
 */
function toggleLoadingScreen(show) {
  const loading = document.getElementById('loading-screen');
  loading.classList.toggle('hidden', !show);
}

/**
 * @description Fetches and displays a paginated list of Pokémon for a generation.
 * @async
 * @param {number} genNumber - Generation number to display.
 * @returns {Promise<void>}
 */
async function showGenerationPage(genNumber) {
  const output = document.getElementById('pokemon_output');
  const ids = getPokemonIdsForGeneration(genNumber);

  const currentPage = currentPagePerGeneration[genNumber];
  const startIndex = currentPage * pokemonPerPage;
  const endIndex = startIndex + pokemonPerPage;

  toggleLoadingScreen(true);
  output.innerHTML = '';

  for (let i = startIndex; i < endIndex && i < ids.length; i++) {
    const pokemon = await fetchPokemonData(ids[i]);
    const card = renderPokemonCard(pokemon);
    output.appendChild(card);
    animateCardAppearance(card, i - startIndex);
  }

  setTimeout(() => toggleLoadingScreen(false), 2000);
}

/**
 * @description Navigates to the next Pokémon page in the current generation.
 * @param {number} genNumber - Current generation number.
 */
function showNextGenerationPage(genNumber) {
  const [startId, endId] = generationIdRanges[genNumber];
  const totalPokemon = endId - startId + 1;
  const maxPages = Math.ceil(totalPokemon / pokemonPerPage);

  if (currentPagePerGeneration[genNumber] < maxPages - 1) {
    currentPagePerGeneration[genNumber]++;
    showGenerationPage(genNumber);
  }
}

/**
 * @description Navigates to the previous Pokémon page in the current generation.
 * @param {number} genNumber - Current generation number.
 */
function showPreviousGenerationPage(genNumber) {
  if (currentPagePerGeneration[genNumber] > 0) {
    currentPagePerGeneration[genNumber]--;
    showGenerationPage(genNumber);
  }
}

/**
 * @description Opens the Pokémon detail overlay and hides the main content.
 * @param {Object} pokemonData - Data of the Pokémon to display.
 */
function showPokemonCard() {
  const overlay = document.getElementById('pokemon_overlay');
  const main = document.querySelector('main');

  overlay.classList.remove('hidden');
  main.classList.add('hidden');
  document.body.classList.add('no-scroll');
}

/**
 * @description Closes the Pokémon detail overlay and restores main content.
 */
function closePokemonCard() {
  const overlay = document.getElementById('pokemon_overlay');
  const main = document.querySelector('main');

  overlay.classList.add('hidden');
  main.classList.remove('hidden');
  document.body.classList.remove('no-scroll');
}

/**
 * @description Gets a list of Pokémon IDs for a specific generation.
 * @param {number} genNumber - Generation number.
 * @returns {Array<number>} List of Pokémon IDs.
 */
function getPokemonIdsForGeneration(genNumber) {
  const [startId, endId] = generationIdRanges[genNumber];
  const ids = [];
  for (let i = startId; i <= endId; i++) ids.push(i);
  return ids;
}

/**
 * @description Creates the HTML structure for a Pokémon detail card.
 */
function renderPokemonCard(pokemonData) {
  const card = document.createElement('div');
  card.classList.add('pokemon-card');
  card.innerHTML = getPokemonCardHTML(pokemonData);
  card.onclick = () => showPokemonCard(pokemonData);
  return card;
}

/**
 * @description Animates the appearance of a Pokémon card.
 */
function animateCardAppearance(card, delayIndex) {
  setTimeout(() => {
    card.classList.add('visible');
  }, 80 * delayIndex);
}

/**
 * @description Toggles the visibility of the loading screen.
 * @param {boolean} show - Whether to show or hide the loading screen.
 */
function toggleLoadingScreen(show) {
  const loading = document.getElementById('loading-screen');
  loading.classList.toggle('hidden', !show);
}

/**
 * @description Calculates scale factor for Pokémon image based on height.
 * @param {number} height - Height of the Pokémon in decimeters.
 * @returns {number} Calculated scale factor.
 */
function calculateScaleFactor(height) {
  if (height <= 6) return 1;
  if (height <= 10) return 1.3;
  if (height <= 15) return 1.6;
  if (height <= 20) return 2.3;
  return 2.5;
}

/**
 * @description Sets up next/previous navigation inside the detail card.
 */
function setupCardNavigation() {
  document.getElementById('next_btn').onclick = async () => {
    if (currentPokemonId < 1025) {
      const next = await fetchPokemonData(currentPokemonId + 1);
      if (next) showPokemonCard(next);
    }
  };

  document.getElementById('back_btn').onclick = async () => {
    if (currentPokemonId > 1) {
      const prev = await fetchPokemonData(currentPokemonId - 1);
      if (prev) showPokemonCard(prev);
    }
  };
}

/**
 * @description Sets up tab navigation between 'About' and 'Stats'.
 */
function setupTabNavigation() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabSections = document.querySelectorAll('.tab-section');

  function showTab(tabId) {
    tabSections.forEach((section) => section.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
  }

  function setActiveTab(buttonId) {
    tabButtons.forEach((btn) => btn.classList.remove('active'));
    document.getElementById(buttonId).classList.add('active');
  }

  document.getElementById('tab-about').addEventListener('click', () => {
    showTab('about-section');
    setActiveTab('tab-about');
  });

  document.getElementById('tab-stats').addEventListener('click', () => {
    showTab('stats-section');
    setActiveTab('tab-stats');
  });

  showTab('about-section');
  setActiveTab('tab-about');
}

/**
 * @description Displays the Pokémon for a specific generation.
 * @param {number} genNumber - The generation number.
 */
async function showGenerationPage(genNumber) {
  const output = document.getElementById('pokemon_output');
  const ids = getPokemonIdsForGeneration(genNumber);

  const currentPage = currentPagePerGeneration[genNumber];
  const startIndex = currentPage * pokemonPerPage;
  const endIndex = startIndex + pokemonPerPage;

  toggleLoadingScreen(true);
  output.innerHTML = '';

  for (let i = startIndex; i < endIndex && i < ids.length; i++) {
    const pokemon = await fetchPokemonData(ids[i]);
    const card = renderPokemonCard(pokemon);
    output.appendChild(card);
    animateCardAppearance(card, i - startIndex);
  }

  setTimeout(() => toggleLoadingScreen(false), 2000);
}

/**
 * @description Creates the HTML for a Pokémon detail card.
 * @param {Object} pokemonData - Data of the Pokémon.
 * @param {string} image - URL of the Pokémon's image.
 * @param {number} scaleFactor - Scale factor for the image.
 * @returns {string} HTML string for the Pokémon detail card.
 */
function createPokemonCardHTML(pokemonData, image, scaleFactor) {
  return `
    <div class="pokemon-detail-card" style="transform: scale(${scaleFactor})">
      <img id="cardImage" src="${image}" alt="${pokemonData.name}" />
      <h2>${pokemonData.name}</h2>
      <p>Height: ${pokemonData.height} dm</p>
      <p>Weight: ${pokemonData.weight} hg</p>
      <div class="pokemon-types">
        ${pokemonData.types.map((type) => `<span class="type ${type}">${type}</span>`).join('')}
      </div>
    </div>
  `;
}

/**
 * @description Displays the Pokémon detail card in an overlay.
 * @param {Object} pokemonData - Data of the Pokémon.
 */
function showPokemonCard(pokemonData) {
  const overlay = document.getElementById('pokemon_overlay');
  const main = document.querySelector('main');
  const card = document.querySelector('.pokemon-detail-card-inner');

  overlay.classList.remove('hidden');
  main.classList.add('hidden');

  const image = pokemonData.sprites.officialArtwork;
  currentPokemonId = pokemonData.id;
  const scaleFactor = calculateScaleFactor(pokemonData.height);

  card.classList.remove('visible');

  setTimeout(() => {
    card.innerHTML = createPokemonCardHTML(pokemonData, image, scaleFactor);

    const cardImage = document.getElementById('cardImage');
    cardImage.onload = () => {
      cardImage.classList.add('loaded');
      card.classList.add('visible');
    };

    setupCardNavigation();
    setupTabNavigation();
  }, 200);
}

/**
 * @description Closes the overlay when user clicks outside the card.
 */
function setupOverlayCloseHandler() {
  document.getElementById('pokemon_overlay').addEventListener('click', function (event) {
    const card = document.querySelector('.pokemon-detail-card-inner');
    if (!card.contains(event.target)) {
      closePokemonCard();
    }
  });
}

/**
 * @description Fetches Pokémon data by ID and opens the detail overlay.
 * @async
 * @param {number} id - ID of the Pokémon to fetch.
 * @returns {Promise<void>}
 */
async function openPokemonFromSearch(id) {
  const data = await fetchPokemonData(id);
  if (data) showPokemonCard(data);
}

/**
 * @description Reloads the entire page.
 */
function reloadPage() {
  location.reload();
}
