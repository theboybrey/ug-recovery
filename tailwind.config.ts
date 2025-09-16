import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      boxShadow: {
        "text-sm": "1px 1px 2px rgba(0, 0, 0, 0.5)",
        "text-md": "2px 2px 4px rgba(0, 0, 0, 0.6)",
        "text-lg": "3px 3px 6px rgba(0, 0, 0, 0.8)",
      },
      textShadow: {
        sm: "1px 1px 2px rgba(0, 0, 0, 0.5)",
        md: "2px 2px 4px rgba(0, 0, 0, 0.6)",
        lg: "3px 3px 6px rgba(0, 0, 0, 0.8)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        // Official University of Ghana Colors from Brand Manual
        // Primary: UG Blue (Pantone 294C)
        primary: {
          DEFAULT: "#2f4a75", // UG Blue RGB(47, 74, 117)
          50: "#f0f3f8", // Very light blue tint
          100: "#dde4ef", // Light blue tint
          200: "#b8c9df", // Medium light blue tint
          300: "#8fadce", // Medium blue tint
          400: "#6892bd", // Medium blue
          500: "#4776ac", // Slightly lighter UG Blue
          600: "#2f4a75", // Official UG Blue RGB(47, 74, 117)
          700: "#263d61", // Darker UG Blue
          800: "#1d304d", // Very dark blue
          900: "#152339", // Deepest blue
        },

        // Secondary: UG Gold (Pantone 465C)
        secondary: {
          DEFAULT: "#b79a64", // UG Gold RGB(183, 154, 100)
          50: "#faf8f4", // Very light gold tint
          100: "#f3eedf", // Light gold tint
          200: "#e6d8bf", // Medium light gold tint
          300: "#d9c29f", // Medium gold tint
          400: "#ccac7f", // Medium gold
          500: "#b79a64", // Official UG Gold RGB(183, 154, 100)
          600: "#a68651", // Slightly darker gold
          700: "#8a6d42", // Darker gold
          800: "#6e5434", // Very dark gold
          900: "#523b25", // Deepest gold/brown
        },

        // Neutral grays that complement UG colors
        gray: {
          50: "#f9fafb", // gray-50
          100: "#f3f4f6", // gray-100
          200: "#e5e7eb", // gray-200
          300: "#d1d5db", // gray-300
          400: "#9ca3af", // gray-400
          500: "#6b7280", // gray-500
          600: "#4b5563", // gray-600
          700: "#374151", // gray-700
          800: "#1f2937", // gray-800
          900: "#111827", // gray-900
        },

        // University-themed semantic colors
        sidebar: "#2f4a75", // UG Blue for sidebar
        background: "#faf8f4", // Very light gold tint - warm academic feel
        "background-dim": "#f3eedf", // Light gold tint
        text: "#1f2937", // Dark gray for primary text
        "text-muted": "#6b7280", // Medium gray for secondary text
        "text-light": "#9ca3af", // Light gray for tertiary text

        // Status colors that complement UG theme
        error: "#dc2626", // red-600
        "error-bg": "#fee2e2", // red-100
        alert: "#d97706", // amber-600 (complements gold)
        "alert-bg": "#fef3c7", // amber-100
        success: "#059669", // emerald-600
        "success-bg": "#d1fae5", // emerald-100

        // Accent colors inspired by UG theme
        accent: "#7c3aed", // violet-600 - academic purple
        "accent-light": "#ede9fe", // violet-100
        info: "#0284c7", // sky-600
        "info-light": "#e0f2fe",

        // Card and surface colors with warm academic feel
        "card-bg": "#ffffff", // Pure white for cards
        "card-border": "#e6d8bf", // Light gold tint for borders
        surface: "#faf8f4", // Very light gold background
        "surface-dim": "#f3eedf", // Light gold dimmer surface
        "surface-accent": "#f0f3f8", // Very light blue for accents
      },
      fontFamily: {
        sans: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"], // UG official font
        roboto: ["Roboto", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        GeistMono: ["GeistMono", "monospace"],
        BeVietnamPro: ["BeVietnamPro"],
      },
    },
  },
  plugins: [require("tailwindcss-textshadow"), require("tailwindcss-animate")],
} satisfies Config;

export default config;
