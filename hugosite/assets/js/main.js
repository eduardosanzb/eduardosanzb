import {initCal, refreshCal} from './assets/js/cal.js'
import {toggleHeaderTheme, observeHeader, observeSections} from './assets/js/header.js'
import {changeTheme} from './assets/js/change-theme.js'
import{hideMenu} from './assets/js/header.js'

window.hideMenu = hideMenu;

initCal();

document.getElementById("theme-toggle").addEventListener("click", () => {
  refreshCal();
  toggleHeaderTheme();
  if (document.documentElement.classList.contains("dark")) {
    changeTheme("light");
  } else {
    changeTheme("dark");
  }
});

document.getElementById('copy-email').addEventListener('click', (ev) => {
  const copyLabel = 'Copied!';
  if (ev.target.innerText === copyLabel) {
    return;
  }
  const buttonEl = ev.currentTarget;

  buttonEl.setAttribute('disabled', 'true');
  const originalText = ev.target.innerText;

  navigator.clipboard.writeText(window.params.email);

  setTimeout(() => {
    ev.target.innerText = copyLabel;
    setTimeout(() => {
      ev.target.innerText = originalText;
      buttonEl.removeAttribute('disabled');
    }, 1000)
  });
});


// This needs to wait for the main.js to load; so we can use the dark mode toggle
if (
  !localStorage.theme &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  changeTheme("dark");
} else {
  changeTheme(localStorage.theme);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", (e) => {
    observeHeader();
    observeSections();
  });
} else {
  setTimeout(() => {
    observeSections();
  }, 1000)

  observeHeader();
}

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", ({ matches }) => {
    refreshCal();
    toggleHeaderTheme();
    if (matches) {
      changeTheme("dark");
    } else {
      changeTheme("light");
    }
  });

addEventListener("storage", () => {
  refreshCal();
  toggleHeaderTheme();
  if (localStorage.theme === "dark") {
    changeTheme("dark");
  } else {
    changeTheme("light");
  }
});
