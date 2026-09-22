const { askClaude, parseJson, AiError } = require("../utils/claude");

const SYSTEM = `You are an elite resume writer and career coach who writes for recruiters and ATS systems.
Rules you never break:
- Use ONLY facts the user gave you. Never invent employers, degrees, tools, dates, or numbers/metrics.
- If the user's material has no numbers, do not add any. Strong verbs and concrete scope are enough.
- Plain text only: no markdown, no asterisks, no headings, no quotation marks around the answer.
- Never use first-person pronouns ("I", "my") in resume text. Use crisp, professional language.
- Prefer specific, concrete wording over buzzwords.`;

const clip = (v, n) => String(v ?? "").slice(0, n);
const TONES = { professional: "polished and professional", confident: "confident and results-driven", concise: "extremely concise and direct" };
const tone = (t) => TONES[t] || TONES.professional;

const brief = (r = {}) => {
  const exp = (r.experience || [])
    .slice(0, 4)
    .map((e) => `${clip(e.role, 80)} at ${clip(e.company, 80)}`)
    .join("; ");
  const edu = (r.education || [])
    .slice(0, 2)
    .map((e) => `${clip(e.degree, 80)}, ${clip(e.institute, 80)}`)
    .join("; ");
  return [
    `Name: ${clip(r.fullName, 80)}`,
    `Target title: ${clip(r.title, 100)}`,
    `Skills: ${(r.skills || []).slice(0, 25).map((s) => clip(s, 40)).join(", ")}`,
    `Experience: ${exp || "none listed"}`,
    `Education: ${edu || "none listed"}`,
  ].join("\n");
};

const toLines = (text) =>
  text
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*[-•*–·\d.)]+\s*/, "").trim())
    .filter(Boolean)
    .join("\n");

const wrap = (fn) => async (req, res) => {
  try {
    res.json(await fn(req.body || {}));
  } catch (err) {
    if (err instanceof AiError) return res.status(err.status).json({ message: err.message });
    console.error(err);
    res.status(500).json({ message: "Something went wrong with the AI assistant." });
  }
};

exports.summary = wrap(async ({ resume, current, tone: t }) => {
  const text = await askClaude({
    system: SYSTEM,
    maxTokens: 400,
    prompt: `Write a resume profile summary (2-3 sentences, max 60 words), tone: ${tone(t)}.
${current ? `Improve and tighten this existing draft, keeping its facts:\n"""${clip(current, 1500)}"""\n` : "Write it from scratch from the candidate details."}
Candidate details:
${brief(resume)}
Return only the summary text.`,
  });
  return { text: text.replace(/\s*\n+\s*/g, " ").trim() };
});

exports.bullets = wrap(async ({ resume, item, kind = "experience", tone: t }) => {
  const isProject = kind === "project";
  const title = isProject ? clip(item?.name, 120) : `${clip(item?.role, 120)} at ${clip(item?.company, 120)}`;
  const text = await askClaude({
    system: SYSTEM,
    maxTokens: 500,
    prompt: `Write ${isProject ? "2-3" : "3-4"} resume achievement bullet points for this ${isProject ? "project" : "role"}: ${title}.
Tone: ${tone(t)}. Each bullet starts with a strong past-tense action verb (present tense only if the role is current), max 22 words, one per line, no bullet symbols.
${isProject && item?.tech ? `Tech used: ${clip(item.tech, 200)}\n` : ""}${item?.details ? `Base them on and improve these raw notes (keep every fact, add none):\n"""${clip(item.details, 1500)}"""` : "The user gave no notes, so write realistic, modest, non-numeric bullets that fit the title and the candidate's skills, and keep them generic enough to be safely edited."}
Candidate skills for context: ${(resume?.skills || []).slice(0, 20).map((s) => clip(s, 40)).join(", ")}
Return only the bullet lines.`,
  });
  return { text: toLines(text) };
});

