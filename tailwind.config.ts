import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
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
        'text-sm': '1px 1px 2px rgba(0, 0, 0, 0.5)',
        'text-md': '2px 2px 4px rgba(0, 0, 0, 0.6)',
        'text-lg': '3px 3px 6px rgba(0, 0, 0, 0.8)',
      },
      textShadow: {
        'sm': '1px 1px 2px rgba(0, 0, 0, 0.5)',
        'md': '2px 2px 4px rgba(0, 0, 0, 0.6)',
        'lg': '3px 3px 6px rgba(0, 0, 0, 0.8)',
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
        primary: "#3f000f",
        "primary-100": "#3f000f1A",
        secondary: "#100c08",
        sidebar: "#100c08",
        background: "#F5F5F5",
        text: "#333333",
        "tb-text": "#717171",
        gray: "#B0BEC5",
        "gray-light": "#EBEBEC",
        error: '#FF3B30',
        alert: '#FFD700',
        success: '#28A745'
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        GeistMono: ["GeistMono", "monospace"],
        BeVietnamPro: ["BeVietnamPro"],
      },
    },
  },
  plugins: [require('tailwindcss-textshadow'), require("tailwindcss-animate")],
} satisfies Config

export default config