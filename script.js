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
