import { useCallback, useEffect, useRef, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import ResumePreview from "../components/ResumePreview";
import Logo from "../components/ui/Logo";
import Button from "../components/ui/Button";
import PersonalSection from "../components/editor/PersonalSection";
import SummarySection from "../components/editor/SummarySection";
import SkillsSection from "../components/editor/SkillsSection";
import ExperienceSection from "../components/editor/ExperienceSection";
import ProjectsSection from "../components/editor/ProjectsSection";
import EducationSection from "../components/editor/EducationSection";
import CertificationsSection from "../components/editor/CertificationsSection";
import LanguagesSection from "../components/editor/LanguagesSection";
import DesignSection from "../components/editor/DesignSection";
import AnalyzeModal from "../components/editor/AnalyzeModal";
import CoverLetterModal from "../components/editor/CoverLetterModal";
import ShareModal from "../components/editor/ShareModal";
import { Download, LogOut, Target, Wand2, Share2, User2 } from "lucide-react";

const NAV = [
  { id: "sec-personal", label: "Personal" },
  { id: "sec-summary", label: "Summary" },
  { id: "sec-skills", label: "Skills" },
  { id: "sec-experience", label: "Experience" },
  { id: "sec-projects", label: "Projects" },
  { id: "sec-education", label: "Education" },
  { id: "sec-certifications", label: "Certifications" },
  { id: "sec-languages", label: "Languages" },
  { id: "sec-design", label: "Design" },
];

export default function Editor() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const [resume, setResume] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [modal, setModal] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const saveTimer = useRef(null);
  const lastSaved = useRef(null);
  const latest = useRef(null);

  useEffect(() => {
    api
      .get("/resume")
      .then(({ data }) => {
        setResume(data);
        lastSaved.current = JSON.stringify(data);
      })
      .catch(() => toast.error("Could not load your resume."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = useCallback(
    async (data) => {
      setSaving(true);
      try {
        const { data: saved } = await api.put("/resume", data);
        lastSaved.current = JSON.stringify(saved);
        setSavedAt(new Date());
        return saved;
      } catch (err) {
        toast.error("Could not save your changes.");
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [toast]
  );

  // debounced autosave whenever `resume` changes
  const save = useCallback((next) => {
    setResume(next);
    latest.current = next;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      if (JSON.stringify(latest.current) !== lastSaved.current) {
        persist(latest.current);
      }
    }, 700);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persist]);

  const update = (field, value) => save({ ...resume, [field]: value });

  const toggleShare = async (isPublic) => {
    const updated = await persist({ ...resume, isPublic });
    setResume(updated);
    latest.current = updated;
  };

  const downloadPdf = async () => {
    setDownloading(true);
    try {
      const res = await api.get("/resume/pdf", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${(resume.fullName || "resume").replace(/\s+/g, "_")}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Could not generate the PDF.");
    } finally {
      setDownloading(false);
    }
  };

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  if (!resume)
    return (
      <div className="min-h-screen bg-onyx flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
      </div>
    );

  return (
    <div className="min-h-screen bg-onyx bg-onyx-radial bg-noise">
      <header className="border-b border-white/10 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 bg-onyx/90 backdrop-blur z-20">
        <Logo dark />
        <div className="flex items-center gap-2 sm:gap-3">
          <p className="hidden md:block text-[11px] text-white/35 mr-1">
            {saving ? "Saving…" : savedAt ? "All changes saved" : ""}
          </p>
          <Button variant="ghost" size="sm" icon={Target} onClick={() => setModal("analyze")} className="hidden sm:inline-flex">
            ATS Score
          </Button>
          <Button variant="ghost" size="sm" icon={Wand2} onClick={() => setModal("cover")} className="hidden sm:inline-flex">
            Cover Letter
          </Button>
          <Button variant="ghost" size="sm" icon={Share2} onClick={() => setModal("share")}>
            Share
          </Button>
          <Button variant="gold" size="sm" icon={Download} onClick={downloadPdf} loading={downloading}>
            <span className="hidden sm:inline">Download PDF</span>
          </Button>
          <button onClick={logout} title="Sign out" className="text-white/40 hover:text-white p-2">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-[180px_1fr_460px] gap-6">
        {/* Section nav */}
        <nav className="hidden lg:block sticky top-20 self-start space-y-0.5">
          <div className="flex items-center gap-2 px-2 py-2 mb-2 text-white/50 text-xs">
            <User2 size={13} /> {user?.name}
          </div>
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => scrollTo(n.id)}
              className="block w-full text-left text-[12.5px] text-white/45 hover:text-gold hover:bg-white/5 rounded-sm px-2.5 py-1.5 transition-colors"
            >
              {n.label}
            </button>
          ))}
        </nav>

        {/* Form */}
        <div className="space-y-5 min-w-0">
          <div className="flex lg:hidden gap-2 overflow-x-auto scroll-slim pb-1 -mx-1 px-1">
            <Button variant="ghost" size="sm" icon={Target} onClick={() => setModal("analyze")} className="shrink-0">
              ATS Score
            </Button>
            <Button variant="ghost" size="sm" icon={Wand2} onClick={() => setModal("cover")} className="shrink-0">
              Cover Letter
            </Button>
          </div>
          <PersonalSection resume={resume} update={update} />
          <SummarySection resume={resume} update={update} />
          <SkillsSection resume={resume} save={save} />
          <ExperienceSection resume={resume} save={save} />
          <ProjectsSection resume={resume} save={save} />
          <EducationSection resume={resume} save={save} />
          <CertificationsSection resume={resume} save={save} />
          <LanguagesSection resume={resume} save={save} />
          <DesignSection resume={resume} save={save} />
        </div>

        {/* Live preview */}
        <div className="hidden lg:block sticky top-20 self-start">
          <p className="text-white/40 text-xs mb-3 text-center tracking-wide">Live preview</p>
          <ResumePreview resume={resume} />
        </div>
      </div>

      <AnalyzeModal open={modal === "analyze"} onClose={() => setModal(null)} resume={resume} />
      <CoverLetterModal open={modal === "cover"} onClose={() => setModal(null)} resume={resume} />
      <ShareModal open={modal === "share"} onClose={() => setModal(null)} resume={resume} onToggle={toggleShare} />
    </div>
  );
}
