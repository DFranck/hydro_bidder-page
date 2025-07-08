import type { Config } from "tailwindcss"
import plugin from "tailwindcss/plugin"
import { PluginUtils } from "tailwindcss/types/config"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx,js,jsx,mdx}",
    "./components/**/*.{ts,tsx,js,jsx,mdx}",
    "./app/**/*.{ts,tsx,js,jsx,mdx}",
    "./src/**/*.{ts,tsx,js,jsx,mdx}",
  ],
  prefix: "",
  theme: {
    extend: {
      container: {
        screens: {
          "2xl": "1400px",
        },
      },
      fontFamily: {
        inter: ["Inter"],
      },
      fontSize: {
        "10": "0.625rem",
      },
      borderColor: {
        DEFAULT: "rgba(255, 255, 255, 0.2)",
      },
      colors: {
        palette: {
          beige: "#FFE1B8",
          cyan: "#00D1FF",
          blue: "#0061FF",
          green: "#00FFC2",
          red: "#FF7B51",
          text: "#080815",
          yellow: "#FFCE04",
        },
      },
      containers: {
        "2xs": "16rem",
      },
      width: {
        "md": "800px",
        "base": "550px",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
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
      },
      typography: ({ theme }: PluginUtils) => ({
        DEFAULT: {
          css: {
            "--tw-prose-invert-bullets": theme("colors.palette.green"),
          },
        },
      }),
    },
  },
  plugins: [
    plugin(function ({ addBase, theme }) {
      addBase({
        html: {
          scrollPaddingTop: theme("spacing.12"),
        },
        body: {
          color: theme("colors.white"),
          backgroundColor: "black",
        },
        "*": {
          scrollbarColor: `${theme("colors.palette.green")} black`,
          scrollBehavior: "smooth",
        },
        "*::-webkit-scrollbar": {
          height: theme("spacing.2"),
          width: theme("spacing.2"),
        },
        "*::-webkit-scrollbar-track": {
          background: "black",
        },
        "*::-webkit-scrollbar-thumb": {
          background: theme("colors.palette.green"),
          borderRadius: theme("spacing.8"),
        },
        "a, button, input, textarea": {
          touchAction: "manipulation",
        },
      })
    }),
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
  ],
} satisfies Config

export default config
