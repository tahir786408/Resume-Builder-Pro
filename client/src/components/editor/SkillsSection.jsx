import { useState } from "react";
import CardShell from "./CardShell";
import AiButton from "../ui/AiButton";
import api from "../../api/axios";
import { useToast } from "../../context/ToastContext";
import { Plus, X } from "lucide-react";

export default function SkillsSection({ resume, save }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const toast = useToast();

  const addSkill = (val) => {
    const v = (val ?? input).trim();
    if (!v || (resume.skills || []).includes(v)) return;
    const updated = { ...resume, skills: [...(resume.skills || []), v] };
    save(updated);
    setInput("");
    setSuggestions((s) => s.filter((x) => x !== v));
  };

  const removeSkill = (i) => {
    save({ ...resume, skills: resume.skills.filter((_, idx) => idx !== i) });
  };

  const suggest = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/ai/skills", { resume });
      if (!data.skills?.length) toast.info("No new skill suggestions right now.");
      setSuggestions(data.skills || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not suggest skills.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardShell title="Skills" id="sec-skills" action={<AiButton onClick={suggest} loading={loading}>Suggest skills</AiButton>}>
      <div className="flex gap-2 mb-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
          placeholder="e.g. React"
          className="flex-1 bg-white/[0.03] border border-white/10 rounded-sm px-3 py-2.5 text-sm text-ivory placeholder:text-white/25 focus-gold focus:border-gold/60"
        />
        <button onClick={() => addSkill()} className="bg-gold-gradient text-onyx px-4 rounded-sm text-sm font-semibold shadow-gold flex items-center gap-1">
          <Plus size={14} /> Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-1">
        {(resume.skills || []).map((s, i) => (
          <span key={i} className="bg-white/[0.06] border border-white/10 text-ivory text-xs px-3 py-1.5 rounded-full flex items-center gap-2">
            {s}
            <button onClick={() => removeSkill(i)} className="text-white/40 hover:text-white">
              <X size={12} />
            </button>
          </span>
        ))}
      </div>

      {suggestions.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <p className="text-[10px] uppercase tracking-wide text-white/30 mb-2">AI suggestions — tap to add</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => addSkill(s)}
                className="text-xs px-3 py-1.5 rounded-full border border-dashed border-gold/50 text-gold hover:bg-gold/10 flex items-center gap-1"
              >
                <Plus size={11} /> {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </CardShell>
  );
}
