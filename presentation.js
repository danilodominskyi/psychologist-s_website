/**
 * Презентації для сайту «Шкільний психолог».
 * Підключати ОДИН РАЗ після index.js і new_advice.js.
 * Для додавання нової презентації редагуй лише масив PRESENTATIONS.
 * presentation.css із попередньої версії можна залишити без змін.
 */
(() => {
  'use strict';

  // =============================================================
  // 1. СПИСОК ПРЕЗЕНТАЦІЙ — ДОДАВАЙ НОВІ ОБ'ЄКТИ СЮДИ
  // =============================================================
  const PRESENTATIONS = [
    {
      id: 17, // Унікальний ID, який НЕ використовується іншими статтями
      category: 'Батькам', // 'Учням', 'Батькам' або 'Педагогам'
      title: 'Стабілізація психоемоційного стану здобувачів освіти',
      description: 'Презентація з практичними порадами щодо стану здобувачів освіти',
      file: 'documents/stress-presentation.pdf',
      fallbackImage: 'img/stress-first-slide.png' // Необов'язково: запасна обкладинка
    },
    // ШАБЛОН: заміни дані та постав enabled: true, щоб картка з'явилася.
    // Для 3-ї, 4-ї тощо скопіюй цей об'єкт і дай новий унікальний id.
    {
      enabled: true,
      id: 18,
      category: 'Педагогам',
      title: 'Розвиток дитини. Стадії соціального розвитку дитини',
      description: 'Презентація з практичними порадами щодо розвитоку дитини',
      file: 'documents/age-development.pdf'
    }
  ];

  // =============================================================
  // 2. СЛУЖБОВИЙ КОД: нижче нічого міняти не потрібно
  // =============================================================
  const PDFJS_VERSION = '6.5.438';
  const PDFJS_BASE = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build`;
  const container = document.getElementById('articlesContainer');

  if (!container || typeof articles === 'undefined' || !Array.isArray(articles) ||
      typeof showArticles !== 'function') {
    console.error('presentation.js: підключи index.js і new_advice.js перед presentation.js');
    return;
  }

  // Запобігаємо подвійному підключенню скрипту.
  if (document.getElementById('psyPresentationModal')) {
    console.warn('presentation.js: файл уже підключено. Друге підключення пропущено.');
    return;
  }

  const CATEGORY_CLASSES = {
    'Учням': 'student',
    'Батькам': 'parents',
    'Педагогам': 'teachers',
    'Усі': 'all'
  };

  // Нейтральна резервна картинка для презентацій, якщо PDF.js недоступний.
  const genericSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540">
    <rect width="960" height="540" fill="#edf6ef"/>
    <rect x="207" y="86" width="546" height="366" rx="24" fill="#ffffff" stroke="#a0cbb0" stroke-width="8"/>
    <rect x="260" y="140" width="440" height="210" rx="16" fill="#d9ebe0"/>
    <path d="M388 245l56 54 128-130" fill="none" stroke="#267356" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="480" y="415" text-anchor="middle" font-family="Arial,sans-serif" font-size="34" font-weight="bold" fill="#256247">ПРЕЗЕНТАЦІЯ · PDF</text>
  </svg>`;
  const genericCover = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(genericSvg)}`;

  const byId = new Map();
  const byTitle = new Map();
  const covers = new Map();

  // Реєструємо всі презентації в тому ж масиві articles, що і звичайні статті.
  for (const raw of PRESENTATIONS) {
    if (raw?.enabled === false) continue;
    if (!raw || !Number.isSafeInteger(Number(raw.id)) || Number(raw.id) < 1 ||
        !String(raw.title || '').trim() || !String(raw.file || '').trim()) {
      console.warn('presentation.js: пропущено презентацію з неправильними даними:', raw);
      continue;
    }

    const id = Number(raw.id);
    if (byId.has(id)) {
      console.warn(`presentation.js: повторний ID ${id}; презентацію пропущено.`);
      continue;
    }

    const existing = articles.find(item => Number(item.id) === id);
    if (existing && existing.type !== 'presentation' && !existing.file) {
      console.error(`presentation.js: ID ${id} вже зайнятий звичайною статтею. Зміни ID.`);
      continue;
    }

    const category = CATEGORY_CLASSES[raw.category] ? raw.category : 'Усі';
    const data = {
      id,
      type: 'presentation',
      category,
      categoryClass: CATEGORY_CLASSES[category],
      title: String(raw.title).trim(),
      description: String(raw.description || '').trim(),
      readingTime: 'Презентація • PDF',
      file: String(raw.file).trim(),
      image: raw.fallbackImage || genericCover,
      steps: []
    };

    const article = existing ? Object.assign(existing, data) : data;
    if (!existing) articles.push(article);

    if (byTitle.has(article.title)) {
      console.warn(`presentation.js: повторна назва «${article.title}». Для тематичних блоків назви мають бути різними.`);
    }
    byId.set(id, article);
    byTitle.set(article.title, article);
    covers.set(id, {url: article.image, version: 0, loading: null, loaded: false});
  }

  if (!byId.size) return;

  // Одне спільне модальне вікно для ВСІХ презентацій.
  const modal = document.createElement('div');
  modal.className = 'psy-presentation-modal';
  modal.id = 'psyPresentationModal';
  modal.hidden = true;
  modal.innerHTML = `
    <div class="psy-presentation-dialog" role="dialog" aria-modal="true" aria-labelledby="psyPresentationTitle" tabindex="-1">
      <header class="psy-presentation-header">
        <div class="psy-presentation-heading">
          <span class="psy-presentation-mini-icon" aria-hidden="true">▤</span>
          <div>
            <span class="psy-presentation-eyebrow">Презентація • Психологічні поради</span>
            <h2 id="psyPresentationTitle"></h2>
          </div>
        </div>
        <button class="psy-presentation-close" type="button" aria-label="Закрити презентацію">×</button>
      </header>
      <div class="psy-presentation-viewer">
        <div class="psy-presentation-placeholder" hidden>
          <span class="psy-presentation-placeholder-icon" aria-hidden="true">▤</span>
          <h3>Презентацію не вдалося відкрити</h3>
          <p>Перевір PDF-файл у папці <code>documents</code>.</p>
        </div>
        <iframe class="psy-presentation-frame" title="Перегляд презентації у форматі PDF"></iframe>
      </div>
      <footer class="psy-presentation-footer">
        <span class="psy-presentation-hint">виконано: Тамарою Василишин</span>
        <a class="psy-presentation-external" target="_blank" rel="noopener noreferrer">Відкрити в новій вкладці ↗</a>
      </footer>
    </div>`;
  document.body.appendChild(modal);

  const dialog = modal.querySelector('.psy-presentation-dialog');
  const titleElement = modal.querySelector('#psyPresentationTitle');
  const closeButton = modal.querySelector('.psy-presentation-close');
  const frame = modal.querySelector('.psy-presentation-frame');
  const placeholder = modal.querySelector('.psy-presentation-placeholder');
  const external = modal.querySelector('.psy-presentation-external');
  let previousFocus = null;
  let previousOverflow = '';
  let openRequest = 0;

  async function openPresentation(id) {
    const presentation = byId.get(Number(id));
    if (!presentation) return;

    if (modal.hidden) {
      previousFocus = document.activeElement;
      previousOverflow = document.body.style.overflow;
    }
    const req = ++openRequest;
    titleElement.textContent = presentation.title;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    frame.hidden = true;
    frame.removeAttribute('src');
    placeholder.hidden = true;
    external.hidden = true;
    closeButton.focus();

    try {
      const response = await fetch(presentation.file, {method: 'HEAD'});
      const type = response.headers.get('content-type') || '';
      if (!response.ok || /text\/html/i.test(type)) {
        throw new Error(`PDF недоступний (HTTP ${response.status})`);
      }
      if (req !== openRequest || modal.hidden) return;
      frame.src = `${presentation.file}#view=FitH&toolbar=1`;
      frame.hidden = false;
      external.href = presentation.file;
      external.hidden = false;
    } catch (error) {
      if (req !== openRequest || modal.hidden) return;
      placeholder.hidden = false;
      console.warn(`presentation.js: не вдалося відкрити ${presentation.file}:`, error);
    }
  }

  function closePresentation() {
    if (modal.hidden) return;
    ++openRequest;
    modal.hidden = true;
    frame.removeAttribute('src');
    document.body.style.overflow = previousOverflow;
    if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
      previousFocus.focus({preventScroll: true});
    }
  }

  closeButton.addEventListener('click', closePresentation);
  modal.addEventListener('click', event => {
    if (event.target === modal) closePresentation();
  });
  document.addEventListener('keydown', event => {
    if (modal.hidden) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closePresentation();
    } else if (event.key === 'Tab') {
      const items = [...dialog.querySelectorAll('button:not([disabled]), a[href]:not([hidden]), iframe:not([hidden])')]
        .filter(el => !el.hidden);
      if (!items.length) return;
      if (event.shiftKey && document.activeElement === items[0]) {
        event.preventDefault();
        items[items.length - 1].focus();
      } else if (!event.shiftKey && document.activeElement === items[items.length - 1]) {
        event.preventDefault();
        items[0].focus();
      }
    }
  });

  // Працює і для onclick="openArticle(18)", і для renderPopularArticles,
  // і для renderPageArticles, які мають власні обробники.
  const originalOpenArticle = window.openArticle;
  if (typeof originalOpenArticle === 'function') {
    window.openArticle = function(articleId, ...args) {
      if (byId.has(Number(articleId))) return openPresentation(articleId);
      return originalOpenArticle.call(this, articleId, ...args);
    };
  }
  window.openPresentation = openPresentation;

  function getPresentationFromCard(card) {
    if (card.matches('.window_advice_card')) {
      const code = card.querySelector('.window_advice_card-bottom button[onclick]')?.getAttribute('onclick') || '';
      const match = code.match(/openArticle\s*\(\s*(\d+)\s*\)/);
      if (match && byId.has(Number(match[1]))) return byId.get(Number(match[1]));
      const text = card.querySelector('.window_advice_card-info h3')?.textContent.trim();
      return byTitle.get(text) || null;
    }
    const text = card.matches('.popular_materials_blok')
      ? card.querySelector('.popular_materials_blok-title')?.textContent.trim()
      : card.querySelector('.content_info-block-title h5')?.textContent.trim();
    return byTitle.get(text) || null;
  }

  // Зчитування обкладинок тільки для карток, які з'явилися на екрані.
  // Це не завантажує одразу десятки великих PDF.
  const nodeArticles = new WeakMap();
  const observedNodes = new Set();
  const visibilityObserver = ('IntersectionObserver' in window)
    ? new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          visibilityObserver.unobserve(entry.target);
          observedNodes.delete(entry.target);
          const id = nodeArticles.get(entry.target);
          if (id != null) renderCover(id);
        }
      }, {rootMargin: '200px'})
    : null;

  function watchCover(node, id) {
    if (!node || nodeArticles.get(node) === id) return;
    nodeArticles.set(node, id);
    if (visibilityObserver) {
      visibilityObserver.observe(node);
      observedNodes.add(node);
    } else {
      renderCover(id);
    }
  }

  function setBackground(node, record, mode = 'contain') {
    if (!node || node.dataset.psyCoverId === String(record.id) &&
        node.dataset.psyCoverVersion === String(record.version)) return;
    node.style.backgroundImage = `url(${JSON.stringify(record.url)})`;
    node.style.backgroundSize = mode;
    node.style.backgroundPosition = 'center';
    node.style.backgroundRepeat = 'no-repeat';
    node.dataset.psyCoverId = String(record.id);
    node.dataset.psyCoverVersion = String(record.version);
  }

  function decorateAllPresentationCards() {
    for (const node of observedNodes) {
      if (!node.isConnected) {
        visibilityObserver?.unobserve(node);
        observedNodes.delete(node);
      }
    }

    document.querySelectorAll('.window_advice_card').forEach(card => {
      const p = getPresentationFromCard(card);
      if (!p) return;
      const cover = covers.get(p.id);
      card.classList.add('psy-presentation-card');
      const photo = card.querySelector('.window_advice_card-img');
      setBackground(photo, {id:p.id, ...cover});
      watchCover(photo, p.id);
      const button = card.querySelector('.window_advice_card-bottom button');
      if (button) {
        if (button.textContent.trim() !== 'Переглянути →') {
          button.textContent = 'Переглянути →';
        }
        button.setAttribute('aria-label', `Переглянути презентацію: ${p.title}`);
      }
    });

    document.querySelectorAll('.popular_materials_blok').forEach(card => {
      const p = getPresentationFromCard(card);
      if (!p) return;
      const cover = covers.get(p.id);
      card.classList.add('psy-presentation-popular-card');
      card.setAttribute('aria-label', `Переглянути презентацію: ${p.title}`);
      const picture = card.querySelector('.popular_materials_blok_up');
      setBackground(picture, {id:p.id, ...cover});
      if (picture) {
        picture.style.setProperty('--popular-bg', `url(${JSON.stringify(cover.url)})`);
        const img = picture.querySelector('img');
        if (img && img.dataset.psyCoverVersion !== String(cover.version)) {
          img.src = cover.url;
          img.dataset.psyCoverVersion = String(cover.version);
        }
      }
      watchCover(picture, p.id);
    });

    document.querySelectorAll('.content_info-block').forEach(block => {
      const p = getPresentationFromCard(block);
      const tips = block.querySelector('.content_info-tips-box');
      if (!p) {
        if (block.classList.contains('psy-presentation-page-block')) {
          block.classList.remove('psy-presentation-page-block');
          if (tips) tips.style.removeProperty('display');
        }
        return;
      }
      const cover = covers.get(p.id);
      block.classList.add('psy-presentation-page-block');
      const picture = block.querySelector('.content_info-block-right');
      setBackground(picture, {id:p.id, ...cover});
      watchCover(picture, p.id);
      const button = block.querySelector('.content_info-button-left');
      if (button && button.textContent.trim() !== 'Переглянути →') {
        button.textContent = 'Переглянути →';
      }
      // CSS на сайті примусово показує прихований [hidden] блок порад.
      if (tips) {
        tips.hidden = true;
        tips.style.display = 'none';
      }
    });
  }

  // Перехоплюємо клік до старих обробників — так працюють навіть
  // популярні картки, які використовують власний addEventListener.
  document.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    const trigger = event.target.closest('button');
    if (!trigger) return;
    const card = trigger.closest('.window_advice_card, .popular_materials_blok, .content_info-block');
    if (!card) return;
    const p = getPresentationFromCard(card);
    if (!p) return;
    const shouldOpen = card.matches('.popular_materials_blok') ||
      trigger.matches('.window_advice_card-bottom button, .content_info-button-left');
    if (!shouldOpen) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openPresentation(p.id);
  }, true);

  const changesObserver = new MutationObserver(decorateAllPresentationCards);
  const targets = [container, ...document.querySelectorAll('.popular_materials_bloks, .content_info-blocks-full')];
  targets.filter(Boolean).forEach(node => changesObserver.observe(node, {childList:true, subtree:true}));

  // Відразу оновлюємо всі ділянки після реєстрації презентацій.
  showArticles(articles);
  if (typeof renderPopularArticles === 'function') renderPopularArticles();
  if (typeof pageArticles !== 'undefined' && typeof renderPageArticles === 'function') {
    Object.keys(pageArticles).forEach(renderPageArticles);
  }
  decorateAllPresentationCards();

  // Переважно бібліотека завантажується лише раз, хоча презентацій багато.
  let pdfjsPromise = null;
  function getPdfJs() {
    if (!pdfjsPromise) {
      pdfjsPromise = import(`${PDFJS_BASE}/pdf.min.mjs`).then(pdfjs => {
        pdfjs.GlobalWorkerOptions.workerSrc = `${PDFJS_BASE}/pdf.worker.min.mjs`;
        return pdfjs;
      });
    }
    return pdfjsPromise;
  }

  async function renderCover(id) {
    const p = byId.get(id);
    const state = covers.get(id);
    if (!p || !state || state.loaded || state.loading) return state?.loading;

    state.loading = (async () => {
      let doc = null;
      try {
        const pdfjs = await getPdfJs();
        doc = await pdfjs.getDocument({url: new URL(p.file, document.baseURI).href}).promise;
        const page = await doc.getPage(1);
        const basic = page.getViewport({scale:1});
        const viewport = page.getViewport({scale: Math.min(1100 / basic.width, 2.5)});
        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const ctx = canvas.getContext('2d', {alpha:false});
        if (!ctx) throw new Error('Canvas недоступний');
        await page.render({canvasContext:ctx, viewport}).promise;
        state.url = canvas.toDataURL('image/png');
        p.image = state.url;
        state.version += 1;
        state.loaded = true;
        decorateAllPresentationCards();
        // Якщо картки перерендерилися після отримання обкладинки, у них уже буде p.image.
      } catch (error) {
        console.warn(`presentation.js: не вдалося прочитати першу сторінку ${p.file}:`, error);
      } finally {
        if (doc) await doc.destroy().catch(() => {});
        state.loading = null;
      }
    })();
    return state.loading;
  }
})();
