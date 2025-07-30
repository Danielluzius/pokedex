function init() {
  renderPokemon();
}

let offset = 0;
const limit = 27;
const maxPokemon = 151;

async function fetchData() {
  let actualLimit = limit;
  if (offset + limit > maxPokemon) {
    actualLimit = maxPokemon - offset;
  }
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${actualLimit}&offset=${offset}`);
  const data = await response.json();
  return data.results;
}

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

function nextPage() {
  if (offset + limit < maxPokemon) {
    offset += limit;
    renderPokemon();
  }
}

function prevPage() {
  if (offset - limit >= 0) {
    offset -= limit;
  } else {
    offset = 0;
  }
  renderPokemon();
}

const toggleButton = document.getElementById('oak-toggle');
const dropdown = document.getElementById('oak-dropdown');

toggleButton.addEventListener('click', function () {
  dropdown.classList.toggle('show');
});
