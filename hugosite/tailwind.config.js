/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    /* Relevant files from blog + theme */
    "./layouts/**/*.html",
    "./content/**/*.{md,html}",

  ],
  safelist: [
    'force-dark',
    'force-light',
    { pattern: /^bg-\[url\(.*\)\]$/ },
    { pattern: /^(pt|pb|pl|pr|px|py)-\d{1,9}$/ },
    { pattern: /^gap-\d{1,9}$/ },
    { pattern: /^text-\d{1,9}xl$/ },
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
        },
        red: {
          ...require('tailwindcss/colors').red,
        },
        green: {
          ...require('tailwindcss/colors').green,
        },
        dark: '#080808',
        light: '#cfcfcf',
        white: '#f8f8ff',
        banner: '#DFFF9D',
        pulse: '#1DFAA7',

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
        marquee: 'marquee 20s linear infinite forwards',
      },
      keyframes: {
        marquee: {
          'to': { transform: 'translateX(-50%)' },
        },
      },
      fontWeight: {
        thin: 100,
        extralight: 200,
        light: 300,
        normal: 400,
      },
      letterSpacing: {
        tighteso: '-.075em',
      },
      backgroundImage: {
        'hero': "url('/images/hero_1x.webp')",
        'hero-fallback': "url('/images/hero_fb.webp')",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#374151',
            a: {
              color: '#0ea5e9',
              '&:hover': {
                color: '#0284c7',
              },
            },
          },
        },
        dark: {
          css: {
            color: '#d1d5db',
            a: {
              color: '#0ea5e9',
              '&:hover': {
                color: '#38bdf8',
              },
            },
            h1: {
              color: '#fff',
            },
            h2: {
              color: '#fff',
            },
            h3: {
              color: '#fff',
            },
            h4: {
              color: '#fff',
            },
            strong: {
              color: '#fff',
            },
            code: {
              color: '#fff',
            },
            blockquote: {
              color: '#d1d5db',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
