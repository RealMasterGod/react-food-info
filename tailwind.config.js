/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        myGreenLight: "#d9ffa7",
        myGreen: "#155815",
        myYellow: "#FFCA4B"
      },
      fontFamily: {
        'Matemasie': ['Matemasie',"Gill Sans", "Gill Sans MT", 'Calibri',"Trebuchet MS", 'sans-serif'],
        'Gloria': ['Gloria Hallelujah','Matemasie',"Gill Sans", "Gill Sans MT", 'Calibri',"Trebuchet MS", 'sans-serif']
      },
      screens: {
        'xs': '438px'
      }
    },
  },
  plugins: [],
}

