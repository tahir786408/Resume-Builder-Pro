const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const { THEMES } = require("./themes");

const W = 595.28;
const H = 841.89;

// ---------- fonts (same families as the live preview; falls back to built-ins) ----------
const FONT_FILES = {
  display: ["playfair-display", "playfair-display-latin-600-normal.woff", "Times-Bold"],
  displayBold: ["playfair-display", "playfair-display-latin-700-normal.woff", "Times-Bold"],
  displayItalic: ["playfair-display", "playfair-display-latin-500-italic.woff", "Times-Italic"],
  body: ["work-sans", "work-sans-latin-400-normal.woff", "Helvetica"],
  bodyMedium: ["work-sans", "work-sans-latin-500-normal.woff", "Helvetica-Bold"],
  bodySemi: ["work-sans", "work-sans-latin-600-normal.woff", "Helvetica-Bold"],
};

function registerFonts(doc) {
  const F = {};
  for (const [key, [pkg, file, fallback]] of Object.entries(FONT_FILES)) {
    const p = path.join(__dirname, "..", "node_modules", "@fontsource", pkg, "files", file);
    try {
      if (fs.existsSync(p)) {
        doc.registerFont(key, p);
        F[key] = key;
        continue;
      }
    } catch (_) {}
    F[key] = fallback;
  }
  return F;
}

// ---------- helpers ----------
const bulletLines = (text = "") =>
  String(text)
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*[-•*–·]\s*/, "").trim())
    .filter(Boolean);

const cleanUrl = (u = "") => String(u).replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "");

function contactItems(r) {
  return [r.email, r.phone, r.location].filter(Boolean);
}
function linkItems(r) {
  return [r.website, r.linkedin, r.github].filter(Boolean).map(cleanUrl);
}

