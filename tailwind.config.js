/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./index.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},

    fontFamily: {
      lato_thin: "Lato_100Thin",
      lato_regular: "Lato_400Regular",
      lato_bold: "Lato_700Bold",
      ssp_thin: "SourceSansPro_300Light",
      ssp_regular: "SourceSansPro_400Regular",
      ssp_semibold: "SourceSansPro_600SemiBold",
      ssp_bold: "SourceSansPro_700Bold",
    },
  },
  plugins: [],
};
