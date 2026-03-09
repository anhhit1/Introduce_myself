/* ============================================
   Language Switcher — VI ↔ EN
   ============================================ */
(function () {
  const htmlEl   = document.documentElement;
  const langBtn  = document.getElementById('lang-toggle');
  const langLabel = document.getElementById('lang-label');

  if (!langBtn || !langLabel) return;

  function setLanguage(lang) {
    htmlEl.setAttribute('lang', lang);
    localStorage.setItem('portfolio-lang', lang);
    langLabel.textContent = lang === 'vi' ? 'EN' : 'VI';
  }

  langBtn.addEventListener('click', function () {
    var currentLang = htmlEl.getAttribute('lang');
    setLanguage(currentLang === 'vi' ? 'en' : 'vi');
  });

  // Initialize from saved preference or default to Vietnamese
  var savedLang = localStorage.getItem('portfolio-lang') || 'vi';
  setLanguage(savedLang);
})();
