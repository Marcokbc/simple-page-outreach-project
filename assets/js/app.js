/**
 * app.js — Controlador central da aplicação
 * Carrega os dados de content.json, renderiza os módulos em 3 camadas com ícones SVG inline profissionais,
 * gerencia filtros rápidos por categoria, busca em tempo real, acordeons do FAQ e lista de fontes oficiais.
 */

let appData = null;
let currentCategory = 'all';

// Dicionário de Ícones SVG Inline Profissionais (Sem emojis)
const SVG_ICONS = {
  law: `<svg class="icon-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>`,
  practice: `<svg class="icon-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
  prevent: `<svg class="icon-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>`,
  base: `<svg class="icon-svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`,
  warning: `<svg class="icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
  external: `<svg class="icon-svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>`
};

document.addEventListener('DOMContentLoaded', async () => {
  await loadContent();
  initNavigation();
  initSearchAndFilter();
  initFaqAccordion();
});

async function loadContent() {
  try {
    const response = await fetch('assets/data/content.json');
    if (!response.ok) throw new Error('Não foi possível carregar o arquivo content.json');
    appData = await response.json();

    renderModules(appData.modules);
    renderCategoryTabs(appData.modules);
    
    // Checklists e Rating
    if (window.ChecklistManager && appData.checklists) {
      ChecklistManager.renderChecklists(appData.checklists, 'checklists-container');
    }

    if (window.RatingManager) {
      RatingManager.init('rating-container');
    }

    renderFaqs(appData.faqs);
    renderWarningList(appData.whenToSeekProfessional);
    renderOfficialSources(appData.officialSources);

  } catch (error) {
    console.error('Erro ao inicializar o conteúdo:', error);
    const container = document.getElementById('modules-container');
    if (container) {
      container.innerHTML = `
        <div style="text-align: center; padding: 3rem; background: #fee2e2; border-radius: 12px; color: #991b1b;">
          <h3>Erro ao carregar as diretrizes.</h3>
          <p>Verifique se o arquivo content.json está na pasta assets/data/.</p>
        </div>
      `;
    }
  }
}

function renderModules(modules) {
  const container = document.getElementById('modules-container');
  if (!container) return;

  if (modules.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 4rem 1rem; color: var(--text-light);">
        <p style="font-size: 1.1rem; font-weight: 600;">Nenhum tema encontrado para a sua busca.</p>
        <button onclick="clearSearch()" style="margin-top: 1rem; background: #ffffff; border: 1px solid var(--color-accent); color: var(--color-accent); padding: 0.5rem 1.25rem; border-radius: 9999px; cursor: pointer; font-weight: 600;">
          Limpar busca
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = modules.map(mod => {
    const cardsHtml = mod.cards.map(card => `
      <article class="guide-card" id="${card.id}">
        <div class="card-top">
          <h3 class="card-title">${card.title}</h3>
        </div>

        <div class="card-layers">
          <!-- 1. O que a lei diz -->
          <div class="layer-item layer-law">
            <span class="layer-label">
              ${SVG_ICONS.law}
              1. O que a Lei diz
            </span>
            <p class="layer-text">${card.layers.lei}</p>
          </div>

          <!-- 2. O que isso significa na prática -->
          <div class="layer-item layer-practice">
            <span class="layer-label">
              ${SVG_ICONS.practice}
              2. O que isso significa na prática
            </span>
            <p class="layer-text">${card.layers.pratica}</p>
          </div>

          <!-- 3. Como evitar o problema -->
          <div class="layer-item layer-prevent">
            <span class="layer-label">
              ${SVG_ICONS.prevent}
              3. Como evitar o problema
            </span>
            <p class="layer-text">${card.layers.comoEvitar}</p>
          </div>
        </div>

        <div class="card-footer">
          <span class="base-legal">
            ${SVG_ICONS.base}
            ${card.baseLegal}
          </span>
        </div>
      </article>
    `).join('');

    return `
      <section class="module-block" id="${mod.id}" data-category="${mod.category}">
        <div class="module-header">
          <div class="module-title-group">
            <h2 class="module-title">${mod.title}</h2>
            <span class="module-badge">${mod.badge}</span>
          </div>
          <p class="module-summary">${mod.summary}</p>
        </div>

        <div class="cards-grid">
          ${cardsHtml}
        </div>
      </section>
    `;
  }).join('');
}

function renderCategoryTabs(modules) {
  const tabsContainer = document.getElementById('category-tabs');
  if (!tabsContainer) return;

  const categories = ['Todas as Áreas', ...new Set(modules.map(m => m.category))];

  tabsContainer.innerHTML = categories.map((cat, idx) => `
    <button class="tab-btn ${idx === 0 ? 'active' : ''}" data-cat="${cat === 'Todas as Áreas' ? 'all' : cat}">
      ${cat}
    </button>
  `).join('');

  tabsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;

    tabsContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    currentCategory = btn.dataset.cat;
    applyFilterAndSearch();
  });
}

