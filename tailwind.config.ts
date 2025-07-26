// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'poke-blue': '#5DB9FF',
        'poke-light-blue': '#E0F1FF',
        'poke-dark-text': '#333333',
        'poke-light-text': '#888888',
        'stat-hp': '#FF5959',
        'stat-atk': '#F5AC78',
        'stat-def': '#FAE078',
        'stat-satk': '#9DB7F5',
        'stat-sdef': '#A7DB8D',
        'stat-spd': '#FA92B2',
      },
      borderRadius: {
        '4xl': '2rem',
      },

            keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-in-out',
      },
    },
  },
  plugins: [],
};
export default config;