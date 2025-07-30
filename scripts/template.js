function renderPokemonTemplate(pokemon) {
  return /*html*/ `
    <div class="flip-card">
      <div class="flip-card-inner">
        <div class="flip-card-front">
            <h3>Nr.${pokemon.id}</h3>
            <img src="${pokemon.imageBack}" alt="${pokemon.name}">
          <h2>${pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}</h2>
        </div>
        <div class="flip-card-back">
            <h3>${pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}</h3>
            <img src="${pokemon.imageFront}" alt="${pokemon.name}">
          <p>Type: ${pokemon.type}</p>
        </div>
      </div>
    </div>
  `;
}
