/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    /* Relevant files from blog + theme */
    "./layouts/**/*.html",
    "./content/**/*.{md,html}",
  ],
  safelist: ["force-dark", "force-light"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        green: {
          ...require("tailwindcss/colors").green,
        },
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
        },
        dark: "#080808",
        light: "#f9f9f9",
        banner: "#DFFF9D",
        pulse: "#1DFAA7",
        logo: "#d9d9d9",
        card: "#161616",
        gray: {
          ...require("tailwindcss/colors").gray,
        },
      },
      fontFamily: {
        sans: [
          '"InterVariable", sans-serif',
          {
            fontFeatureSettings: "'liga' 1, 'calt' 1",
            // fontVariationSettings: '"opsz" 32'
          },
        ],
      },
      animation: {
        marquee:
          "marquee var(--marquee-speed, 20s) linear infinite var(--marquee-direction, forwards)",
      },
      keyframes: {
        marquee: {
          to: { transform: "translateX(-50%)" },
        },
      },
      fontWeight: {
        thin: 100,
        extralight: 200,
        light: 300,
        normal: 400,
      },
      letterSpacing: {
        tighteso: "-.075em",
      },
      backgroundImage: {
        hero: "url('/images/hero_me.webp')",
        "hero-portrait": "url('/images/hero_image_1x.webp')",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "#374151",
            a: {
              color: "#0ea5e9",
              "&:hover": {
                color: "#0284c7",
              },
            },
          },
        },
        dark: {
          css: {
            color: "#d1d5db",
            a: {
              color: "#0ea5e9",
              "&:hover": {
                color: "#38bdf8",
              },
            },
            h1: {
              color: "#fff",
            },
            h2: {
              color: "#fff",
            },
            h3: {
              color: "#fff",
            },
            h4: {
              color: "#fff",
            },
            strong: {
              color: "#fff",
            },
            code: {
              color: "#fff",
            },
            blockquote: {
              color: "#d1d5db",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwind-hamburgers")],
};
