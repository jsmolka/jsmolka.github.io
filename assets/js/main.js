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

function initHeader() {
  const header = document.getElementById("header");
  window.addEventListener('scroll', function() {
    header.classList.toggle('header-shadow', window.scrollY > 0);
  });
}

initTheme();
initHeader();
