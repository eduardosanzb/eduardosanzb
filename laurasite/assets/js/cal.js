let scriptBody;
let initialSetup = false;

function setupCalScript(C, A, L) {
  if (initialSetup) return;

  let p = function (a, ar) {
    a.q.push(ar);
  };
  let d = C.document;
  C.Cal =
    C.Cal ||
    function () {
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
        const api = function () {
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
  initialSetup = true;
}
setupCalScript(window, "https://app.cal.com/embed/embed.js", "init");

export function initCal() {
  const element = document.getElementById("my-cal-inline");
  if (!element) {
    console.error("Element not found");
    return;
  }

  Cal("init", "15min", { origin: "https://cal.com" });

  const layout = "month_view";
  const theme = localStorage.theme ?? "light";
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

export function refreshCal() {
  const calInlineDiv = document.getElementById("my-cal-inline");
  if (calInlineDiv) {
    calInlineDiv.remove(); // Remove existing calendar
  }

  Cal.loaded = false; // This will reset the Cal and will force the redraw
  createCalInlineDiv();
  initCal();
}