function renderResumePdf(resume, outStream) {
  const t = THEMES[resume.template] || THEMES.onyx;
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 0, left: 0, right: 0, bottom: 0 },
    info: {
      Title: `${resume.fullName || "Resume"} — Resume`,
      Author: resume.fullName || "",
      Creator: "Resume Builder Pro",
    },
  });
  const F = registerFonts(doc);
  doc.pipe(outStream);

  const atelier = t.layout === "atelier";
  const SIDE_W = 182;
  const PAD = 48;

  // main column geometry
  const col = atelier
    ? { x: SIDE_W + 32, w: W - SIDE_W - 32 - 40 }
    : { x: PAD, w: W - PAD * 2 };
  const BOTTOM = H - 44;
  const TOP_NEXT = atelier ? 44 : 46;
  let y = 0;

  const drawChrome = (first) => {
    if (atelier) {
      doc.rect(0, 0, SIDE_W, H).fill(t.side);
    } else if (first) {
      doc.rect(0, 0, W, 132).fill(t.band);
      if (t.bandBorder) doc.rect(0, 132, W, 3).fill(t.bandBorder);
    }
  };

  const newPage = () => {
    doc.addPage();
    drawChrome(false);
    y = TOP_NEXT;
  };
  const ensure = (h) => {
    if (y + h > BOTTOM) newPage();
  };
  const h = (text, font, size, opts = {}) => {
    doc.font(F[font]).fontSize(size);
    return doc.heightOfString(text, opts);
  };

  drawChrome(true);

  // ---------- header ----------
  const name = resume.fullName || "Your Name";
  if (!atelier) {
    doc.fillColor(t.bandText).font(F.display).fontSize(27).text(name, PAD, 34, { width: col.w, lineBreak: false });
    if (resume.title)
      doc.fillColor(t.bandAccent).font(F.displayItalic).fontSize(12.5).text(resume.title, PAD, 70, { width: col.w, lineBreak: false });
    const contact = contactItems(resume).join("     |     ");
    doc.fillColor(t.bandText).font(F.body).fontSize(8.5).text(contact, PAD, 98, { width: col.w, lineBreak: false });
    const links = linkItems(resume).join("     |     ");
    if (links) doc.fillColor(t.bandAccent).font(F.body).fontSize(8.5).text(links, PAD, 111, { width: col.w, lineBreak: false });
    y = 165;
  } else {
    doc.fillColor(t.body).font(F.display).fontSize(25).text(name, col.x, 44, { width: col.w });
    y = doc.y + 2;
    if (resume.title) {
      doc.fillColor(t.accent).font(F.displayItalic).fontSize(12).text(resume.title, col.x, y, { width: col.w });
      y = doc.y + 8;
    }
    doc.moveTo(col.x, y).lineTo(col.x + 36, y).lineWidth(2).strokeColor(t.accent).stroke();
    y += 24;
  }

  // ---------- section heading (main column) ----------
  const heading = (label) => {
    ensure(74);
    doc.fillColor(t.body).font(F.display).fontSize(10.5).text(label.toUpperCase(), col.x, y, {
      width: col.w,
      characterSpacing: 1.6,
      lineBreak: false,
    });
    y += 17;
    doc.moveTo(col.x, y).lineTo(col.x + col.w, y).lineWidth(0.6).strokeColor(t.line).stroke();
    doc.moveTo(col.x, y).lineTo(col.x + 30, y).lineWidth(1.6).strokeColor(t.accent).stroke();
    y += 11;
  };

  const paragraph = (text, size = 9.6) => {
    const opts = { width: col.w, lineGap: 2.4 };
    ensure(Math.min(h(text, "body", size, opts), 120));
    doc.fillColor(t.body).font(F.body).fontSize(size).text(text, col.x, y, opts);
    y = doc.y + 16;
  };

  const bullets = (lines, size = 9.3) => {
    const indent = 11;
    lines.forEach((line) => {
      const opts = { width: col.w - indent, lineGap: 2 };
      ensure(h(line, "body", size, opts) + 4);
      doc.fillColor(t.accent).font(F.bodySemi).fontSize(size).text("•", col.x + 1, y, { lineBreak: false });
      doc.fillColor(t.body).font(F.body).fontSize(size).text(line, col.x + indent, y, opts);
      y = doc.y + 3.2;
    });
  };

  const entryHeader = (title, right, sub, firstBulletH = 0) => {
    const rightW = right ? 118 : 0;
    const titleOpts = { width: col.w - rightW - 6 };
    const th = h(title || " ", "displayBold", 11, titleOpts);
    ensure(th + 26 + firstBulletH);
    doc.fillColor(t.body).font(F.display).fontSize(11).text(title || "", col.x, y, titleOpts);
    if (right)
      doc.fillColor(t.muted).font(F.body).fontSize(8.4).text(right, col.x + col.w - rightW, y + 2, {
        width: rightW,
        align: "right",
        lineBreak: false,
      });
    y += th + 1.5;
    if (sub) {
      doc.fillColor(t.accent).font(F.bodyMedium).fontSize(9).text(sub, col.x, y, { width: col.w });
      y = doc.y + 4.5;
    }
  };

  // ---------- skills as pills (main column, executive only) ----------
  const skillPills = (skills) => {
    const size = 8.6;
    const padX = 8;
    const pillH = 17;
    let x = col.x;
    ensure(pillH + 6);
    skills.forEach((s) => {
      doc.font(F.bodyMedium).fontSize(size);
      const w = doc.widthOfString(s) + padX * 2;
      if (x + w > col.x + col.w) {
        x = col.x;
        y += pillH + 6;
        ensure(pillH + 6);
      }
      doc.roundedRect(x, y, w, pillH, 8.5).lineWidth(0.7).strokeColor(t.accent).stroke();
      doc.fillColor(t.body).text(s, x + padX, y + 4.6, { lineBreak: false });
      x += w + 6;
    });
    y += pillH + 18;
  };

  // ---------- atelier sidebar (painted on page 1, before main content flows) ----------
  if (atelier) {
    const sx = 24;
    const sw = SIDE_W - 48;
    let sy = 46;
    const sideHeading = (label) => {
      doc.fillColor(t.sideAccent).font(F.display).fontSize(9.5).text(label.toUpperCase(), sx, sy, {
        width: sw,
        characterSpacing: 1.6,
        lineBreak: false,
      });
      sy += 15;
      doc.moveTo(sx, sy).lineTo(sx + 22, sy).lineWidth(1.2).strokeColor(t.sideAccent).stroke();
      sy += 9;
    };
    const sideText = (text, o = {}) => {
      if (!text || sy > H - 44) return;
      const { font = "body", size = 8.5, color = t.sideText, gap = 4 } = o;
      doc.fillColor(color).font(F[font]).fontSize(size).text(text, sx, sy, { width: sw, lineGap: 1.6 });
      sy = doc.y + gap;
    };

    const contact = [...contactItems(resume), ...linkItems(resume)];
    if (contact.length) {
      sideHeading("Contact");
      contact.forEach((c) => sideText(c, { gap: 5 }));
      sy += 12;
    }
    if (resume.skills?.length) {
      sideHeading("Skills");
      resume.skills.forEach((s) => {
        if (sy > H - 44) return;
        doc.circle(sx + 2, sy + 4.4, 1.5).fill(t.sideAccent);
        doc.fillColor(t.sideText).font(F.body).fontSize(8.6).text(s, sx + 11, sy, { width: sw - 11, lineGap: 1.4 });
        sy = doc.y + 3.6;
      });
      sy += 12;
    }
    if (resume.education?.length) {
      sideHeading("Education");
      resume.education.forEach((e) => {
        sideText(e.degree, { font: "bodySemi", size: 8.8, gap: 1.5 });
        sideText(e.institute, { color: t.sideMuted, gap: 1.5 });
        sideText([e.duration, e.grade].filter(Boolean).join("  ·  "), { color: t.sideMuted, size: 8, gap: 9 });
      });
      sy += 6;
    }
    if (resume.certifications?.length) {
      sideHeading("Certifications");
      resume.certifications.forEach((c) => {
        sideText(c.name, { font: "bodySemi", size: 8.6, gap: 1.5 });
        sideText([c.issuer, c.year].filter(Boolean).join("  ·  "), { color: t.sideMuted, size: 8, gap: 8 });
      });
      sy += 6;
    }
    if (resume.languages?.length) {
      sideHeading("Languages");
      resume.languages.forEach((l) => sideText(l, { gap: 3 }));
    }
  }

  // ---------- content ----------
  if (resume.summary) {
    heading("Profile");
    paragraph(resume.summary);
  }

  if (!atelier && resume.skills?.length) {
    heading("Skills");
    skillPills(resume.skills);
  }

  if (resume.experience?.length) {
    heading("Experience");
    resume.experience.forEach((exp) => {
      const lines = bulletLines(exp.details);
      const sub = [exp.company, exp.location].filter(Boolean).join("  ·  ");
      const first = lines[0] ? h(lines[0], "body", 9.3, { width: col.w - 11, lineGap: 2 }) : 0;
      entryHeader(exp.role, exp.duration, sub, first);
      bullets(lines);
      y += 8;
    });
    y += 2;
  }

  if (resume.projects?.length) {
    heading("Projects");
    resume.projects.forEach((p) => {
      const lines = bulletLines(p.details);
      const sub = [p.tech, p.link && cleanUrl(p.link)].filter(Boolean).join("  ·  ");
      const first = lines[0] ? h(lines[0], "body", 9.3, { width: col.w - 11, lineGap: 2 }) : 0;
      entryHeader(p.name, null, sub, first);
      bullets(lines);
      y += 8;
    });
    y += 2;
  }

  if (!atelier) {
    if (resume.education?.length) {
      heading("Education");
      resume.education.forEach((e) => {
        entryHeader(e.degree, e.duration, [e.institute, e.grade].filter(Boolean).join("  ·  "));
        y += 8;
      });
    }
    if (resume.certifications?.length) {
      heading("Certifications");
      resume.certifications.forEach((c) => {
        entryHeader(c.name, c.year, c.issuer);
        y += 4;
      });
      y += 4;
    }
    if (resume.languages?.length) {
      heading("Languages");
      paragraph(resume.languages.join("   •   "));
    }
  }

  doc.end();
}

module.exports = { renderResumePdf, bulletLines };
