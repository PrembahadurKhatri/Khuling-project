/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1A2233",
        navy: {
          DEFAULT: "#303C69",
          light: "#46538A",
          dark: "#232C4F",
        },
        poppins: ['Poppins', 'sans-serif'],
        stone: "#F5F3EE",
        paper: "#FFFFFF",
        teal: {
          DEFAULT: "#12A19B",
          dark: "#0C7A75",
          light: "#4FBFB9",
        },
        gold: {
          DEFAULT: "#F0A22E",
          light: "#F9C05F",
          dark: "#C97F16",
        },
        line: "#DBD5C8",
        linedark: "rgba(255,255,255,0.14)",

        primary: { DEFAULT: "#F0A22E", dark: "#C97F16", light: "#F9C05F" },
        secondary: { DEFAULT: "#303C69", light: "#46538A" },
        surface: "#F5F3EE",
      },
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        serif: ["'Playfair Display'", "Georgia", "serif"],
        body: ["'DM Sans'", "'Segoe UI'", "sans-serif"],
        mono: ["'DM Sans'", "'Segoe UI'", "sans-serif"],
        heading: ["'Playfair Display'", "Georgia", "serif"],
      },
      letterSpacing: {
        widest2: "0.28em",
      },
      maxWidth: {
        prose: "68ch",
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(48, 60, 105, 0.08)",
        card: "0 8px 32px -8px rgba(48, 60, 105, 0.12)",
        elevated: "0 16px 48px -12px rgba(48, 60, 105, 0.18)",
        nav: "0 4px 20px -2px rgba(26, 34, 51, 0.08)",
        glow: "0 0 40px -8px rgba(18, 161, 155, 0.35)",
      },
      backgroundImage: {
        "hero-pattern":
          "radial-gradient(circle at 20% 80%, rgba(240,162,46,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(18,161,155,0.06) 0%, transparent 50%)",
        "navy-gradient": "linear-gradient(135deg, #232C4F 0%, #303C69 50%, #46538A 100%)",
        "gold-shimmer": "linear-gradient(90deg, transparent, rgba(240,162,46,0.15), transparent)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.7s ease-out forwards",
        pulseSoft: "pulseSoft 2.5s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(37, 211, 102, 0.4)" },
          "50%": { boxShadow: "0 0 0 12px rgba(37, 211, 102, 0)" },
        },
      },
    },
  },
  plugins: [],
};
