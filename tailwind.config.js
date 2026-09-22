/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#FAF9F5",
          soft: "#F3F1EA",
          card: "#FFFFFF",
        },
        ink: {
          DEFAULT: "#052652",
          soft: "#2C4A6E",
          muted: "#4E6072",
          faint: "#A6B2C0",
        },
        line: {
          DEFAULT: "#E4E1D8",
          soft: "#ECEAE2",
        },
        // Single brand accent, extracted from the KAWA logo ("system" wordmark).
        // Raw logo green (#00C408) fails WCAG AA as text/fill (~2.3:1) — accent.DEFAULT
        // and accent.hover are darkened versions of the same hue that pass AA (5.2:1 / 6.3:1).
        // accent.bright keeps the true logo value for large decorative use only.
        accent: {
          bright: "#00C408",
          DEFAULT: "#007A30",
          hover: "#046C2E",
          soft: "#E3F7E9",
          line: "#B7E6C6",
        },
        // Minimal semantic colors (never decorative, always paired with icon + label).
        warn: {
          DEFAULT: "#B4560A",
          soft: "#FBEEE0",
          line: "#F0D3AE",
        },
        // VIP : jaune/or distinct de l'orange "warn" (en attente) pour ne pas
        // confondre les deux signaux dans la SummaryBar / les badges.
        vip: {
          DEFAULT: "#7A5D00",
          soft: "#FFF3BE",
          line: "#E8CD6B",
        },
        danger: {
          DEFAULT: "#B3261E",
          soft: "#FBEAE9",
          line: "#F0C6C3",
        },
      },
      fontFamily: {
        display: ["\"Baloo 2\"", "\"Plus Jakarta Sans\"", "system-ui", "sans-serif"],
        body: ["\"Plus Jakarta Sans\"", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(5,38,82,0.04), 0 8px 24px rgba(5,38,82,0.06)",
        panel: "-16px 0 40px rgba(5,38,82,0.10)",
        pop: "0 12px 32px rgba(5,38,82,0.14)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
