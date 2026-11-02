import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dfc: {
          dark: "#0b132b",
          navy: "#1c2541",
          blue: "#3a506b",
          teal: "#5bc0be",
          emerald: "#10b981",
          gold: "#f59e0b",
          red: "#ef4444",
        },
      },
    },
  },
  plugins: [],
};
export default config;
