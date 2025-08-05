/** Global variables and constants for the Pokédex application.
 * This file contains the main application state, including all Pokémon data,
 */
let allPokemon = [];
let allPokemonIndex = [];
let activeGeneration = 1;
let currentPokemonId = null;

/**
 * @description Ranges of Pokémon IDs for each generation.
 * Used to determine which Pokémon belong to which generation.
 */
const generationIdRanges = {
  1: [1, 151],
  2: [152, 251],
  3: [252, 386],
  4: [387, 493],
  5: [494, 649],
  6: [650, 721],
  7: [722, 809],
  8: [810, 905],
  9: [906, 1025],
};

/**
 * @description Keeps track of the current page for each generation.
 * Used for pagination in the Pokédex.
 */
let currentPagePerGeneration = {
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  7: 0,
  8: 0,
  9: 0,
};

/**
 *  @description Number of Pokémon displayed per page in the Pokédex.
 *  Used for pagination in the Pokédex.
 */
const pokemonPerPage = 20;

/**
 *  @description Initializes the background music and volume control.
 *  Sets the default volume and adds event listeners for play and volume change.
 */
const audio = document.getElementById('background-music');
const button = document.getElementById('start_btn');
const volumeSlider = document.getElementById('volume-slider');

audio.volume = 0.2;
audio.loop = true;

button.addEventListener('click', function () {
  audio.play();
});

volumeSlider.addEventListener('input', function () {
  audio.volume = volumeSlider.value;
});

/**
 *  @description Initializes the application by setting up the header visibility,
 * loading all Pokémon index, and setting up the overlay close handler.
 *  This function is called when the page loads.
 */
function init() {
  const header = document.getElementById('hero_header');
  header.classList.add('visible');
  loadAllPokemonIndex();
  setupOverlayCloseHandler();
}

/**
 * @description Shows the main content of the application.
 * Hides the header and displays the main section.
 * This function is called when the user clicks the start button.
 */
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

/**
 * @description Toggles the visibility of the Oak UI elements.
 * This function is called when the user clicks the Professor Oak button.
 * It shows or hides the Oak UI and updates the visibility of the tap indicators.
 */
function toggleOakUI() {
  const oakUI = document.getElementById('oak_ui_elements');
  const professorBtn = document.getElementById('professor-button');
  const tap_Right = document.getElementById('tap_right');
  const tap_Down = document.getElementById('tap_down');

  const isVisible = oakUI.classList.contains('show');

  oakUI.classList.toggle('show');
  oakUI.classList.toggle('hidden');

  if (!isVisible) {
    tap_Right.classList.add('hidden');
    tap_Down.classList.add('hidden');
    professorBtn.classList.add('hidden');
  } else {
    tap_Right.classList.remove('hidden');
    tap_Down.classList.remove('hidden');
    professorBtn.classList.remove('hidden');
  }
}

/**
 * @description Toggles the visibility of the monitor section.
 * This function is called when the user clicks the monitor button.
 */
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

/**
 * @description Closes the Oak UI elements.
 * This function is called when the user clicks the close button.
 */
function closeOakUI() {
  const oakUI = document.getElementById('oak_ui_elements');
  const professorBtn = document.getElementById('professor-button');
  const tap_Right = document.getElementById('tap_right');
  const tap_Down = document.getElementById('tap_down');

  oakUI.classList.remove('show');
  oakUI.classList.add('hidden');

  setTimeout(() => {
    professorBtn.classList.remove('hidden');
    tap_Right.classList.remove('hidden');
    tap_Down.classList.remove('hidden');
  }, 300);
}

/**
 * @description Reloads the current page.
 */
function reloadPage() {
  location.reload();
}
