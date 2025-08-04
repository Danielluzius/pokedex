function createPokemonCardHTML(pokemonData, image, scaleFactor) {
  const stats = pokemonData.stats;

  const aboutHTML = `
    <div class="about-box">
      <p class="about-text">${pokemonData.description}</p>
    </div>
  `;

  const statsHTML = /*html*/ `
    <div class="stats-container">
      <div class="meta-left">
        <p><strong>Height:</strong> ${pokemonData.height / 10} m</p>
        <p><strong>Weight:</strong> ${pokemonData.weight / 10} kg</p>
      </div>
      <div class="meta-right">
        ${pokemonData.typeIcons
          .map(
            (icon, i) => `
              <img src="${icon}" alt="${pokemonData.types[i]}" class="type-icon">
            `
          )
          .join('')}
      </div>
      <div class="stats-left">
        <p><strong>HP:</strong> ${stats.hp}</p>
        <p><strong>Attack:</strong> ${stats.attack}</p>
        <p><strong>Defense:</strong> ${stats.defense}</p>
      </div>
      <div class="stats-right">
        <p><strong>Sp. Atk:</strong> ${stats.specialAttack}</p>
        <p><strong>Sp. Def:</strong> ${stats.specialDefense}</p>
        <p><strong>Speed:</strong> ${stats.speed}</p>
      </div>
    </div>
  `;

  return /*html*/ `
    <img src="./assets/img/icon/button/close_btn.png" alt="Close Button" class="card-close-btn" onclick="closePokemonCard()">
    <p class="card-id">#${pokemonData.id}</p>
    <p class="card-name">${pokemonData.name.toUpperCase()}</p>
    <img id="cardImage" class="card-image" src="${image}" alt="${
    pokemonData.name
  }" style="transform: scale(${scaleFactor}); transform-origin: center;">

    <div class="card-tabs">
      <button class="tab-btn active" id="tab-about">About</button>
      <button class="tab-btn" id="tab-stats">Stats</button>
    </div>

    <div class="tab-content-container">
      <div id="about-section" class="tab-section active">${aboutHTML}</div>
      <div id="stats-section" class="tab-section">${statsHTML}</div>
    </div>

    <img src="./assets/img/icon/button/left_arrow.png" alt="Back" class="back-btn" id="back_btn">
    <img src="./assets/img/icon/button/right_arrow.png" alt="Next" class="next-btn" id="next_btn">
  `;
}
