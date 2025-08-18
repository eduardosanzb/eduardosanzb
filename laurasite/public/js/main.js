/* global Cal */

let scriptBody;
function cally(C, A, L) {
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
}

function initCal() {
  Cal("init", "15min", { origin: "https://cal.com" });
  Cal.ns["15min"]("ui", {
    hideEventTypeDetails: false,
    layout: "month_view",
    theme: localStorage.theme,
  });
  Cal.ns["15min"]("inline", {
    elementOrSelector: "#my-cal-inline",
    config: { layout: "month_view", theme: localStorage.theme },
    calLink: "eduardosanzb/15min",
  });
}

cally(window, "https://app.cal.com/embed/embed.js", "init");
initCal();

function refreshCal() {
  const calInlineDiv = document.getElementById("my-cal-inline");
  if (calInlineDiv) {
    calInlineDiv.remove(); // Remove existing calendar
    Cal.loaded = false;
    cally(window, "https://app.cal.com/embed/embed.js", "init");
    const newCalInlineDiv = document.createElement("div");
    newCalInlineDiv.id = "my-cal-inline";
    newCalInlineDiv.style.width = "100%";
    newCalInlineDiv.style.height = "100%";
    newCalInlineDiv.style.overflow = "scroll";
    const calSection = document.getElementById("cal-section");
    calSection.appendChild(newCalInlineDiv); // Append to cal-section
  }
  initCal();
}

document.getElementById("theme-toggle").addEventListener("click", refreshCal);

addEventListener("storage", refreshCal);

matchMedia("(prefers-color-scheme: dark)").addEventListener(
  "change",
  refreshCal,
);
