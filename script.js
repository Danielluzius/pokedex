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
  const pokemons = await fetchData();
  let html = '';

  for (let i = 0; i < pokemons.length; i++) {
    const detailResponse = await fetch(pokemons[i].url);
    const detailData = await detailResponse.json();
    const imgUrl = detailData.sprites.front_default;

    html += `
      <div class="card">
        <div class="front-content">
          <img src="${imgUrl}">
          <p>${pokemons[i].name}</p>
        </div>
      </div>
    `;
  }
  document.getElementById('card_container').innerHTML = html;

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
  if (offset - limit >= 0) {
    offset -= limit;
  } else {
    offset = 0;
  }
  renderPokemon();
}
