import { useState } from "react";
import CardShell from "./CardShell";
import { Plus, X } from "lucide-react";

export default function LanguagesSection({ resume, save }) {
  const [input, setInput] = useState("");
  const add = () => {
    const v = input.trim();
    if (!v || (resume.languages || []).includes(v)) return;
    save({ ...resume, languages: [...(resume.languages || []), v] });
    setInput("");
  };
  const remove = (i) => save({ ...resume, languages: resume.languages.filter((_, idx) => idx !== i) });

  return (
    <CardShell title="Languages" id="sec-languages">
      <div className="flex gap-2 mb-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder="e.g. English"
          className="flex-1 bg-white/[0.03] border border-white/10 rounded-sm px-3 py-2.5 text-sm text-ivory placeholder:text-white/25 focus-gold focus:border-gold/60"
        />
        <button onClick={add} className="bg-gold-gradient text-onyx px-4 rounded-sm text-sm font-semibold shadow-gold flex items-center gap-1">
          <Plus size={14} /> Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {(resume.languages || []).map((s, i) => (
          <span key={i} className="bg-white/[0.06] border border-white/10 text-ivory text-xs px-3 py-1.5 rounded-full flex items-center gap-2">
            {s}
            <button onClick={() => remove(i)} className="text-white/40 hover:text-white">
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
    </CardShell>
  );
}
