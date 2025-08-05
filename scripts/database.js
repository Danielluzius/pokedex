async function fetchPokemonData(nameOrId) {
  try {
    const d = await fetchDataFromUrl(`https://pokeapi.co/api/v2/pokemon/${String(nameOrId).toLowerCase()}`);
    const id = d.id,
      name = d.name;

    const species = await fetchDataFromUrl(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);

    return {
      id,
      name,
      height: d.height,
      weight: d.weight,
      types: extractTypes(d).names,
      typeIcons: extractTypes(d).icons,
      abilities: extractAbilities(d),
      stats: extractStats(d),
      sprites: buildSprites(d, id, name),
      description: extractDescription(species),
    };
  } catch (err) {
    console.error('Error fetching Pokémon data:', err);
    return null;
  }
}

async function fetchDataFromUrl(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed: ${url}`);
  return response.json();
}

function extractTypes(data) {
  const names = [];
  const icons = [];
  for (let t of data.types) {
    const type = t.type.name;
    names.push(type);
    icons.push(`./assets/img/icon/types/${type}.png`);
  }
  return { names, icons };
}

function extractAbilities(data) {
  return data.abilities.map((a) => a.ability.name);
}

function extractStats(data) {
  const stats = {
    hp: 0,
    attack: 0,
    defense: 0,
    specialAttack: 0,
    specialDefense: 0,
    speed: 0,
  };
  for (let s of data.stats) {
    const n = s.stat.name,
      v = s.base_stat;
    if (n === 'hp') stats.hp = v;
    else if (n === 'attack') stats.attack = v;
    else if (n === 'defense') stats.defense = v;
    else if (n === 'special-attack') stats.specialAttack = v;
    else if (n === 'special-defense') stats.specialDefense = v;
    else if (n === 'speed') stats.speed = v;
  }
  return stats;
}

function buildSprites(data, id, name) {
  const base = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/';
  const gifBase = 'https://play.pokemonshowdown.com/sprites/gen5ani/';
  return {
    front: data.sprites.front_default,
    back: data.sprites.back_default,
    officialArtwork: `${base}${id}.png`,
    animatedFront: `${gifBase}${name.toLowerCase()}.gif`,
  };
}

function extractDescription(speciesData) {
  const entry = speciesData.flavor_text_entries.find((e) => e.language.name === 'en');
  return entry ? entry.flavor_text.replace(/\f/g, ' ').replace(/\n/g, ' ') : 'No description available.';
}
