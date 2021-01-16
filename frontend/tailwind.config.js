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
        '20rem': '20rem',
        '25rem': '25rem',
      },
      maxHeight: {
        '80vh': '80vh',
      },
      minHeight: {
        '10rem': '10rem',
        '18rem': '18rem'
      },
      width: {
        '20rem': '20rem',
        '30rem': '30rem',
        '40rem': '40rem'
      },
      padding: {
        '60px': '60px',
        '20%': '20%',
        '10%': '10%',
        '6%': '6%'
      },
      zIndex: {
        '9999': '9999'
      },
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
    borderRadius: ['important'],
    textColor: ['important', 'hover'],
    borderColor: ['important', 'focus', 'hover'],
    outlineOffset: ['hover'],
    border: ['hover'],
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

      addVariant('before', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`before${separator}${className}`)}::before`;
        });
      });
      addVariant('after', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => {
          return `.${e(`after${separator}${className}`)}::after`;
        });
      });
    }),
    plugin(({ addUtilities }) => {
      const contentUtilities = {
        '.content': {
          content: 'attr(data-content)',
        },
        '.content-before': {
          content: 'attr(data-before)',
        },
        '.content-after': {
          content: 'attr(data-after)',
        },
      };

      addUtilities(contentUtilities, ['before', 'after']);
    }),
  ]
}
