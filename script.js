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
    const imgUrl = detailData.sprites.back_default;
    const imgFrontUrl = detailData.sprites.front_default;

    html += `
  <div class="flip-card">
    <div class="flip-card-inner">
      <div class="flip-card-front">
        <img class="img-back" src="${imgUrl}">
        <p class="title">${pokemons[i].name}</p>
      </div>
      <div class="flip-card-back">
        <img class="img-front" src="${imgFrontUrl}">
        <p class="title">${pokemons[i].name}</p>
      </div>
    </div>
  </div>
`;
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
