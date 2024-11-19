import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sepia: {
          100: '#f4f1ea',
          200: '#e8e1d3',
          700: '#8c7a5a',
          900: '#5c4f3a',
        },
        greenia: {
          100: '#f4f1ea',
          200: '#a7f3d0',
          700: '#065f46',
          900: '#5c4f3a',
        },
        blunia: "#1d4ed8",
        pinky: '#a16207'
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;
