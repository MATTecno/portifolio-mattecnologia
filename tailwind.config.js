/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0D0D0D',   // preto carvão
        primary: '#1E90FF',      // azul elétrico
        secondary: '#9B5FFF',    // roxo neon
        ice: '#E5E5E5',          // branco gelo
      },
      borderRadius: {
        mdplus: '6px',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(30,144,255,0.35)', // efeito glow sutil
      },
    },
  },
  plugins: [],
}
