async function fetchPokemonData(nameOrId) {
  const apiUrl = 'https://pokeapi.co/api/v2/pokemon/' + String(nameOrId).toLowerCase();

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Pokémon not found');
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
      typeIcons.push('./assets/img/icon/types/' + typeName + '.png');
    }

    // Fähigkeiten
    const abilities = [];
    for (let i = 0; i < data.abilities.length; i++) {
      abilities.push(data.abilities[i].ability.name);
    }

    // Statuswerte
    let hp = 0,
      attack = 0,
      defense = 0,
      specialAttack = 0,
      specialDefense = 0,
      speed = 0;
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

    // Sprites
    const spriteName = name.toLowerCase();
    const animatedFront = `https://play.pokemonshowdown.com/sprites/gen5ani/${spriteName}.gif`;
    const officialArtwork = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

    const sprites = {
      front: data.sprites.front_default,
      back: data.sprites.back_default,
      officialArtwork,
      animatedFront,
    };

    // ➕ Englische Beschreibung
    const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;
    const speciesResponse = await fetch(speciesUrl);
    const speciesData = await speciesResponse.json();

    const englishEntry = speciesData.flavor_text_entries.find((entry) => entry.language.name === 'en');
    const description = englishEntry
      ? englishEntry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ')
      : 'No description available.';

    return {
      id,
      name,
      types,
      typeIcons,
      abilities,
      stats: {
        hp,
        attack,
        defense,
        specialAttack,
        specialDefense,
        speed,
      },
      height,
      weight,
      sprites,
      description,
    };
  } catch (error) {
    console.error('Error fetching Pokémon data:', error);
    return null;
  }
}
