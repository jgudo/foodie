const plugin = require('tailwindcss/plugin');

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      'mobile': '420px',
      'tablet': '640px',
      'laptop': '1024px',
      'desktop': '1280px',
    },
    fontFamily: {
      sans: ['SF Pro Display', 'sans-serif'],
    },
    extend: {
      height: {
        '60px': '60px',
        '25rem': '25rem',
      },
      maxHeight: {
        '80vh': '80vh'
      },
      minHeight: {
        '10rem': '10rem'
      },
      width: {
        '30rem': '30rem'
      },
      padding: {
        '60px': '60px',
        '10%': '10%',
        '6%': '6%'
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
    backgroundColor: ['hover', 'focus', 'important'],
    backgroundSize: ['important'],
    backgroundRepeat: ['important'],
    backgroundPosition: ['important'],
    margin: ['first'],
    padding: ['important'],
    textColor: ['important'],
    borderColor: ['important', 'focus'],
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
          return `.${e(`focus${separator}${className}`)}:read-only:focus`
        })
      })

      addVariant('hover', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`hover${separator}${className}`)}:read-only:hover`
        })
      })

      addVariant('important', ({ container }) => {
        container.walkRules(rule => {
          rule.selector = `.\\!${rule.selector.slice(1)}`
          rule.walkDecls(decl => {
            decl.important = true
          })
        })
      });

      // addVariant('first-child', ({ modifySelectors, separator }) => {
      //   modifySelectors(({ className }) => {
      //     return `.${e(`first-child${separator}${className} > *`)}:first-child`
      //   })
      // });
    })
  ]
}
