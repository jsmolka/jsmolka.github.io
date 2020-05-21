const html = document.getElementsByTagName('html')[0];

function updateMetaThemeColor() {
  const meta = document.querySelector('meta[name=theme-color]');

  meta.setAttribute(
    'content',
    html.classList.contains('dark-mode')
      ? '#252627'
      : '#fafafa'
  );
}

function toggleTheme() {
  const dark = html.classList.toggle('dark-mode');

  window.localStorage.setItem('theme', dark ? 'dark' : 'light');

  updateMetaThemeColor();
}

function initTheme() {
  const theme = window.localStorage.getItem('theme');

  html.classList.toggle('dark-mode', theme !== 'light');

  updateMetaThemeColor();
}

initTheme();
