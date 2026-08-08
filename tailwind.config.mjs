/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,md,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,md,mdx}",
    "./src/content/**/*.{js,ts,jsx,tsx,md,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        border: "var(--border)",
        primary: "var(--primary)",
        muted: "var(--muted)",
        quantum: "var(--quantum)",
        philosophy: "var(--philosophy)",
      },
      fontFamily: {
        sans: ["Geist Variable", "ui-sans-serif", "system-ui"],
        mono: ["JetBrains Mono Variable", "ui-monospace", "monospace"],
      },
    },
  },
}

export default config
