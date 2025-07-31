let offset = 0;
const limit = 27;
const maxPokemon = 151;
let allPokemonNames = [];

function init() {
  loadAllPokemonNames();
  renderPokemon();
}

async function loadAllPokemonNames() {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
  const data = await response.json();
  allPokemonNames = [];
  for (let i = 0; i < data.results.length; i++) {
    allPokemonNames.push(data.results[i].name);
  }
}

async function fetchData() {
  let actualLimit = offset + limit > maxPokemon ? maxPokemon - offset : limit;
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${actualLimit}&offset=${offset}`);
  const data = await response.json();
  return data.results;
}

async function renderPokemon() {
  const cardContainer = document.getElementById('card_container');
  cardContainer.classList.add('fading');
  await wait(300);

  const pokemons = await fetchData();
  let html = '';
  for (let i = 0; i < pokemons.length; i++) {
    html += await renderPokemonCard(pokemons[i]);
  }
  cardContainer.innerHTML = html;
  updatePaginationButtons();
  setTimeout(() => cardContainer.classList.remove('fading'), 250);
}

async function renderPokemonCard(pokemon) {
  const detailResponse = await fetch(pokemon.url);
  const detailData = await detailResponse.json();
  return renderPokemonTemplate({
    name: pokemon.name,
    imageFront: detailData.sprites.front_default,
    imageBack: detailData.sprites.back_default,
    typeIcons: getTypeIcons(detailData.types),
    id: detailData.id,
  });
}

function getTypeIcons(typesArray) {
  let icons = [];
  for (let i = 0; i < typesArray.length; i++) {
    const typeName = typesArray[i].type.name;
    icons.push(`<img src="./assets/img/icon/${typeName}.png" alt="${typeName}" title="${typeName}" class="type-icon">`);
  }
  return icons.join('');
}

function updatePaginationButtons() {
  document.getElementById('prev-btn').disabled = offset === 0;
  document.getElementById('next-btn').disabled = offset + limit >= maxPokemon;
}

function nextPage() {
  if (offset + limit < maxPokemon) {
    offset += limit;
    renderPokemon();
  }
}

function prevPage() {
  offset = offset - limit >= 0 ? offset - limit : 0;
  renderPokemon();
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

document.getElementById('oak-toggle').addEventListener('click', function () {
  document.getElementById('oak-dropdown').classList.toggle('show');
});

function showNoPokemonFound(resultBox, labelBox) {
  resultBox.innerHTML = '<span style="color:#ff5252;">No Pokémon found.</span>';
  labelBox.style.display = 'none';
}

let oakSearchInput = document.getElementById('oak-search');
let oakResult = document.getElementById('oak-result');
let oakResultLabel = document.getElementById('oak-result-label');

oakSearchInput.addEventListener('input', async function () {
  let searchText = oakSearchInput.value.trim().toLowerCase();
  oakResult.innerHTML = '';
  oakResultLabel.style.display = 'none';

  if (searchText.length === 0) {
    return;
  }

  let matchedName = findPokemonByNameStart(searchText);

  if (matchedName === null) {
    showNoPokemonFound(oakResult, oakResultLabel);
    return;
  }

  oakResultLabel.style.display = 'block';

  let detailData = await fetchPokemonByName(matchedName);
  if (!detailData) {
    showNoPokemonFound(oakResult, oakResultLabel);
    return;
  }

  oakResult.innerHTML = renderPokemonTemplate({
    name: detailData.name,
    imageFront: detailData.sprites.front_default,
    imageBack: detailData.sprites.back_default,
    typeIcons: getTypeIcons(detailData.types),
    id: detailData.id,
    cardClass: 'large-card',
  });
});

function findPokemonByNameStart(searchText) {
  for (let i = 0; i < allPokemonNames.length; i++) {
    if (allPokemonNames[i].startsWith(searchText)) {
      return allPokemonNames[i];
    }
  }
  return null;
}

async function fetchPokemonByName(name) {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon/' + name);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch {
    return null;
  }
}

// TESTBEREICH

document.getElementById('start-btn').addEventListener('click', function () {
  const header = document.getElementById('hero-header');
  const content = document.getElementById('main-content');
  header.classList.add('shrink');
  setTimeout(() => {
    header.classList.add('hidden');
    content.classList.remove('hidden');
  }, 600);
});
