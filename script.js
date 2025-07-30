// --- Globale Variablen ---
let offset = 0;
const limit = 27;
const maxPokemon = 151;
let allPokemonNames = [];

// --- Initialisierung ---
function init() {
  loadAllPokemonNames();
  renderPokemon();
}

// --- Alle Pokémon-Namen holen ---
function loadAllPokemonNames() {
  fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
    .then((response) => response.json())
    .then((data) => {
      allPokemonNames = [];
      for (let i = 0; i < data.results.length; i++) {
        allPokemonNames.push(data.results[i].name);
      }
    });
}

// --- Daten für die Hauptansicht holen ---
function fetchData() {
  let actualLimit = offset + limit > maxPokemon ? maxPokemon - offset : limit;
  return fetch(`https://pokeapi.co/api/v2/pokemon?limit=${actualLimit}&offset=${offset}`)
    .then((response) => response.json())
    .then((data) => data.results);
}

// --- Karten in der Hauptansicht rendern ---
async function renderPokemon() {
  const cardContainer = document.getElementById('card_container');
  cardContainer.classList.add('fading');
  await new Promise((resolve) => setTimeout(resolve, 300));
  const pokemons = await fetchData();
  let html = '';
  for (let i = 0; i < pokemons.length; i++) {
    const detailResponse = await fetch(pokemons[i].url);
    const detailData = await detailResponse.json();
    html += renderPokemonTemplate({
      name: pokemons[i].name,
      imageFront: detailData.sprites.front_default,
      imageBack: detailData.sprites.back_default,
      type: detailData.types.map((type) => type.type.name).join(', '),
      id: detailData.id,
    });
  }
  cardContainer.innerHTML = html;
  document.getElementById('prev-btn').disabled = offset === 0;
  document.getElementById('next-btn').disabled = offset + limit >= maxPokemon;
  setTimeout(() => cardContainer.classList.remove('fading'), 250);
}

// --- Paginierung ---
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

// --- Dropdown (Oak) ein/ausklappen ---
document.getElementById('oak-toggle').addEventListener('click', function () {
  document.getElementById('oak-dropdown').classList.toggle('show');
});

// --- Hilfsfunktion für Fehlermeldung ---
function showNoPokemonFound(resultBox, labelBox) {
  resultBox.innerHTML = '<span style="color:#ff5252;">No Pokémon found.</span>';
  labelBox.style.display = 'none';
}

// --- Suche im Oak-Bereich ---
let oakSearchInput = document.getElementById('oak-search');
let oakResult = document.getElementById('oak-result');
let oakResultLabel = document.getElementById('oak-result-label');

oakSearchInput.addEventListener('input', function () {
  let searchText = oakSearchInput.value.trim().toLowerCase();
  oakResult.innerHTML = '';
  oakResultLabel.style.display = 'none';

  if (searchText.length === 0) {
    return;
  }

  // Suche nach erstem passenden Namen mit Schleife
  let matchedName = null;
  for (let i = 0; i < allPokemonNames.length; i++) {
    if (allPokemonNames[i].substring(0, searchText.length) === searchText) {
      matchedName = allPokemonNames[i];
      break;
    }
  }

  if (matchedName === null) {
    showNoPokemonFound(oakResult, oakResultLabel);
    return;
  }

  oakResultLabel.style.display = 'block';

  fetch('https://pokeapi.co/api/v2/pokemon/' + matchedName)
    .then((response) => {
      if (!response.ok) {
        showNoPokemonFound(oakResult, oakResultLabel);
        return;
      }
      return response.json();
    })
    .then((detailData) => {
      if (!detailData) {
        return;
      }
      oakResult.innerHTML = renderPokemonTemplate({
        name: detailData.name,
        imageFront: detailData.sprites.front_default,
        imageBack: detailData.sprites.back_default,
        type: detailData.types
          .map(function (type) {
            return type.type.name;
          })
          .join(', '),
        id: detailData.id,
      });
    })
    .catch(function () {
      showNoPokemonFound(oakResult, oakResultLabel);
    });
});
