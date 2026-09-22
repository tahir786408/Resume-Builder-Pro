import { getTemplate, bulletLines, cleanUrl } from "../lib/templates";

const Section = ({ title, accent, line, children }) =>
  children ? (
    <section className="mb-4 last:mb-0">
      <h3
        className="text-[10px] font-semibold tracking-[0.14em] uppercase pb-1 mb-2 border-b"
        style={{ color: "#232024", borderColor: line }}
      >
        <span className="border-b-2 pb-1" style={{ borderColor: accent }}>
          {title}
        </span>
      </h3>
      {children}
    </section>
  ) : null;

function Bullets({ text, accent }) {
  const lines = bulletLines(text);
  if (!lines.length) return null;
  return (
    <ul className="mt-1 space-y-1">
      {lines.map((l, i) => (
        <li key={i} className="text-[10.5px] leading-relaxed text-text flex items-baseline gap-2">
          <span
            className="shrink-0 inline-block h-[3.5px] w-[3.5px] rounded-full relative top-[-2px]"
            style={{ background: accent }}
          />
          <span>{l}</span>
        </li>
      ))}
    </ul>
  );
}

function Entry({ title, sub, right, details, accent }) {
  if (!title && !sub && !details) return null;
  return (
    <div className="mb-3 last:mb-0">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[12px] font-semibold font-display text-text">{title || "—"}</p>
        {right && <p className="text-[9px] text-muted shrink-0">{right}</p>}
      </div>
      {sub && (
        <p className="text-[10px] italic font-medium" style={{ color: accent }}>
          {sub}
        </p>
      )}
      <Bullets text={details} accent={accent} />
    </div>
  );
}

