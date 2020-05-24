const html = document.getElementsByTagName('html')[0];

function updateMetaThemeColor() {
  const meta = document.querySelector('meta[name=theme-color]');

  meta.setAttribute(
    'content',
    html.classList.contains('dark-mode')
      ? '#24292E'
      : '#f5f5f5'
  );
}

function toggleTheme() {
  const dark = html.classList.toggle('dark-mode');

  window.localStorage.setItem('theme', dark ? 'dark' : 'light');

  updateMetaThemeColor();
}

function initTheme() {
  const theme = window.localStorage.getItem('theme');

  html.classList.toggle('dark-mode', theme != null && theme === 'dark');

  updateMetaThemeColor();
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

initTheme();
initPrism();
