const plugin = require('tailwindcss/plugin');

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      'mobile': '420px',
      'tablet': '640px',
      // => @media (min-width: 640px) { ... }
      'laptop': '1024px',
      'desktop': '1280px',
    },
    fontFamily: {
      sans: ['SF Pro Display', 'sans-serif'],
    },
    extend: {
      height: {
        '60px': '60px'
      },
      padding: {
        '60px': '60px'
      },
      zIndex: {
        '9999': '9999'
      }
    },
    default: {
      button: {
        '&:disabled': {
          cursor: 'not-allowed',
          opacity: 0.4,
        }
      }
    }
  },
  variants: {
    cursor: ['hover', 'focus'],
    extend: {
      cursor: ['disabled'],
      opacity: ['disabled', 'readonly'],
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    plugin(function ({ addVariant, e }) {
      addVariant('readonly', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`readonly${separator}${className}`)}:read-only`
        })
      })

      addVariant('focus', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`focus-readonly${separator}${className}`)}:read-only:focus`
        })
      })

      addVariant('hover', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`hover-readonly${separator}${className}`)}:read-only:hover`
        })
      })
    })
  ]
}
