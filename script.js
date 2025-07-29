function init() {
  showPokemon();
}

async function fetchData() {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10'); // Array mit 10 Pokémon
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

async function showPokemon() {
  const pokemons = await fetchData();
  let html = '';

  for (let i = 0; i < pokemons.length; i++) {
    const detailResponse = await fetch(pokemons[i].url);
    const detailData = await detailResponse.json();
    const imgUrl = detailData.sprites.front_default;

    html += /*html*/ `
      <div class="card">
        <div class="front-content">
          <img src="${imgUrl}">
          <p>${pokemons[i].name}</p>
        </div>
      </div>
    `;
  }
  document.getElementById('card_container').innerHTML = html;
}

showPokemon();
