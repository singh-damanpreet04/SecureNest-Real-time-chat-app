import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,jsx,ts,tsx}", // Include .jsx files
  ],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
};