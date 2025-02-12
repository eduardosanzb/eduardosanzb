
/**
 * This script will observe the header and show/hide the secondary header
 * based on the visibility of the primary header
 */
export function observeHeader() {
  const landingPageHeader = document.getElementById("first-header");
  const secondaryElement = document.getElementById("secondary-element");

  if (!landingPageHeader) {
    secondaryElement.classList.remove("hidden");
    return
  }

  // the landing header is leaving the viewport so we show the secondary header
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          secondaryElement.classList.remove("hidden");
        }
      });
    },
    {
      threshold: 0.1,
    },
  );

  // We observe the landing header once is about to come back
  const observer2 = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          secondaryElement.classList.add("hidden")
        }
      });
    },
    {
      threshold: 0,
      margin: "-" + landingPageHeader.offsetHeight + "px",
    }
  );

  // Start observing the primary element
  observer.observe(landingPageHeader);
  observer2.observe(landingPageHeader);
}

/**
 * This script will observe the sections and based on the bacground color of the visible section
 * will adapt the header
 */
let finalDecision = ["force-light", "force-dark"];
export function toggleHeaderTheme(...params) {
  let safeParams = params
  if (safeParams.length === 0) {
    safeParams = [...finalDecision.reverse, 'latest-reversed']
  }
  const [remove, add, who] = safeParams;

  try {
    const otherHeader = document.getElementById("secondary-element");
    otherHeader.classList.remove(remove);
    otherHeader.classList.add(add);
    finalDecision = [remove, add];
    console.debug({ finalDecision, who })
  } catch (error) {
    console.error("toggleHeader", error);
  }
}

export function observeSections() {
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
    return;
  }

  let scrollDirection = "down";
  const previousY = new Map();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const currY = entry.boundingClientRect.y;
        const prevY = previousY.get(entry.target);

        const viewportHeight = window.innerHeight;
        const val = entry.intersectionRect.height / viewportHeight

        if (currY < prevY) {
          scrollDirection = "down";
        }
        if (currY > prevY) {
          scrollDirection = "up";
        }

        if (entry.isIntersecting) {
          // const percentage = entry.intersectionRatio * 100;
          const percentage = (entry.intersectionRect.height / viewportHeight) * 100;
          const bgColor = window.getComputedStyle(entry.target).backgroundColor;
          const [remove, add] = colors?.[bgColor] ?? ["force-light", "force-dark"];
          console.debug({
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
            if (percentage > 90) {
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
      threshold: [
        0, 0.5, 0.3, 0.7, 0.1, 0.15, 0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95, 0.96, 0.97, 0.98, 0.99, 1,
      ],
    },
  );

  // Start observing the primary element
  sections.forEach((section) => {
    observer.observe(section);
  });
}

const tham = document.querySelector(".tham");
const mobileMenu = document.getElementById("mobile-menu");
let isMenuOpen = false;

export const hideMenu = () => {
  console.log('hideMenu');
  mobileMenu.classList.remove('translate-y-0');
  mobileMenu.classList.add('translate-y-full');
  document.body.style.overflow = 'auto';
  isMenuOpen = false;
  tham.classList.toggle('tham-active');
}

tham.addEventListener('click', () => {
  tham.classList.toggle('tham-active');
  if (isMenuOpen) {
    mobileMenu.classList.remove('translate-y-0');
    mobileMenu.classList.add('translate-y-full');
    document.body.style.overflow = 'auto';
  } else {
    mobileMenu.classList.remove('translate-y-full');
    mobileMenu.classList.add('translate-y-0');
    document.body.style.overflow = 'hidden';
  }
  isMenuOpen = !isMenuOpen;
});
