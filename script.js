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

function showPokedexGenSection(genNumber) {
  const mainSection = document.getElementById('pokedex_main_section');
  const genSection = document.getElementById('pokedex_gen_section');

  mainSection.classList.remove('show');
  genSection.classList.add('show');

  if (genNumber === 1) {
    currentGenerationPage = 0;
    showGenerationOnePage();
  }
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

// IDs der ersten Generation (1 bis 151)
const generationOneIds = [];
for (let i = 1; i <= 151; i++) {
  generationOneIds.push(i);
}

let currentGenerationPage = 0;
const pokemonPerPage = 20;

async function showGenerationOnePage() {
  const outputContainer = document.getElementById('pokemon_output');
  const loadingScreen = document.getElementById('loading-screen');

  loadingScreen.classList.remove('hidden');

  outputContainer.innerHTML = '';

  const startIndex = currentGenerationPage * pokemonPerPage;
  const endIndex = startIndex + pokemonPerPage;

  for (let i = startIndex; i < endIndex && i < generationOneIds.length; i++) {
    const pokemonId = generationOneIds[i];
    const pokemonData = await fetchPokemonData(pokemonId);

    const card = document.createElement('div');
    card.classList.add('pokemon-card');
    card.innerHTML = `
      <p class="pokemon-nr">#${pokemonData.id}</p>
      <img src="${pokemonData.sprites.front}" alt="${pokemonData.name}">
      <p class="pokemon-name">${pokemonData.name.toUpperCase()}</p>
    `;

    outputContainer.appendChild(card);

    setTimeout(() => {
      card.classList.add('visible');
    }, 80 * (i - startIndex));
  }

  setTimeout(() => {
    loadingScreen.classList.add('hidden');
  }, 2000);
}

function showNextGenerationOnePage() {
  const maxPages = Math.ceil(generationOneIds.length / pokemonPerPage);
  if (currentGenerationPage < maxPages - 1) {
    currentGenerationPage++;
    showGenerationOnePage();
  }
}

function showPreviousGenerationOnePage() {
  if (currentGenerationPage > 0) {
    currentGenerationPage--;
    showGenerationOnePage();
  }
}
