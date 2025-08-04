async function fetchPokemonData(nameOrId) {
  const apiUrl = 'https://pokeapi.co/api/v2/pokemon/' + String(nameOrId).toLowerCase();

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Pokémon nicht gefunden');
    }

    const data = await response.json();

    const id = data.id;
    const name = data.name;
    const height = data.height;
    const weight = data.weight;

    // Typen + Typ-Icons
    const types = [];
    const typeIcons = [];
    for (let i = 0; i < data.types.length; i++) {
      const typeName = data.types[i].type.name;
      types.push(typeName);
      typeIcons.push('https://play.pokemonshowdown.com/sprites/types/' + typeName + '.png');
    }

    // Fähigkeiten
    const abilities = [];
    for (let i = 0; i < data.abilities.length; i++) {
      abilities.push(data.abilities[i].ability.name);
    }

    // Statuswerte
    let hp = 0;
    let attack = 0;
    let defense = 0;
    let specialAttack = 0;
    let specialDefense = 0;
    let speed = 0;

    for (let i = 0; i < data.stats.length; i++) {
      const statName = data.stats[i].stat.name;
      const baseStat = data.stats[i].base_stat;

      if (statName === 'hp') hp = baseStat;
      else if (statName === 'attack') attack = baseStat;
      else if (statName === 'defense') defense = baseStat;
      else if (statName === 'special-attack') specialAttack = baseStat;
      else if (statName === 'special-defense') specialDefense = baseStat;
      else if (statName === 'speed') speed = baseStat;
    }

    // Sprites (front/back von PokéAPI + offizielles Artwork)
    const sprites = {
      front: data.sprites.front_default,
      back: data.sprites.back_default,
      officialArtwork: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    };

    // Rückgabe
    return {
      id: id,
      name: name,
      types: types,
      typeIcons: typeIcons,
      abilities: abilities,
      stats: {
        hp: hp,
        attack: attack,
        defense: defense,
        specialAttack: specialAttack,
        specialDefense: specialDefense,
        speed: speed,
      },
      height: height,
      weight: weight,
      sprites: sprites,
    };
  } catch (error) {
    console.error('Fehler beim Laden des Pokémon:', error);
    return null;
  }
}
