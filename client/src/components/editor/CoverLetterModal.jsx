import { useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { Field, TextArea } from "../ui/Field";
import api from "../../api/axios";
import { useToast } from "../../context/ToastContext";
import { Wand2, Copy, Download } from "lucide-react";

const TONES = [
  { id: "professional", label: "Professional" },
  { id: "confident", label: "Confident" },
  { id: "concise", label: "Concise" },
];

export default function CoverLetterModal({ open, onClose, resume }) {
  const [jd, setJd] = useState("");
  const [company, setCompany] = useState("");
  const [tone, setTone] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [letter, setLetter] = useState("");
  const toast = useToast();

  const generate = async () => {
    if (jd.trim().length < 40) return toast.error("Paste the full job description first.");
    setLoading(true);
    try {
      const { data } = await api.post("/ai/cover-letter", { resume, jobDescription: jd, company, tone });
      setLetter(data.text);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not generate the letter.");
    } finally {
      setLoading(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(letter);
    toast.success("Copied to clipboard.");
  };

  const download = () => {
    const blob = new Blob([letter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(resume.fullName || "cover-letter").replace(/\s+/g, "_")}_Cover_Letter.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal open={open} onClose={onClose} title="AI Cover Letter" subtitle="Tailored to a specific job in seconds" wide>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <Field label="Company (optional)" value={company} onChange={setCompany} placeholder="e.g. Acme Inc." />
        <div>
          <label className="block text-[11px] text-white/50 mb-1.5 tracking-wide">Tone</label>
          <div className="flex gap-1.5">
            {TONES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTone(t.id)}
                className={`flex-1 text-[11px] py-2.5 rounded-sm border transition-colors ${
                  tone === t.id ? "border-gold text-gold bg-gold/10" : "border-white/10 text-white/50 hover:text-white/80"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <TextArea label="Job description" value={jd} onChange={setJd} rows={6} placeholder="Paste the full job description here…" />
      <div className="mt-3 flex justify-end">
        <Button icon={Wand2} onClick={generate} loading={loading}>
          Generate letter
        </Button>
      </div>

      {letter && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/[0.03] border border-white/10 rounded-sm p-4 whitespace-pre-wrap text-[13px] text-ivory/85 leading-relaxed max-h-72 overflow-y-auto scroll-slim">
            {letter}
          </div>
          <div className="mt-3 flex gap-2 justify-end">
            <Button variant="ghost" size="sm" icon={Copy} onClick={copy}>
              Copy
            </Button>
            <Button variant="outline" size="sm" icon={Download} onClick={download}>
              Download .txt
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
