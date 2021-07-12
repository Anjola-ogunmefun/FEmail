module.exports = {
  purge: ["./src/**/*.vue"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: {
        'auth-bg': "url('/src/utils/undraw.svg')",
       },
       container: {
        center: true,
      },
      outline: {
        black: '1px solid #dee2e6',
      }
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
      outline: ['hover', 'active'],
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
