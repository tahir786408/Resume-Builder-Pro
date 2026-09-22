/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        onyx: "#141317",
        onyxlight: "#221F26",
        onyxcard: "#1B191F",
        ivory: "#FAF7F2",
        paper: "#F5F2EC",
        panel: "#FFFFFF",
        gold: "#C9A45C",
        goldsoft: "#DFC48B",
        golddeep: "#A9812F",
        wine: "#6B2737",
        winesoft: "#8A3A4C",
        text: "#211F24",
        muted: "#7A7168",
        line: "#E7E1D4",
        danger: "#B23A34",
        success: "#3F7D58",
      },
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'Work Sans'", "sans-serif"],
      },
      borderRadius: {
        sm: "4px",
        xl: "14px",
      },
      boxShadow: {
        lux: "0 1px 2px rgba(20,19,23,0.06), 0 20px 48px -20px rgba(20,19,23,0.35)",
        panel: "0 1px 0 rgba(255,255,255,0.04) inset, 0 12px 32px -16px rgba(0,0,0,0.45)",
        gold: "0 8px 24px -8px rgba(201,164,92,0.45)",
        card: "0 1px 2px rgba(20,19,23,0.04), 0 12px 28px -14px rgba(20,19,23,0.18)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg,#E4CE9C 0%,#C9A45C 45%,#9C7A3C 100%)",
        "onyx-radial": "radial-gradient(1200px 600px at 20% -10%, rgba(201,164,92,0.12), transparent 60%)",
      },
      keyframes: {
        shimmer: { "0%": { backgroundPosition: "-400px 0" }, "100%": { backgroundPosition: "400px 0" } },
        floatSlow: { "0%,100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-10px)" } },
      },
      animation: {
        shimmer: "shimmer 1.8s linear infinite",
        floatSlow: "floatSlow 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