export default function ResumePreview({ resume }) {
  const t = getTemplate(resume.template);
  const atelier = t.layout === "atelier";
  const contact = [resume.email, resume.phone, resume.location].filter(Boolean);
  const links = [resume.website, resume.linkedin, resume.github].filter(Boolean).map(cleanUrl);

  const summary = resume.summary && (
    <p className="text-[10.5px] leading-relaxed text-text">{resume.summary}</p>
  );

  const experience = resume.experience?.length > 0 && (
    <div>
      {resume.experience.map((e, i) => (
        <Entry
          key={i}
          title={e.role}
          sub={[e.company, e.location].filter(Boolean).join("  ·  ")}
          right={e.duration}
          details={e.details}
          accent={t.accent}
        />
      ))}
    </div>
  );

  const projects = resume.projects?.length > 0 && (
    <div>
      {resume.projects.map((p, i) => (
        <Entry
          key={i}
          title={p.name}
          sub={[p.tech, p.link && cleanUrl(p.link)].filter(Boolean).join("  ·  ")}
          details={p.details}
          accent={t.accent}
        />
      ))}
    </div>
  );

  const education = resume.education?.length > 0 && (
    <div>
      {resume.education.map((e, i) => (
        <Entry
          key={i}
          title={e.degree}
          sub={[e.institute, e.grade].filter(Boolean).join("  ·  ")}
          right={e.duration}
          accent={t.accent}
        />
      ))}
    </div>
  );

  const certifications = resume.certifications?.length > 0 && (
    <div>
      {resume.certifications.map((c, i) => (
        <Entry key={i} title={c.name} sub={c.issuer} right={c.year} accent={t.accent} />
      ))}
    </div>
  );

  const skillsPills = resume.skills?.length > 0 && (
    <div className="flex flex-wrap gap-1.5">
      {resume.skills.map((s, i) => (
        <span
          key={i}
          className="text-[9.5px] font-medium px-2.5 py-1 rounded-full border"
          style={{ borderColor: t.accent, color: "#232024" }}
        >
          {s}
        </span>
      ))}
    </div>
  );

  const languages = resume.languages?.length > 0 && (
    <p className="text-[10.5px] text-text">{resume.languages.join("   •   ")}</p>
  );

  return (
    <div className="bg-white shadow-xl mx-auto w-full max-w-[560px] aspect-[210/297] overflow-y-auto scroll-slim ring-1 ring-black/5">
      {atelier ? (
        <div className="flex min-h-full">
          <aside className="w-[34%] shrink-0 px-4 py-6" style={{ background: t.side, color: t.sideText }}>
            {contact.length + links.length > 0 && (
              <div className="mb-5">
                <p
                  className="text-[9px] font-semibold tracking-[0.18em] uppercase mb-2"
                  style={{ color: t.sideAccent }}
                >
                  Contact
                </p>
                <div className="space-y-1">
                  {[...contact, ...links].map((c, i) => (
                    <p key={i} className="text-[9.5px] break-words" style={{ color: t.sideText }}>
                      {c}
                    </p>
                  ))}
                </div>
              </div>
            )}
            {skillsPills && (
              <div className="mb-5">
                <p
                  className="text-[9px] font-semibold tracking-[0.18em] uppercase mb-2"
                  style={{ color: t.sideAccent }}
                >
                  Skills
                </p>
                <div className="space-y-1">
                  {resume.skills.map((s, i) => (
                    <p key={i} className="text-[9.5px] flex items-baseline gap-2" style={{ color: t.sideText }}>
                      <span
                        className="shrink-0 inline-block h-[3.5px] w-[3.5px] rounded-full relative top-[-2px]"
                        style={{ background: t.sideAccent }}
                      />
                      {s}
                    </p>
                  ))}
                </div>
              </div>
            )}
            {education && (
              <div className="mb-5">
                <p
                  className="text-[9px] font-semibold tracking-[0.18em] uppercase mb-2"
                  style={{ color: t.sideAccent }}
                >
                  Education
                </p>
                <div className="space-y-2.5">
                  {resume.education.map((e, i) => (
                    <div key={i}>
                      <p className="text-[9.5px] font-semibold" style={{ color: t.sideText }}>
                        {e.degree}
                      </p>
                      <p className="text-[9px]" style={{ color: t.sideMuted }}>
                        {e.institute}
                      </p>
                      <p className="text-[8.5px]" style={{ color: t.sideMuted }}>
                        {[e.duration, e.grade].filter(Boolean).join("  ·  ")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {certifications && (
              <div className="mb-5">
                <p
                  className="text-[9px] font-semibold tracking-[0.18em] uppercase mb-2"
                  style={{ color: t.sideAccent }}
                >
                  Certifications
                </p>
                <div className="space-y-2">
                  {resume.certifications.map((c, i) => (
                    <div key={i}>
                      <p className="text-[9.5px] font-semibold" style={{ color: t.sideText }}>
                        {c.name}
                      </p>
                      <p className="text-[8.5px]" style={{ color: t.sideMuted }}>
                        {[c.issuer, c.year].filter(Boolean).join("  ·  ")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {languages && (
              <div>
                <p
                  className="text-[9px] font-semibold tracking-[0.18em] uppercase mb-2"
                  style={{ color: t.sideAccent }}
                >
                  Languages
                </p>
                <p className="text-[9.5px]" style={{ color: t.sideText }}>
                  {resume.languages.join(" • ")}
                </p>
              </div>
            )}
          </aside>
          <div className="flex-1 px-6 py-6">
            <h1 className="font-display text-xl font-semibold text-text">{resume.fullName || "Your Name"}</h1>
            {resume.title && (
              <p className="font-display italic text-[11px] mt-0.5" style={{ color: t.accent }}>
                {resume.title}
              </p>
            )}
            <div className="h-[2px] w-8 mt-2 mb-4" style={{ background: t.accent }} />
            <Section title="Profile" accent={t.accent} line="#E4DFD3">
              {summary}
            </Section>
            <Section title="Experience" accent={t.accent} line="#E4DFD3">
              {experience}
            </Section>
            <Section title="Projects" accent={t.accent} line="#E4DFD3">
              {projects}
            </Section>
          </div>
        </div>
      ) : (
        <div>
          <div
            className="px-8 py-7"
            style={{ background: t.band, borderBottom: t.bandBorder ? `3px solid ${t.bandBorder}` : "none" }}
          >
            <h1 className="font-display text-2xl font-semibold" style={{ color: t.bandText }}>
              {resume.fullName || "Your Name"}
            </h1>
            {resume.title && (
              <p className="font-display italic text-sm mt-1" style={{ color: t.bandAccent }}>
                {resume.title}
              </p>
            )}
            {contact.length > 0 && (
              <p className="text-[10px] mt-3" style={{ color: t.bandText, opacity: 0.85 }}>
                {contact.join("   |   ")}
              </p>
            )}
            {links.length > 0 && (
              <p className="text-[10px] mt-1" style={{ color: t.bandAccent }}>
                {links.join("   |   ")}
              </p>
            )}
          </div>
          <div className="px-8 py-6">
            <Section title="Profile" accent={t.accent} line="#E4DFD3">
              {summary}
            </Section>
            <Section title="Skills" accent={t.accent} line="#E4DFD3">
              {skillsPills}
            </Section>
            <Section title="Experience" accent={t.accent} line="#E4DFD3">
              {experience}
            </Section>
            <Section title="Projects" accent={t.accent} line="#E4DFD3">
              {projects}
            </Section>
            <Section title="Education" accent={t.accent} line="#E4DFD3">
              {education}
            </Section>
            <Section title="Certifications" accent={t.accent} line="#E4DFD3">
              {certifications}
            </Section>
            <Section title="Languages" accent={t.accent} line="#E4DFD3">
              {languages}
            </Section>
          </div>
        </div>
      )}
    </div>
  );
}
