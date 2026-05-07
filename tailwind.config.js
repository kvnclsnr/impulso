module.exports = {
  content: ['./index.html', './js/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        ocean: { 400: '#38bdf8', 500: '#0ea5e9', 600: '#0284c7' },
        coral: { 400: '#fb7185', 500: '#f43f5e' },
        lime: { 400: '#a3e635', 500: '#84cc16' },
        violet: { 400: '#a78bfa', 500: '#8b5cf6' },
      },
    },
  },
};
