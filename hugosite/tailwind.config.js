/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    /* Relevant files from blog + theme */
    "./layouts/**/*.html",
    "./content/**/*.{md,html}",

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
        dark: '#080808',
        light: '#f8f8f8',
        banner: '#DFFF9D'

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
      keyframes:{
        marquee: {
          'to': { transform: 'translateX(-50%)' },
        },
      },
      fontWeight: {
        thin: 100,
        extralight: 200,
      },
      letterSpacing: {
        tightest: '-.075em',
      },
      backgroundImage: {
        'hero-pattern': "url('/images/hero-pattern.svg')",
        'footer-texture': "url('/images/footer-texture.png')",
        'hero': "url('/images/hero_1x.webp')",
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
