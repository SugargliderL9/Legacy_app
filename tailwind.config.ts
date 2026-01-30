import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        liminal: {
          fog: "#e8e9ed",
          mist: "#d4d6dc",
          stone: "#9a9ca6",
          void: "#6b6d76",
          shadow: "#4a4c54",
          deep: "#2d2e33",
          abyss: "#1a1b1e",
        },
      },

      fontFamily: {
        liminal: ["var(--font-liminal)", "ui-monospace", "monospace"],
      },

      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        float: "float 8s ease-in-out infinite",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },

      backgroundImage: {
        "gradient-liminal":
          "linear-gradient(180deg, #e8e9ed 0%, #d4d6dc 50%, #9a9ca6 100%)",
        "gradient-void":
          "linear-gradient(180deg, #1a1b1e 0%, #2d2e33 100%)",
      },
    },
  },

  plugins: [],
};

export default config;
