/**
 * @description loads Pokémon data from the PokeAPI.
 * @param {number} id - The ID of the Pokémon to fetch.
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
 * @description Gets the Pokémon IDs for a specific generation.
 * @param {number} genNumber - The generation number.
 * @returns {number[]} An array of Pokémon IDs for the specified generation.
 */
function getPokemonIdsForGeneration(genNumber) {
  const [startId, endId] = generationIdRanges[genNumber];
  const ids = [];
  for (let i = startId; i <= endId; i++) ids.push(i);
  return ids;
}

/**
 * @description Renders a Pokémon card element.
 * @param {*} pokemonData - The data of the Pokémon to render.
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
 * @param {HTMLElement} card - The Pokémon card element to animate.
 * @param {number} delayIndex - The index used to calculate the animation delay.
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
 * @description Calculates the scale factor for a Pokémon card based on its height.
 * @param {number} height - The height of the Pokémon.
 * @returns {number} The scale factor to apply.
 */
function calculateScaleFactor(height) {
  if (height <= 6) return 1;
  if (height <= 10) return 1.3;
  if (height <= 15) return 1.6;
  if (height <= 20) return 2.3;
  return 2.5;
}

/**
 * @description Shows the Pokédex generation section.
 * @param {*} genNumber
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
 * @description closes the Pokédex generation section.
 * This function is called when the user clicks the close button in the generation section.
 */
function closePokedexGenSection() {
  const mainSection = document.getElementById('pokedex_main_section');
  const genSection = document.getElementById('pokedex_gen_section');

  genSection.classList.remove('show');
  mainSection.classList.add('show');
}

/**
 * @description Shows the Pokémon cards for a specific generation.
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
 * @description Shows the next page of Pokémon cards for a specific generation.
 * @param {number} genNumber - The generation number.
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
 * @description Shows the previous page of Pokémon cards for a specific generation.
 * @param {number} genNumber - The generation number.
 */
function showPreviousGenerationPage(genNumber) {
  if (currentPagePerGeneration[genNumber] > 0) {
    currentPagePerGeneration[genNumber]--;
    showGenerationPage(genNumber);
  }
}

/**
 * @description Prepares the UI for the Pokémon card overlay.
 * Hides the main content and shows the overlay.
 */
function prepareOverlayUI() {
  const overlay = document.getElementById('pokemon_overlay');
  const main = document.querySelector('main');
  overlay.classList.remove('hidden');
  main.classList.add('hidden');
  document.body.classList.add('no-scroll');
}

/**
 * @description Shows the Pokémon card for a specific Pokémon.
 * @param {Object} pokemonData - The data for the Pokémon to display.
 */
function showPokemonCard(pokemonData) {
  prepareOverlayUI();
  const card = document.querySelector('.pokemon-detail-card-inner');
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
 * @description Closes the Pokémon card overlay.
 */
function closePokemonCard() {
  const overlay = document.getElementById('pokemon_overlay');
  const main = document.querySelector('main');

  overlay.classList.add('hidden');
  main.classList.remove('hidden');
  document.body.classList.remove('no-scroll');
}

/**
 * @description Sets up the navigation for the Pokémon card overlay.
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
 * @description Sets up the tab navigation for the Pokémon card overlay.
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
 * @description Sets up the event handler for closing the Pokémon card overlay.
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
 * @description Opens a Pokémon card from the search results.
 * @param {number} id - The ID of the Pokémon to open.
 */
async function openPokemonFromSearch(id) {
  const data = await fetchPokemonData(id);
  if (data) showPokemonCard(data);
}

/**
 * @description Gets the search input value from the Oak UI.
 * @returns {string} The trimmed search input value.
 */
function getSearchInput() {
  return document.getElementById('oak_search').value.toLowerCase().trim();
}

/**
 * @description Renders a message in the Oak UI when no results are found or when the input is invalid.
 * @param {string} message - The message to display.
 */
function renderSearchMessage(message) {
  const oakResult = document.getElementById('oak_result');
  const oakLabel = document.getElementById('oak_result_label');
  oakLabel.textContent = '';
  oakResult.innerHTML = getSearchMessageHTML(message);
}

/**
 * @description Searches for a Pokémon by name.
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