function initSearchAndFilter() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    applyFilterAndSearch();
  });
}

function applyFilterAndSearch() {
  if (!appData || !appData.modules) return;

  const query = (document.getElementById('search-input')?.value || '').toLowerCase().trim();

  let filtered = appData.modules.map(mod => {
    const matchesCategory = currentCategory === 'all' || mod.category === currentCategory;
    if (!matchesCategory) return null;

    if (!query) return mod;

    const matchedCards = mod.cards.filter(c => {
      const matchTitle = c.title.toLowerCase().includes(query);
      const matchLei = c.layers.lei.toLowerCase().includes(query);
      const matchPratica = c.layers.pratica.toLowerCase().includes(query);
      const matchEvitar = c.layers.comoEvitar.toLowerCase().includes(query);
      const matchBase = c.baseLegal.toLowerCase().includes(query);
      return matchTitle || matchLei || matchPratica || matchEvitar || matchBase;
    });

    if (matchedCards.length > 0) {
      return { ...mod, cards: matchedCards };
    }

    if (mod.title.toLowerCase().includes(query) || mod.summary.toLowerCase().includes(query)) {
      return mod;
    }

    return null;
  }).filter(Boolean);

  renderModules(filtered);
}

function clearSearch() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';
  currentCategory = 'all';

  const tabsContainer = document.getElementById('category-tabs');
  if (tabsContainer) {
    tabsContainer.querySelectorAll('.tab-btn').forEach((b, idx) => {
      b.classList.toggle('active', idx === 0);
    });
  }

  applyFilterAndSearch();
}

function renderFaqs(faqs) {
  const container = document.getElementById('faq-container');
  if (!container || !faqs) return;

  container.innerHTML = faqs.map((faq, idx) => `
    <div class="faq-item" id="faq-${idx}">
      <button class="faq-trigger" aria-expanded="false" aria-controls="faq-body-${idx}">
        <span class="faq-question">“${faq.q}”</span>
        <span class="faq-icon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </span>
      </button>
      <div class="faq-body" id="faq-body-${idx}">
        <div class="faq-answer">
          ${faq.a}
        </div>
      </div>
    </div>
  `).join('');
}

function initFaqAccordion() {
  const container = document.getElementById('faq-container');
  if (!container) return;

  container.addEventListener('click', (e) => {
    const trigger = e.target.closest('.faq-trigger');
    if (!trigger) return;

    const item = trigger.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    container.querySelectorAll('.faq-item').forEach(el => {
      el.classList.remove('open');
      el.querySelector('.faq-trigger')?.setAttribute('aria-expanded', 'false');
    });

    if (!isOpen) {
      item.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
    }
  });
}

function renderWarningList(items) {
  const listEl = document.getElementById('warning-list');
  if (!listEl || !items) return;

  listEl.innerHTML = items.map(item => `
    <li>
      <span class="warning-bullet">${SVG_ICONS.warning}</span>
      <span>${item}</span>
    </li>
  `).join('');
}

function renderOfficialSources(sources) {
  const container = document.getElementById('official-sources-grid');
  if (!container || !sources) return;

  container.innerHTML = sources.map(src => `
    <a href="${src.url}" target="_blank" rel="noopener noreferrer" class="source-card">
      <div class="source-content">
        <h4 class="source-title">${src.title}</h4>
        <p class="source-desc">${src.desc}</p>
      </div>
      <span class="source-link-icon">${SVG_ICONS.external}</span>
    </a>
  `).join('');
}

function initNavigation() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }
}
