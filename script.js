function init() {
  const header = document.getElementById('hero-header');
  header.classList.add('visible');
}

function showMainContent() {
  const header = document.getElementById('hero-header');
  const main = document.querySelector('main');
  const body = document.body;

  header.classList.remove('visible');
  header.classList.add('fade-out');

  setTimeout(function () {
    header.style.display = 'none'; // Jetzt endgültig aus dem Layout nehmen
    main.classList.remove('hidden');
    body.classList.remove('header-active');

    const fadeElements = document.querySelectorAll('.fade-in');
    for (let i = 0; i < fadeElements.length; i++) {
      fadeElements[i].classList.add('visible');
    }
  }, 1200); // exakt wie in CSS: 1.2s
}

function toggleOakUI() {
  const ui = document.getElementById('oak-ui-elements');
  const bg = document.getElementById('oak-background');

  ui.classList.toggle('hidden');
  bg.classList.toggle('dimmed');
}

function toggleMonitor() {
  const monitor = document.getElementById('monitor-section');
  const isVisible = monitor.classList.contains('show');

  monitor.classList.toggle('show');

  // Wenn jetzt eingeblendet wird:
  if (!isVisible) {
    // War vorher versteckt, wird jetzt sichtbar – also scroll NACH dem Übergang
    setTimeout(() => {
      monitor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 380); // etwas mehr als die 0.5s aus dem CSS
  }
}
