/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./js/**/*.{js,jsx,ts,tsx}','./index.html'],
  theme: {
    extend: {
      backgroundImage:{
        'background-gradient':'linear-gradient(90deg, #e3ffe7 0%, #d9e7ff 100%)'
      },
      colors:{
        'active_shadow': '#7dff7d',
        'deactive_shadow': '#ff7d88',
      },
      fontFamily:{
        'Comfortaa': ['Comfortaa', 'cursive'],
      },
      boxShadow:{
        'qr-container': '0 20px 15px -15px rgba(0, 0, 0, 0.5)',
        'closebtn-shadow':'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px',
        'dialog-shadow':'rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px',
        'qr-2': 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px'
      }
    },
  },
  plugins: [],
}
