function renderPokemonTemplate(pokemon) {
  return /*html*/ `
    <div class="flip-card">
      <div class="flip-card-inner">
        <div class="flip-card-front">
            <h4>Nr.${pokemon.id}</h4>
            <img class="flip-card-front-img" src="${pokemon.imageBack}" alt="${pokemon.name}">
          <h4>${pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}</h4>
        </div>
        <div class="flip-card-back">
            <h4>${pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}</h4>
            <img class="flip-card-back-img" src="${pokemon.imageFront}" alt="${pokemon.name}">
          <div class="type-row">
            Type: ${pokemon.typeIcons}
          </div>
        </div>
      </div>
    </div>
  `;
}
