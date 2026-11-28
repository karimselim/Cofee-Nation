/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Dark coffee theme
        page: "#0a0a0a",
        surface: "#131313",
        surface2: "#1b1b1b",
        line: "#2a2724",
        ink: "#f3ece1",
        muted: "#a49c92",
        accent: "#c9a97e",
        accentHover: "#b3925f",
        onAccent: "#1a1208",

        // Older token names, kept so components that still use them follow the theme
        textColor: "#a49c92",
        firstColor: "#c9a97e",
        hoveredColor: "#b3925f",
        buttonColor: "#c9a97e",
        unactiveText: "#8a837a",
        btHovered: "#2c2a26",
        hoveredGreyBtn: "#202020",
        greyBtn: "#171717",
        footerColor: "#0f0f0f",
        footerTextColor: "#e9e1d5",
      },
      fontFamily: {
        sans: ["Poppins", "system-ui", "sans-serif"],
      },
      boxShadow: {
        primary: "0px 6px 20px 0px rgba(0,0,0,0.55)",
        glow: "0 0 0 1px #2a2724, 0 18px 40px -24px rgba(0,0,0,0.9)",
      },
      backgroundImage: {
        auth: "url('/public/images/cafe-interior.webp')",
        history: "url('/public/images/cold-brew.webp')",
        cart: "url('/public/images/iced-dark.webp')",
        landing: "url('/public/images/hero-beans.webp')",
      },
    },
  },
  plugins: [],
};
