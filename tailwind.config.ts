import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  content: [
    // On regarde dans le dossier app (vu dans ta liste)
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // On regardera aussi dans le dossier components qu'on va créer
    "./components/**/*.{js,ts,jsx,tsx,mdx}", 
    // Au cas où tu utilises src plus tard
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          DEFAULT: "#7C8777", // Vert principal
          light: "#8F998B",
          dark: "#6A7566",
        },
        cream: {
          DEFAULT: "#EEEEE2", // Crème principal
          dim: "#E0E0D0",
        },
        alert: {
          red: "#EF4444",
          orange: "#F97316",
          green: "#22C55E",
        }
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "sans-serif"], 
        serif: ["var(--font-playfair)", "serif"],
      },
      backgroundImage: {
        'glow-radial': 'radial-gradient(circle, rgba(124, 135, 119, 0.2) 0%, rgba(124, 135, 119, 0) 60%)',
      }
    },
  },
  plugins: [
    forms,
  ],
};
export default config;