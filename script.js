const app = document.querySelector('.app-shell');
const tabs = [...document.querySelectorAll('.tab')];
const mobileTabs = [...document.querySelectorAll('.mobile-tabs button')];
const panels = [...document.querySelectorAll('.panel')];
const railClose = document.querySelector('.rail-close');
const railOpen = document.querySelector('.rail-open');
const sheet = document.querySelector('.mobile-sheet');
const sheetToggle = document.querySelector('.sheet-toggle');
const sheetHandle = document.querySelector('.sheet-handle');
const mobileCopy = document.querySelector('.mobile-copy');

const copyByPanel = {
  experience: {
    kicker: 'Maranello Experience',
    title: 'Explorez le showroom en visite immersive.',
    text: 'Découvrez les modèles, les services et réservez une expérience privée sans quitter la visite.'
  },
  models: {
    kicker: 'La gamme Ferrari',
    title: 'Comparez les modèles en contexte.',
    text: '296 GTB, SF90 Stradale, Roma Spider ou Purosangue : chaque fiche reste liée au parcours immersif.'
  },
  atelier: {
    kicker: 'Atelier & Tailor Made',
    title: 'Approchez matières, couleurs et détails.',
    text: 'Cuir, carbone, jantes et teintes deviennent des points de projection directement dans l’app.'
  },
  heritage: {
    kicker: 'Héritage',
    title: 'La culture Ferrari enrichit la visite.',
    text: 'Une narration éditoriale courte pour relier chaque espace à l’histoire, la piste et Maranello.'
  },
  services: {
    kicker: 'Services propriétaires',
    title: 'Passez de la visite à l’action.',
    text: 'Planifiez un entretien, contactez l’assistance ou préparez un rendez-vous atelier.'
  },
  contact: {
    kicker: 'Conciergerie Ferrari',
    title: 'Réservez une expérience privée.',
    text: 'Essai, configuration, rappel ou rendez-vous : le CTA reste accessible sans casser l’immersion.'
  }
};

function activatePanel(panelName) {
  app.dataset.panel = panelName;

  tabs.forEach((tab) => {
    tab.classList.toggle('is-active', tab.dataset.tab === panelName);
  });

  mobileTabs.forEach((tab) => {
    tab.classList.toggle('is-active', tab.dataset.tab === panelName);
  });

  panels.forEach((panel) => {
    const isActive = panel.dataset.content === panelName;
    panel.classList.toggle('is-active', isActive);

    if (isActive) {
      panel.scrollTo({ top: 0, behavior: 'smooth' });
      panel.querySelectorAll('.reveal-card').forEach((card, index) => {
        card.style.animation = 'none';
        window.requestAnimationFrame(() => {
          card.style.animation = `cardIn 0.74s var(--ease) ${Math.min(index * 0.045, 0.22)}s forwards`;
        });
      });
    }
  });

  const mobile = copyByPanel[panelName];
  if (mobileCopy && mobile) {
    mobileCopy.innerHTML = `
      <p class="mobile-kicker">${mobile.kicker}</p>
      <h2>${mobile.title}</h2>
      <p>${mobile.text}</p>
    `;
  }
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => activatePanel(tab.dataset.tab));
});

mobileTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    activatePanel(tab.dataset.tab);
    sheet?.classList.remove('is-collapsed');
    if (sheetToggle) sheetToggle.textContent = 'Réduire';
  });
});

railClose?.addEventListener('click', () => {
  app.dataset.rail = 'closed';
});

railOpen?.addEventListener('click', () => {
  app.dataset.rail = 'open';
});

function toggleSheet() {
  const collapsed = sheet.classList.toggle('is-collapsed');
  if (sheetToggle) sheetToggle.textContent = collapsed ? 'Ouvrir' : 'Réduire';
}

sheetToggle?.addEventListener('click', toggleSheet);
sheetHandle?.addEventListener('click', toggleSheet);

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    app.dataset.rail = app.dataset.rail === 'closed' ? 'open' : 'closed';
  }

  const activeIndex = tabs.findIndex((tab) => tab.classList.contains('is-active'));
  if (event.key === 'ArrowRight') {
    const next = tabs[(activeIndex + 1) % tabs.length];
    activatePanel(next.dataset.tab);
  }
  if (event.key === 'ArrowLeft') {
    const previous = tabs[(activeIndex - 1 + tabs.length) % tabs.length];
    activatePanel(previous.dataset.tab);
  }
});

// Préparation Matterport : remplacer cette valeur par le lien embed du client.
// Exemple : const MATTERPORT_URL = 'https://my.matterport.com/show/?m=XXXXXXXXXXX&play=1&qs=1';
const MATTERPORT_URL = '';
const frame = document.querySelector('.matterport-frame');

if (MATTERPORT_URL && frame) {
  frame.src = MATTERPORT_URL;
  frame.style.opacity = '1';
  frame.style.pointerEvents = 'auto';
  document.querySelector('.matterport-fallback')?.remove();
}
