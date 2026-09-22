// Single source of truth for PDF templates. The client mirrors these in src/lib/templates.js
const BASE = { body: "#232024", muted: "#6F675F", line: "#E4DFD3" };

const THEMES = {
  onyx: { ...BASE, layout: "executive", band: "#1C1B1F", bandText: "#FFFFFF", bandAccent: "#C9A45C", accent: "#9C7A3C" },
  ivory: { ...BASE, layout: "executive", band: "#FAF7F2", bandText: "#232024", bandAccent: "#A9812F", accent: "#A9812F", bandBorder: "#A9812F" },
  wine: { ...BASE, layout: "executive", band: "#6B2737", bandText: "#FFFFFF", bandAccent: "#E0BF80", accent: "#6B2737" },
  noir: { ...BASE, layout: "atelier", side: "#17161B", sideText: "#EFEAE0", sideMuted: "#A8A196", sideAccent: "#C9A45C", accent: "#9C7A3C" },
  emerald: { ...BASE, layout: "atelier", side: "#0E3B31", sideText: "#EAF3EE", sideMuted: "#9DBBB0", sideAccent: "#D9BC78", accent: "#0E6B55" },
  sapphire: { ...BASE, layout: "atelier", side: "#13284A", sideText: "#EAF0FA", sideMuted: "#9DB0CF", sideAccent: "#D2AE6A", accent: "#1F4E9A" },
};

const TEMPLATE_IDS = Object.keys(THEMES);

module.exports = { THEMES, TEMPLATE_IDS };
