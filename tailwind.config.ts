import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      fontSize: {
        xs: ["0.8rem", { lineHeight: "1.4" }]
      },
      colors: {
        sb: {
          ocean: "#0B3C49",   // deep Indian Ocean
          lagoon: "#0F6F7C",  // turquoise lagoon
          sand: "#F3E2C7",    // warm sand
          shell: "#F9F3EB",   // light shell background
          mist: "#E5EEF2",    // soft misty blue
          ink: "#111827",     // dark text
          night: "#020617",   // near-black for rich contrast
          coral: "#F9735B"    // accent (sunset coral)
        }
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"]
      },
      boxShadow: {
        "soft-elevated":
          "0 18px 45px rgba(15, 111, 124, 0.20)" // soft luxury shadow
      }
    }
  },
  plugins: []
};

export default config;
