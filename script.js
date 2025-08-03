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

  if (genNumber === 1) {
    currentGenerationPage = 0;
    showGenerationOnePage();
  }
}

function closePokedexGenSection() {
  const mainSection = document.getElementById('pokedex_main_section');
  const genSection = document.getElementById('pokedex_gen_section');

  genSection.classList.remove('show');
  mainSection.classList.add('show');
}

// TESTBEREICH

// ========== GENERATION 1 – POKÉMON LADEN UND ANZEIGEN ==========

// IDs der ersten Generation (1 bis 151)
const generationOneIds = [];
for (let i = 1; i <= 151; i++) {
  generationOneIds.push(i);
}

// Anzeige-Konfiguration
let currentGenerationPage = 0;
const pokemonPerPage = 20;

// Hauptfunktion zum Anzeigen einer Seite
async function showGenerationOnePage() {
  const outputContainer = document.getElementById('pokemon_output');
  outputContainer.innerHTML = ''; // Vorherige Einträge löschen

  const startIndex = currentGenerationPage * pokemonPerPage;
  const endIndex = startIndex + pokemonPerPage;

  for (let i = startIndex; i < endIndex && i < generationOneIds.length; i++) {
    const pokemonId = generationOneIds[i];
    const pokemonData = await fetchPokemonData(pokemonId);

    outputContainer.innerHTML += `
    <div class="pokemon-card">
      <p class="pokemon-nr">-${pokemonData.id}-</p>
      <img src="${pokemonData.sprites.front}" alt="${pokemonData.name}">
      <p class="pokemon-name">${pokemonData.name.toUpperCase()}</p>
    </div>
  `;
  }
}

// Button: Weiter zur nächsten Seite
function showNextGenerationOnePage() {
  const maxPages = Math.ceil(generationOneIds.length / pokemonPerPage);
  if (currentGenerationPage < maxPages - 1) {
    currentGenerationPage++;
    showGenerationOnePage();
  }
}

// Button: Zurück zur vorherigen Seite
function showPreviousGenerationOnePage() {
  if (currentGenerationPage > 0) {
    currentGenerationPage--;
    showGenerationOnePage();
  }
}
