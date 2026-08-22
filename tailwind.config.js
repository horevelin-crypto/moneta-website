/** @type {import('tailwindcss').Config} */
module.exports = {
  // FIGYELEM: a styles.css-t MINDEN oldal használja, ezért itt minden oldalnak
  // szerepelnie kell. Ha csak az index.html van felsorolva, a build kitörli az
  // aloldalak osztályait. (2026-08-21: emiatt hiányzott a .pt-3 és a .tracking-wide.)
  // A _mockup-* mappa belső munkapéldány, nem kell bele.
  content: [
    "./index.html",
    "./*/index.html",
    "./*/*/index.html",
    "!./_mockup-fooldal-oldalsav/**",
    "!./node_modules/**"
  ],
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
