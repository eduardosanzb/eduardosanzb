/* global Cal */
// TODO: tidy it up and split

let scriptBody;
function setupCalScript(C, A, L) {
  let p = function(a, ar) {
    a.q.push(ar);
  };
  let d = C.document;
  C.Cal =
    C.Cal ||
    function() {
      let cal = C.Cal;
      let ar = arguments;
      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q || [];
        scriptBody = d.createElement("script");
        d.head.appendChild(scriptBody).src = A;
        cal.loaded = true;
      }
      if (ar[0] === L) {
        const api = function() {
          p(api, arguments);
        };
        const namespace = ar[1];
        api.q = api.q || [];
        if (typeof namespace === "string") {
          cal.ns[namespace] = cal.ns[namespace] || api;
          p(cal.ns[namespace], ar);
          p(cal, ["initNamespace", namespace]);
        } else p(cal, ar);
        return;
      }
      p(cal, ar);
    };
}

function initCal() {
  const element = document.getElementById("my-cal-inline");
  if (!element) {
    console.error("Element not found");
    return;
  }

  Cal("init", "15min", { origin: "https://cal.com" });

  const layout = "month_view";
  const theme = localStorage.theme ?? 'light';
  Cal.ns["15min"]("inline", {
    elementOrSelector: "#my-cal-inline",
    config: { layout, theme },
    calLink: "eduardosanzb/30-min-landing-intro",
  });

  Cal.ns["15min"]("ui", {
    theme: theme,

    cssVarsPerTheme: {
      light: { "cal-brand": "#f8f8ff" },
      dark: { "cal-brand": "#080808" },
    },

    hideEventTypeDetails: true,
    layout,
  });
}

function createCalInlineDiv() {
  const newCalInlineDiv = document.createElement("div");
  newCalInlineDiv.id = "my-cal-inline";
  newCalInlineDiv.style.width = "100%";
  newCalInlineDiv.style.height = "100%";
  newCalInlineDiv.style.overflow = "scroll";
  const calSection = document.getElementById("cal-section");
  calSection?.appendChild(newCalInlineDiv); // Append to cal-section
}

function refreshCal() {
  const calInlineDiv = document.getElementById("my-cal-inline");
  if (calInlineDiv) {
    calInlineDiv.remove(); // Remove existing calendar
  }

  Cal.loaded = false; // This will reset the Cal and will force the redraw
  createCalInlineDiv();
  initCal();
}

function changeTheme(theme) {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  localStorage.setItem("theme", theme);
}

window.changeTheme = changeTheme;

/**
 * This script will observe the header and show/hide the secondary header
 * based on the visibility of the primary header
 */
function observeHeader() {
  const landingPageHeader = document.getElementById("first-header");
  const secondaryElement = document.getElementById("secondary-element");

  if (!landingPageHeader) {
    secondaryElement.classList.remove("hidden");
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          secondaryElement?.classList.remove("hidden");
        } else {
          secondaryElement?.classList.add("hidden");
        }
      });
    },
    {
      threshold: 0.3
    },
  );

  // Start observing the primary element
  observer.observe(landingPageHeader);
}

/**
 * This script will observe the sections and based on the bacground color of the visible section
 * will adapt the header
 */
let finalDecision = ["force-light", "force-dark"];
function toggleHeaderTheme(remove, add, who) {
  try {
    const otherHeader = document.getElementById("secondary-element");
    otherHeader.classList.remove(remove);
    otherHeader.classList.add(add);
    finalDecision = [remove, add];
    console.log({ finalDecision, who })
  } catch (error) {
    console.error("toggleHeader", error);
  }
}

function observeSections() {
  const colors = {
    // When the background of the next section is dark
    // I want to force the dark theme to the header

    // dark: [remove, add]
    "rgb(8, 8, 8)": ["force-light", "force-dark"],
    // ligth
    "rgb(249, 249, 249)": ["force-dark", "force-light"],
  };

  const sections = document.querySelectorAll("section");
  if (!sections.length) {
    console.log('No sections found')
    return;
  }
  console.log({ sections });
  let scrollDirection = "down";

  const previousY = new Map();

  const observer = new IntersectionObserver(
    (entries) => {
      console.log(entries)
      entries.forEach((entry) => {
        const currY = entry.boundingClientRect.y;
        const prevY = previousY.get(entry.target);

        if (currY < prevY) {
          scrollDirection = "down";
        }
        if (currY > prevY) {
          scrollDirection = "up";
        }

        if (entry.isIntersecting) {
          const percentage = entry.intersectionRatio * 100;
          const bgColor = window.getComputedStyle(entry.target).backgroundColor;
          const [remove, add] = colors?.[bgColor] ?? ["force-light", "force-dark"];
          console.log({
            target: entry.target.id,
            percentage,
            bgColor,
            ...{ remove, add },
            scrollDirection,
          });

          // In the initial load
          if (percentage > 98) {
            toggleHeaderTheme(remove, add, entry.target.id);
            return
          }
          // when going down the important one is the bigger one
          if (scrollDirection === "down") {
            if (percentage > 95) {
              toggleHeaderTheme(remove, add, entry.target.id);
            }
          }

          // when going down the important one is the smaller one
          if (scrollDirection === "up") {
            if (percentage < 15) {
              toggleHeaderTheme(remove, add, entry.target.id);
            }
          }

        }

        previousY.set(entry.target, currY);
      });
    },
    {
      // Configure the observer options
      threshold: [
        // every pizel
        0, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95, 1,
        // 0.05, 0.91, 0.95, 0.98, 1
      ],
      rootMargin: "0px", // No margin around the viewport
    },
  );

  // Start observing the primary element
  sections.forEach((section) => {
    observer.observe(section);
  });
}

setupCalScript(window, "https://app.cal.com/embed/embed.js", "init");
initCal();

document.getElementById("theme-toggle").addEventListener("click", () => {
  refreshCal();
  toggleHeaderTheme(...finalDecision.reverse(), 'theme-toggle');
  if (document.documentElement.classList.contains("dark")) {
    window.changeTheme("light");
  } else {
    window.changeTheme("dark");
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
  window.changeTheme("dark");
} else {
  window.changeTheme(localStorage.theme);
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
    toggleHeaderTheme(...finalDecision.reverse(), 'prefers-color-scheme');
    if (matches) {
      window.changeTheme("dark");
    } else {
      window.changeTheme("light");
    }
  });

addEventListener("storage", () => {
  refreshCal();
  toggleHeaderTheme(...finalDecision.reverse(), 'storage');
  if (localStorage.theme === "dark") {
    window.changeTheme("dark");
  } else {
    window.changeTheme("light");
  }
});
