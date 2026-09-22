// Mirrors server/utils/themes.js so the live preview matches the exported PDF exactly.
export const TEMPLATES = [
  { id: "onyx", label: "Onyx", layout: "executive", swatch: ["#1C1B1F", "#C9A45C"], band: "#1C1B1F", bandText: "#FFFFFF", accent: "#9C7A3C", bandAccent: "#C9A45C" },
  { id: "ivory", label: "Ivory", layout: "executive", swatch: ["#FAF7F2", "#A9812F"], band: "#FAF7F2", bandText: "#232024", accent: "#A9812F", bandAccent: "#A9812F", bandBorder: "#A9812F" },
  { id: "wine", label: "Wine", layout: "executive", swatch: ["#6B2737", "#E0BF80"], band: "#6B2737", bandText: "#FFFFFF", accent: "#6B2737", bandAccent: "#E0BF80" },
  { id: "noir", label: "Noir", layout: "atelier", swatch: ["#17161B", "#C9A45C"], side: "#17161B", sideText: "#EFEAE0", sideMuted: "#A8A196", sideAccent: "#C9A45C", accent: "#9C7A3C" },
  { id: "emerald", label: "Emerald", layout: "atelier", swatch: ["#0E3B31", "#D9BC78"], side: "#0E3B31", sideText: "#EAF3EE", sideMuted: "#9DBBB0", sideAccent: "#D9BC78", accent: "#0E6B55" },
  { id: "sapphire", label: "Sapphire", layout: "atelier", swatch: ["#13284A", "#D2AE6A"], side: "#13284A", sideText: "#EAF0FA", sideMuted: "#9DB0CF", sideAccent: "#D2AE6A", accent: "#1F4E9A" },
];

export const getTemplate = (id) => TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];

export const EMPTY_EXPERIENCE = { role: "", company: "", location: "", duration: "", details: "" };
export const EMPTY_EDUCATION = { degree: "", institute: "", duration: "", grade: "" };
export const EMPTY_PROJECT = { name: "", link: "", tech: "", details: "" };
export const EMPTY_CERTIFICATION = { name: "", issuer: "", year: "" };

export const bulletLines = (text = "") =>
  String(text)
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*[-•*–·]\s*/, "").trim())
    .filter(Boolean);

export const cleanUrl = (u = "") => String(u).replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "");
