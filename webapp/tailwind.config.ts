import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite-react/**/*.js",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      height: {
        96: "24rem",
        104: "26rem",
        112: "28rem",
        128: "32rem",
        144: "36rem",
        160: "40rem",
      },
      width: {
        112: "28rem",
        128: "32rem",
        144: "36rem",
        160: "40rem",
        176: "44rem", //laptop full height.
      },
      fontSize: {
        "2xs": "0.625rem",
        "3xl": "2.75rem",
        "4xl": "3.5rem",
        "5xl": "4rem",
        "6xl": "4.5rem",
      },
      fontFamily: {
        handwriting: ['"Comic Neue"', "cursive"],
      },
      letterSpacing: {
        "widest-2": "0.8rem",
      },
    },
    container: {
      padding: {
        DEFAULT: "1rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
    },
  },
  plugins: [require("flowbite/plugin"), require("tailwind-scrollbar")],
  darkMode: "media",
};
export default config;
