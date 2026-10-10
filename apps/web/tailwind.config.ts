import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "Menlo", "monospace"],
      },
      colors: {
        // Design-token aliases — always reference CSS vars
        background: "var(--bg-base)",
        foreground: "var(--fg-primary)",
        surface: "var(--bg-surface)",
        sunken: "var(--bg-sunken)",
        border: "var(--border)",
        "border-strong": "var(--border-strong)",

        // Accent (amber)
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          dim: "var(--accent-dim)",
          foreground: "var(--accent-fg)",
        },

        // Semantic
        ok: {
          DEFAULT: "var(--ok)",
          dim: "var(--ok-dim)",
        },
        err: {
          DEFAULT: "var(--err)",
          dim: "var(--err-dim)",
        },
        warn: {
          DEFAULT: "var(--warn)",
          dim: "var(--warn-dim)",
        },

        // Keep shadcn compatibility aliases
        primary: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-fg)",
        },
        secondary: {
          DEFAULT: "var(--bg-sunken)",
          foreground: "var(--fg-primary)",
        },
        muted: {
          DEFAULT: "var(--bg-sunken)",
          foreground: "var(--fg-muted)",
        },
        destructive: {
          DEFAULT: "var(--err)",
          foreground: "#ffffff",
        },
        success: {
          DEFAULT: "var(--ok)",
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "var(--bg-surface)",
          foreground: "var(--fg-primary)",
        },
        popover: {
          DEFAULT: "var(--bg-surface)",
          foreground: "var(--fg-primary)",
        },
        input: "var(--border)",
        ring: "var(--accent)",
        chart: {
          "1": "var(--accent)",
          "2": "var(--ok)",
          "3": "var(--err)",
          "4": "var(--fg-secondary)",
          "5": "var(--warn)",
        },
      },
      borderRadius: {
        // Unified radius system — no more dual-radius conflict
        "card": "var(--r-card)",      // 12px
        "input": "var(--r-input)",    // 8px
        "badge": "var(--r-badge)",    // 6px
        // Shadcn compatibility
        "lg": "var(--r-card)",
        "md": "var(--r-input)",
        "sm": "var(--r-badge)",
      },
      boxShadow: {
        "card": "var(--shadow-sm)",
        "raised": "var(--shadow-md)",
        "soft": "var(--shadow-sm)",   // legacy alias
      },
      fontSize: {
        // Enforce 12px floor for labels (accessibility)
        "label": ["0.75rem", { lineHeight: "1rem", letterSpacing: "0.08em", fontWeight: "600" }],
      },
      keyframes: {
        "gauge-fill": {
          "0%": { width: "0%" },
          "100%": { width: "var(--gauge-target)" },
        },
        "count-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "score-reveal": {
          "0%": { "stroke-dashoffset": "251" },
          "100%": { "stroke-dashoffset": "var(--score-offset)" },
        },
      },
      animation: {
        "gauge-fill": "gauge-fill 0.8s cubic-bezier(0.25,0.46,0.45,0.94) forwards",
        "count-up": "count-up 0.35s ease forwards",
        "fade-up": "fade-up 0.35s cubic-bezier(0.25,0.46,0.45,0.94) forwards",
        "score-reveal": "score-reveal 0.8s cubic-bezier(0.25,0.46,0.45,0.94) forwards",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
export default config;
