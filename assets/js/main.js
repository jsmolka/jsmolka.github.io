const html = document.getElementsByTagName('html')[0];

let onThemeChanged = dark => {};

function isDarkTheme() {
  return html.classList.contains("dark-mode");
}

function updateMetaThemeColor(dark) {
  const meta = document.querySelector('meta[name=theme-color]');

  meta.setAttribute('content', dark ? '#242933' : '#F2F4F8');
}

function toggleTheme() {
  const dark = html.classList.toggle('dark-mode');

  window.localStorage.setItem('theme', dark ? 'dark' : 'light');

  updateMetaThemeColor(dark);
  onThemeChanged(dark);

  return dark;
}

function initTheme() {
  const theme = window.localStorage.getItem('theme');
  const dark = html.classList.toggle('dark-mode', theme === 'dark');

  updateMetaThemeColor(dark);
}

function initPrism() {
  Prism.languages.armasm = {
    comment: {
      pattern: /;.*/,
      greedy: true
    },
    keyword: /\b(?:r(\d+)|pc|lr|sp)\b/,
    number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i
  };

  const keywords = Prism.languages.cpp.keyword.source.split('|');
  keywords.splice(1, 0, 'u8|u16|u32|u64|s8|s16|s32|s64|uint');
  Prism.languages.cpp.keyword = new RegExp(keywords.join('|'));
}

function initHeader() {
  const header = document.getElementById("header");
  window.addEventListener('scroll', function() {
    header.classList.toggle('header-shadow', window.scrollY > 0);
  });
}

initTheme();
initPrism();
initHeader();
