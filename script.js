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

  const isVisible = oakUI.classList.contains('show');

  oakUI.classList.toggle('show');
  oakUI.classList.toggle('hidden');

  if (!isVisible) {
    professorBtn.classList.add('hidden');
  } else {
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

  oakUI.classList.remove('show');
  oakUI.classList.add('hidden');

  setTimeout(() => {
    professorBtn.classList.remove('hidden');
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

// TESTBEREICH

// Test für suchfunktion

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

function searchPokemon() {
  const input = document.getElementById('oak_search').value.toLowerCase().trim();
  const oakResultBox = document.querySelector('.oak-result-box');
  const oakLabel = document.getElementById('oak_result_label');
  const oakResult = document.getElementById('oak_result');

  if (input === '') {
    oakResultBox.style.display = 'none';
    return;
  }

  const match = allPokemonIndex.find((p) => p.name.startsWith(input));

  oakResultBox.style.display = 'block';

  if (match) {
    oakLabel.textContent = 'Did you mean?';
    oakResult.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <img src="${match.sprite}" style="width: 50px;">
        <span>#${match.id} – ${match.name.toUpperCase()}</span>
      </div>
    `;
  } else {
    oakLabel.textContent = '';
    oakResult.innerHTML = '<span style="opacity: 0.5;">No Pokémon found.</span>';
  }
}

// generation 1 ziehen

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

async function showGenerationPage(genNumber) {
  const outputContainer = document.getElementById('pokemon_output');
  const loadingScreen = document.getElementById('loading-screen');

  const [startId, endId] = generationIdRanges[genNumber];
  const allIds = [];
  for (let i = startId; i <= endId; i++) {
    allIds.push(i);
  }

  const currentPage = currentPagePerGeneration[genNumber];
  const startIndex = currentPage * pokemonPerPage;
  const endIndex = startIndex + pokemonPerPage;

  loadingScreen.classList.remove('hidden');
  outputContainer.innerHTML = '';

  for (let i = startIndex; i < endIndex && i < allIds.length; i++) {
    const pokemonId = allIds[i];
    const pokemonData = await fetchPokemonData(pokemonId);

    const card = document.createElement('div');
    card.classList.add('pokemon-card');
    card.innerHTML = `
      <p class="pokemon-nr">#${pokemonData.id}</p>
      <img src="${pokemonData.sprites.front}" alt="${pokemonData.name}">
      <p class="pokemon-name">${pokemonData.name.toUpperCase()}</p>
    `;

    card.onclick = () => showPokemonCard(pokemonData);

    outputContainer.appendChild(card);

    setTimeout(() => {
      card.classList.add('visible');
    }, 80 * (i - startIndex));
  }

  setTimeout(() => {
    loadingScreen.classList.add('hidden');
  }, 2000);
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

// Background music functionality

const audio = document.getElementById('background-music');
const button = document.getElementById('start_btn');
const volumeSlider = document.getElementById('volume-slider');

audio.volume = 0.0;

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
}

function closePokemonCard() {
  const overlay = document.getElementById('pokemon_overlay');
  const main = document.querySelector('main');

  overlay.classList.add('hidden');
  main.classList.remove('hidden');
}

// TESTAREA

let currentPokemonId = null;

function showPokemonCard(pokemonData) {
  const overlay = document.getElementById('pokemon_overlay');
  const main = document.querySelector('main');
  const card = document.querySelector('.pokemon-detail-card-inner');

  overlay.classList.remove('hidden');
  main.classList.add('hidden');

  const image = pokemonData.sprites.officialArtwork;
  currentPokemonId = pokemonData.id;

  let scaleFactor = 1;
  if (pokemonData.height <= 6) {
    scaleFactor = 1;
  } else if (pokemonData.height <= 10) {
    scaleFactor = 1.3;
  } else if (pokemonData.height <= 15) {
    scaleFactor = 1.6;
  } else if (pokemonData.height <= 20) {
    scaleFactor = 2.3;
  } else {
    scaleFactor = 2.5;
  }

  card.classList.remove('visible'); // Für Übergang

  setTimeout(() => {
    card.innerHTML = `
      <img src="./assets/img/icon/button/close_btn.png" alt="Close Button" class="card-close-btn" onclick="closePokemonCard()">
      <p class="card-id">#${pokemonData.id}</p>
      <p class="card-name">${pokemonData.name.toUpperCase()}</p>
      <img id="cardImage" class="card-image" src="${image}" alt="${
      pokemonData.name
    }" style="transform: scale(${scaleFactor}); transform-origin: center;">
      
      <div id="typeContainer" class="card-types"></div>

      <div class="card-tabs">
        <button class="tab-btn active" id="tab-about">About</button>
        <button class="tab-btn" id="tab-stats">Stats</button>
        <button class="tab-btn" id="tab-abilities">Abilities</button>
      </div>

      <div class="tab-content" id="tab-content"></div>

      <img src="./assets/img/icon/button/left_arrow.png" alt="Back" class="back-btn" id="back_btn">
      <img src="./assets/img/icon/button/right_arrow.png" alt="Next" class="next-btn" id="next_btn">
    `;

    const cardImage = document.getElementById('cardImage');
    cardImage.onload = () => {
      cardImage.classList.add('loaded');
      card.classList.add('visible'); // Sichtbar machen nach Bild-Ladezeit
    };

    // Typen einfügen
    const typeContainer = document.getElementById('typeContainer');
    for (let i = 0; i < pokemonData.typeIcons.length; i++) {
      const typeIcon = document.createElement('img');
      typeIcon.src = pokemonData.typeIcons[i];
      typeIcon.alt = pokemonData.types[i];
      typeIcon.classList.add('type-icon');
      typeContainer.appendChild(typeIcon);
    }

    // NEXT + BACK Buttons
    document.getElementById('next_btn').onclick = async () => {
      if (currentPokemonId < 1025) {
        const nextPokemonData = await fetchPokemonData(currentPokemonId + 1);
        if (nextPokemonData) showPokemonCard(nextPokemonData);
      }
    };

    document.getElementById('back_btn').onclick = async () => {
      if (currentPokemonId > 1) {
        const prevPokemonData = await fetchPokemonData(currentPokemonId - 1);
        if (prevPokemonData) showPokemonCard(prevPokemonData);
      }
    };

    // TAB-NAVIGATION
    const tabContent = document.getElementById('tab-content');
    const tabButtons = document.querySelectorAll('.tab-btn');

    const aboutHTML = `
      <p>Height: ${pokemonData.height / 10} m</p>
      <p>Weight: ${pokemonData.weight / 10} kg</p>
      <p class="about-text">${pokemonData.description}</p>
    `;

    const statsHTML = `
      <p>HP: ${pokemonData.stats.hp}</p>
      <p>Attack: ${pokemonData.stats.attack}</p>
      <p>Defense: ${pokemonData.stats.defense}</p>
      <p>Sp. Atk: ${pokemonData.stats.specialAttack}</p>
      <p>Sp. Def: ${pokemonData.stats.specialDefense}</p>
      <p>Speed: ${pokemonData.stats.speed}</p>
    `;

    const abilitiesHTML = pokemonData.abilities.map((a) => `<p>${a}</p>`).join('');

    function showTab(content) {
      tabContent.innerHTML = content;
    }

    function setActiveTab(id) {
      tabButtons.forEach((btn) => btn.classList.remove('active'));
      document.getElementById(id).classList.add('active');
    }

    document.getElementById('tab-about').addEventListener('click', () => {
      showTab(aboutHTML);
      setActiveTab('tab-about');
    });

    document.getElementById('tab-stats').addEventListener('click', () => {
      showTab(statsHTML);
      setActiveTab('tab-stats');
    });

    document.getElementById('tab-abilities').addEventListener('click', () => {
      showTab(abilitiesHTML);
      setActiveTab('tab-abilities');
    });

    // Standardansicht:
    showTab(aboutHTML);
  }, 200);
}

document.getElementById('pokemon_overlay').addEventListener('click', function (event) {
  const card = document.querySelector('.pokemon-detail-card-inner');
  if (!card.contains(event.target)) {
    closePokemonCard();
  }
});
