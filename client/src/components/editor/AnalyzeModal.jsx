import { useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { TextArea } from "../ui/Field";
import api from "../../api/axios";
import { useToast } from "../../context/ToastContext";
import { Target, CheckCircle2, XCircle } from "lucide-react";

function ScoreRing({ score }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const color = score >= 75 ? "#3F7D58" : score >= 45 ? "#C9A45C" : "#B23A34";
  return (
    <div className="relative h-24 w-24 shrink-0">
      <svg viewBox="0 0 80 80" className="h-24 w-24 -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * score) / 100}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-xl text-ivory">{score}</span>
        <span className="text-[9px] text-white/40 -mt-1">/ 100</span>
      </div>
    </div>
  );
}

export default function AnalyzeModal({ open, onClose, resume }) {
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const toast = useToast();

  const run = async () => {
    if (jd.trim().length < 40) return toast.error("Paste the full job description first.");
    setLoading(true);
    try {
      const { data } = await api.post("/ai/analyze", { resume, jobDescription: jd });
      setResult(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="ATS Match Analyzer" subtitle="See how your resume scores against a real job post" wide>
      <TextArea
        label="Job description"
        value={jd}
        onChange={setJd}
        rows={7}
        placeholder="Paste the full job description here…"
      />
      <div className="mt-3 flex justify-end">
        <Button icon={Target} onClick={run} loading={loading}>
          Analyze match
        </Button>
      </div>

      {result && (
        <div className="mt-6 pt-6 border-t border-white/10 space-y-5">
          <div className="flex items-center gap-5">
            <ScoreRing score={result.matchScore} />
            <p className="text-sm text-ivory/85 leading-relaxed">{result.verdict}</p>
          </div>

          {result.matchedKeywords?.length > 0 && (
            <div>
              <p className="text-[11px] uppercase tracking-wide text-white/40 mb-2">Matched keywords</p>
              <div className="flex flex-wrap gap-1.5">
                {result.matchedKeywords.map((k, i) => (
                  <span key={i} className="text-[11px] flex items-center gap-1 bg-success/10 text-success border border-success/25 rounded-full px-2.5 py-1">
                    <CheckCircle2 size={11} /> {k}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.missingKeywords?.length > 0 && (
            <div>
              <p className="text-[11px] uppercase tracking-wide text-white/40 mb-2">Missing keywords</p>
              <div className="flex flex-wrap gap-1.5">
                {result.missingKeywords.map((k, i) => (
                  <span key={i} className="text-[11px] flex items-center gap-1 bg-danger/10 text-danger border border-danger/25 rounded-full px-2.5 py-1">
                    <XCircle size={11} /> {k}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.suggestions?.length > 0 && (
            <div>
              <p className="text-[11px] uppercase tracking-wide text-white/40 mb-2">Suggested edits</p>
              <ul className="space-y-1.5">
                {result.suggestions.map((s, i) => (
                  <li key={i} className="text-[13px] text-ivory/80 flex gap-2">
                    <span className="text-gold">—</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
