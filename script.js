function init() {
  const header = document.getElementById('hero_header');
  header.classList.add('visible');
}

function showMainContent() {
  const header = document.getElementById('hero_header');
  const main = document.querySelector('main');
  const body = document.body;

  header.classList.remove('visible');
  header.classList.add('fade-out');

  setTimeout(function () {
    header.style.display = 'none';
    main.classList.remove('hidden');
    body.classList.remove('header-active');

    const fadeElements = document.querySelectorAll('.fade-in');
    for (let i = 0; i < fadeElements.length; i++) {
      fadeElements[i].classList.add('visible');
    }
  }, 1200);
}

function toggleOakUI() {
  const oakUI = document.getElementById('oak_ui_elements');
  const professorBtn = document.getElementById('professor-button');

  const isVisible = oakUI.classList.contains('show');

  oakUI.classList.toggle('show');
  oakUI.classList.toggle('hidden');

  if (!isVisible) {
    professorBtn.classList.add('hidden');
  } else {
    professorBtn.classList.remove('hidden');
  }
}

function toggleMonitor() {
  const monitor = document.getElementById('monitor_section');
  const isVisible = monitor.classList.contains('show');

  monitor.classList.toggle('show');

  if (!isVisible) {
    setTimeout(() => {
      monitor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 380);
  }
}

function closeOakUI() {
  const oakUI = document.getElementById('oak_ui_elements');
  const professorBtn = document.getElementById('professor-button');

  oakUI.classList.remove('show');
  oakUI.classList.add('hidden');

  setTimeout(() => {
    professorBtn.classList.remove('hidden');
  }, 300);
}

function showPokedexGenSection(genNumber) {
  const mainSection = document.getElementById('pokedex_main_section');
  const genSection = document.getElementById('pokedex_gen_section');

  mainSection.classList.remove('show');
  genSection.classList.add('show');
}

function closePokedexGenSection() {
  const mainSection = document.getElementById('pokedex_main_section');
  const genSection = document.getElementById('pokedex_gen_section');

  genSection.classList.remove('show');
  mainSection.classList.add('show');
}

// TESTBEREICH

async function fetchPokemonData(nameOrId) {
  const apiUrl = `https://pokeapi.co/api/v2/pokemon/${nameOrId.toLowerCase()}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error('Pokémon nicht gefunden');
    }

    const data = await response.json();

    // ID und Name
    const id = data.id;
    const name = data.name;

    // Typen sammeln
    const types = [];
    for (let i = 0; i < data.types.length; i++) {
      types.push(data.types[i].type.name);
    }

    // Fähigkeiten sammeln
    const abilities = [];
    for (let i = 0; i < data.abilities.length; i++) {
      abilities.push(data.abilities[i].ability.name);
    }

    // Statuswerte einzeln heraussuchen
    let hp = 0;
    let attack = 0;
    let defense = 0;
    let specialAttack = 0;
    let specialDefense = 0;
    let speed = 0;

    for (let i = 0; i < data.stats.length; i++) {
      const statName = data.stats[i].stat.name;
      const baseStat = data.stats[i].base_stat;

      if (statName === 'hp') {
        hp = baseStat;
      } else if (statName === 'attack') {
        attack = baseStat;
      } else if (statName === 'defense') {
        defense = baseStat;
      } else if (statName === 'special-attack') {
        specialAttack = baseStat;
      } else if (statName === 'special-defense') {
        specialDefense = baseStat;
      } else if (statName === 'speed') {
        speed = baseStat;
      }
    }

    // Größe & Gewicht
    const height = data.height;
    const weight = data.weight;

    // Sprite-Links von Showdown
    const baseUrl = 'https://play.pokemonshowdown.com/sprites/';
    const spriteName = name.toLowerCase();

    const sprites = {
      static: {
        front: baseUrl + 'gen5/' + spriteName + '.png',
        back: baseUrl + 'gen5-back/' + spriteName + '.png',
        shinyFront: baseUrl + 'gen5-shiny/' + spriteName + '.png',
        shinyBack: baseUrl + 'gen5-back-shiny/' + spriteName + '.png',
      },
      animated: {
        front: baseUrl + 'gen5ani/' + spriteName + '.gif',
        back: baseUrl + 'gen5ani-back/' + spriteName + '.gif',
        shinyFront: baseUrl + 'gen5ani-shiny/' + spriteName + '.gif',
        shinyBack: baseUrl + 'gen5ani-back-shiny/' + spriteName + '.gif',
      },
    };

    // Ergebnis zurückgeben
    return {
      id: id,
      name: name,
      types: types,
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