exports.skills = wrap(async ({ resume }) => {
  const text = await askClaude({
    system: SYSTEM + "\nRespond with JSON only.",
    maxTokens: 300,
    prompt: `Suggest up to 10 additional skills this candidate could credibly list, relevant to their target title and existing skills. Skip skills they already have.
${brief(resume)}
Return ONLY a JSON array of short strings, e.g. ["Docker","Unit Testing"].`,
  });
  const arr = parseJson(text);
  const have = new Set((resume?.skills || []).map((s) => String(s).toLowerCase()));
  const skills = (Array.isArray(arr) ? arr : [])
    .map((s) => String(s).trim())
    .filter((s) => s && s.length <= 40 && !have.has(s.toLowerCase()))
    .slice(0, 10);
  return { skills };
});

const resumeAsText = (r = {}) =>
  [
    `${clip(r.fullName, 80)} — ${clip(r.title, 100)}`,
    `Summary: ${clip(r.summary, 800)}`,
    `Skills: ${(r.skills || []).slice(0, 40).join(", ")}`,
    ...(r.experience || []).slice(0, 6).map((e) => `Experience: ${clip(e.role, 80)} @ ${clip(e.company, 80)}. ${clip(e.details, 600)}`),
    ...(r.projects || []).slice(0, 5).map((p) => `Project: ${clip(p.name, 80)} (${clip(p.tech, 100)}). ${clip(p.details, 400)}`),
    ...(r.education || []).slice(0, 3).map((e) => `Education: ${clip(e.degree, 80)}, ${clip(e.institute, 80)}`),
  ].join("\n");

exports.analyze = wrap(async ({ resume, jobDescription }) => {
  if (!jobDescription || String(jobDescription).trim().length < 40) {
    throw new AiError("Paste the full job description (at least a few lines) so I can analyse it.", 400);
  }
  const text = await askClaude({
    system: SYSTEM + "\nRespond with JSON only.",
    maxTokens: 900,
    prompt: `Compare this resume with the job description like a strict ATS + recruiter.

RESUME:
${resumeAsText(resume)}

JOB DESCRIPTION:
${clip(jobDescription, 7000)}

Return ONLY JSON with this exact shape:
{"matchScore": <integer 0-100>, "verdict": "<one sentence>", "matchedKeywords": ["..."], "missingKeywords": ["..."], "suggestions": ["<3-5 specific, actionable edits, each under 30 words>"]}
missingKeywords must be genuine skills/tools/terms from the job description that the resume lacks (max 10, short). Do not suggest lying about experience.`,
  });
  const j = parseJson(text);
  return {
    matchScore: Math.max(0, Math.min(100, Math.round(Number(j.matchScore) || 0))),
    verdict: clip(j.verdict, 300),
    matchedKeywords: (j.matchedKeywords || []).map((s) => clip(s, 40)).slice(0, 15),
    missingKeywords: (j.missingKeywords || []).map((s) => clip(s, 40)).slice(0, 10),
    suggestions: (j.suggestions || []).map((s) => clip(s, 240)).slice(0, 5),
  };
});

exports.coverLetter = wrap(async ({ resume, jobDescription, company, tone: t }) => {
  if (!jobDescription || String(jobDescription).trim().length < 40) {
    throw new AiError("Paste the job description first so the cover letter can be tailored.", 400);
  }
  const text = await askClaude({
    system: SYSTEM,
    maxTokens: 800,
    prompt: `Write a tailored cover letter (3 short paragraphs, max 230 words), tone: ${tone(t)}.
${company ? `Company: ${clip(company, 100)}\n` : ""}Start with "Dear Hiring Manager," and end with "Sincerely," followed by the candidate's name. Do not invent facts.

RESUME:
${resumeAsText(resume)}

JOB DESCRIPTION:
${clip(jobDescription, 6000)}

Return only the letter.`,
  });
  return { text };
});
