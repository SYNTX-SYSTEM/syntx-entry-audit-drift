import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0a0e1a",
        panel: "#111827",
        accent: "#00d9ff",
        success: "#22c55e",
        muted: "#9fb3c8",
        textPrimary: "#e5eefb"
      },
      boxShadow: {
        focus: "0 0 8px rgba(0,217,255,0.16)"
      }
    }
  },
  plugins: []
}

export default config
