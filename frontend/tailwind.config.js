module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
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
    opacity: ({ after }) => after(['disabled']),
    cursor: ['hover', 'focus'],
    extend: {
      cursor: ['disabled']
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio')
  ]
}
