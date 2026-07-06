/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html"],
  theme: {
    extend: {
      colors: { ink: '#0B1F3A', mint: '#22B573', mist: '#F6F9FC' },
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
      boxShadow: {
        soft: '0 24px 70px rgba(11,31,58,.09)',
        card: '0 10px 35px rgba(11,31,58,.06)'
      }
    }
  },
  plugins: []
}
