/** @type {import('tailwindcss').Config} */
// Design tokens — derived from the KKC mark (navy skyline, teal hands, ochre
// disc) and the "engineering monograph" direction: warm stone paper, hairline
// rules, a restrained serif for editorial moments, mono for survey/spec data.
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1A2233",        // near-black, navy-tinted charcoal for text
        navy: {
          DEFAULT: "#303C69",  // exact skyline navy sampled from the logo
          light: "#46538A",
          dark: "#232C4F",
        },
        stone: "#F5F3EE",      // warm paper background (not stark white)
        paper: "#FFFFFF",
        teal: {
          DEFAULT: "#12A19B",  // exact hands teal sampled from the logo
          dark: "#0C7A75",
          light: "#4FBFB9",
        },
        gold: {
          DEFAULT: "#F0A22E",  // exact disc gold sampled from the logo
          light: "#F9C05F",
          dark: "#C97F16",
        },
        line: "#DBD5C8",       // hairline rule on stone
        linedark: "rgba(255,255,255,0.14)", // hairline rule on navy

        // Legacy aliases (kept so the admin dashboard, which intentionally
        // stays a plain utilitarian panel rather than the editorial public
        // site, doesn't need a parallel token system)
        primary: { DEFAULT: "#F0A22E", dark: "#C97F16", light: "#F9C05F" },
        secondary: { DEFAULT: "#303C69", light: "#46538A" },
        surface: "#F5F3EE",
      },
      fontFamily: {
        display: ["'Poppins'", "'Segoe UI'", "sans-serif"],
        serif: ["'Poppins'", "'Segoe UI'", "sans-serif"],
        body: ["'Poppins'", "'Segoe UI'", "sans-serif"],
        mono: ["'Poppins'", "'Segoe UI'", "sans-serif"],
        heading: ["'Poppins'", "'Segoe UI'", "sans-serif"], // legacy alias
      },
      letterSpacing: {
        widest2: "0.28em",
      },
      maxWidth: {
        prose: "68ch",
      },
    },
  },
  plugins: [],
};
