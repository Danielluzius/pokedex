function renderPokemonTemplate(pokemon) {
  return /*html*/ `
    <div class="flip-card">
      <div class="flip-card-inner">
        <div class="flip-card-front">
            <h4>Nr.${pokemon.id}</h4>
            <img src="${pokemon.imageBack}" alt="${pokemon.name}">
          <h4>${pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}</h4>
        </div>
        <div class="flip-card-back">
            <h4>${pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}</h4>
            <img src="${pokemon.imageFront}" alt="${pokemon.name}">
          <p>Type: ${pokemon.type}</p>
        </div>
      </div>
    </div>
  `;
}
