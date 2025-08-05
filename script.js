let allPokemon = [];

function init() {
  const header = document.getElementById('hero_header');
  header.classList.add('visible');
  loadAllPokemonIndex();
}

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

let activeGeneration = 1;

function showPokedexGenSection(genNumber) {
  const mainSection = document.getElementById('pokedex_main_section');
  const genSection = document.getElementById('pokedex_gen_section');

  mainSection.classList.remove('show');
  genSection.classList.add('show');

  activeGeneration = genNumber;
  currentPagePerGeneration[genNumber] = 0;
  showGenerationPage(genNumber);
}

function closePokedexGenSection() {
  const mainSection = document.getElementById('pokedex_main_section');
  const genSection = document.getElementById('pokedex_gen_section');

  genSection.classList.remove('show');
  mainSection.classList.add('show');
}

let allPokemonIndex = [];

async function loadAllPokemonIndex() {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1300');
  const data = await response.json();

  allPokemonIndex = data.results.map((pokemon, index) => ({
    name: pokemon.name,
    id: index + 1,
    sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
  }));
}

function getSearchInput() {
  return document.getElementById('oak_search').value.toLowerCase().trim();
}

function renderSearchMessage(message) {
  const oakResult = document.getElementById('oak_result');
  const oakLabel = document.getElementById('oak_result_label');
  oakLabel.textContent = '';
  oakResult.innerHTML = `<span class="oak-msg">${message}</span>`;
}

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

const pokemonPerPage = 20;

function getPokemonIdsForGeneration(genNumber) {
  const [startId, endId] = generationIdRanges[genNumber];
  const ids = [];
  for (let i = startId; i <= endId; i++) ids.push(i);
  return ids;
}

function renderPokemonCard(pokemonData) {
  const card = document.createElement('div');
  card.classList.add('pokemon-card');
  card.innerHTML = `
    <p class="pokemon-nr">#${pokemonData.id}</p>
    <img src="${pokemonData.sprites.front}" alt="${pokemonData.name}">
    <p class="pokemon-name">${pokemonData.name.toUpperCase()}</p>
  `;
  card.onclick = () => showPokemonCard(pokemonData);
  return card;
}

function animateCardAppearance(card, delayIndex) {
  setTimeout(() => {
    card.classList.add('visible');
  }, 80 * delayIndex);
}

function toggleLoadingScreen(show) {
  const loading = document.getElementById('loading-screen');
  loading.classList.toggle('hidden', !show);
}

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

function showNextGenerationPage(genNumber) {
  const [startId, endId] = generationIdRanges[genNumber];
  const totalPokemon = endId - startId + 1;
  const maxPages = Math.ceil(totalPokemon / pokemonPerPage);

  if (currentPagePerGeneration[genNumber] < maxPages - 1) {
    currentPagePerGeneration[genNumber]++;
    showGenerationPage(genNumber);
  }
}

function showPreviousGenerationPage(genNumber) {
  if (currentPagePerGeneration[genNumber] > 0) {
    currentPagePerGeneration[genNumber]--;
    showGenerationPage(genNumber);
  }
}

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

function showPokemonCard() {
  const overlay = document.getElementById('pokemon_overlay');
  const main = document.querySelector('main');

  overlay.classList.remove('hidden');
  main.classList.add('hidden');
  document.body.classList.add('no-scroll');
}

function closePokemonCard() {
  const overlay = document.getElementById('pokemon_overlay');
  const main = document.querySelector('main');

  overlay.classList.add('hidden');
  main.classList.remove('hidden');
  document.body.classList.remove('no-scroll');
}

let currentPokemonId = null;

// --- Hilfsfunktionen ---

function getPokemonIdsForGeneration(genNumber) {
  const [startId, endId] = generationIdRanges[genNumber];
  const ids = [];
  for (let i = startId; i <= endId; i++) ids.push(i);
  return ids;
}

function renderPokemonCard(pokemonData) {
  const card = document.createElement('div');
  card.classList.add('pokemon-card');
  card.innerHTML = `
    <p class="pokemon-nr">#${pokemonData.id}</p>
    <img src="${pokemonData.sprites.front}" alt="${pokemonData.name}">
    <p class="pokemon-name">${pokemonData.name.toUpperCase()}</p>
  `;
  card.onclick = () => showPokemonCard(pokemonData);
  return card;
}

function animateCardAppearance(card, delayIndex) {
  setTimeout(() => {
    card.classList.add('visible');
  }, 80 * delayIndex);
}

function toggleLoadingScreen(show) {
  const loading = document.getElementById('loading-screen');
  loading.classList.toggle('hidden', !show);
}

function calculateScaleFactor(height) {
  if (height <= 6) return 1;
  if (height <= 10) return 1.3;
  if (height <= 15) return 1.6;
  if (height <= 20) return 2.3;
  return 2.5;
}

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

// --- Hauptfunktionen ---

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

document.getElementById('pokemon_overlay').addEventListener('click', function (event) {
  const card = document.querySelector('.pokemon-detail-card-inner');
  if (!card.contains(event.target)) {
    closePokemonCard();
  }
});

document.getElementById('pokemon_overlay').addEventListener('click', function (event) {
  const card = document.querySelector('.pokemon-detail-card-inner');
  if (!card.contains(event.target)) {
    closePokemonCard();
  }
});

function openPokemonFromSearch(id) {
  fetchPokemonData(id).then(function (data) {
    if (data) {
      showPokemonCard(data);
    }
  });
}

function reloadPage() {
  location.reload();
}
