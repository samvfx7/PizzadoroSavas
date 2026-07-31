(function () {
  var STORAGE_KEY = 'pizza-doro-lang';
  var DEFAULT_LANG = 'en';
  var langCodes = { en: 'EN', el: 'EL', es: 'ES', it: 'IT', de: 'DE', fr: 'FR', nl: 'NL' };

  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  var yearEl = document.getElementById('year');
  var langToggle = document.querySelector('.lang-toggle');
  var langMenu = document.querySelector('.lang-menu');
  var langFlag = document.querySelector('.lang-flag');
  var langCode = document.querySelector('.lang-code');
  var header = document.querySelector('.site-header');

  var currentLang = DEFAULT_LANG;
  var menuOpen = false;

  function t(key) {
    var pack = window.I18N.strings[currentLang] || window.I18N.strings[DEFAULT_LANG];
    return pack[key] || window.I18N.strings[DEFAULT_LANG][key] || key;
  }

  function detectLanguage() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved && window.I18N.strings[saved]) return saved;

    var browser = (navigator.language || navigator.userLanguage || 'en').slice(0, 2).toLowerCase();
    if (window.I18N.strings[browser]) return browser;
    return DEFAULT_LANG;
  }

  function applyLanguage(lang) {
    if (!window.I18N.strings[lang]) lang = DEFAULT_LANG;
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var text = t(key);
      if (text) el.textContent = text;
    });

    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      el.setAttribute('alt', t(el.getAttribute('data-i18n-alt')));
    });

    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
    });

    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria')));
    });

    document.title = t('meta.title');
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', t('meta.description'));

    if (langFlag && langCode) {
      langFlag.textContent = window.I18N.languages[lang].flag;
      langCode.textContent = langCodes[lang];
    }

    langMenu.querySelectorAll('.lang-option').forEach(function (btn) {
      var isActive = btn.getAttribute('data-lang') === lang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', String(isActive));
    });

    if (navToggle) {
      var openKey = navLinks && navLinks.classList.contains('open') ? 'nav.closeMenu' : 'nav.openMenu';
      navToggle.setAttribute('aria-label', t(openKey));
    }
  }

  function buildLangMenu() {
    if (!langMenu) return;

    Object.keys(window.I18N.languages).forEach(function (code) {
      var info = window.I18N.languages[code];
      var li = document.createElement('li');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'lang-option';
      btn.setAttribute('role', 'option');
      btn.setAttribute('data-lang', code);
      btn.innerHTML = '<span class="lang-option-flag">' + info.flag + '</span><span>' + info.label + '</span>';
      btn.addEventListener('click', function () {
        applyLanguage(code);
        closeLangMenu();
      });
      li.appendChild(btn);
      langMenu.appendChild(li);
    });
  }

  function openLangMenu() {
    menuOpen = true;
    langMenu.classList.add('open');
    langToggle.setAttribute('aria-expanded', 'true');
  }

  function closeLangMenu() {
    menuOpen = false;
    langMenu.classList.remove('open');
    langToggle.setAttribute('aria-expanded', 'false');
  }

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  buildLangMenu();
  applyLanguage(detectLanguage());

  if (langToggle && langMenu) {
    langToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      menuOpen ? closeLangMenu() : openLangMenu();
    });

    document.addEventListener('click', function (e) {
      if (!langToggle.contains(e.target) && !langMenu.contains(e.target)) {
        closeLangMenu();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeLangMenu();
    });
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', t(isOpen ? 'nav.closeMenu' : 'nav.openMenu'));
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', t('nav.openMenu'));
      });
    });

    document.addEventListener('click', function (e) {
      if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (header) {
    window.addEventListener('scroll', function () {
      header.style.boxShadow = window.scrollY > 20
        ? '0 2px 16px rgba(26, 20, 16, 0.08)'
        : 'none';
    }, { passive: true });
  }
})();
