import { useState } from "react";
import CardShell from "./CardShell";
import { MiniField, TextArea } from "../ui/Field";
import AiButton from "../ui/AiButton";
import api from "../../api/axios";
import { useToast } from "../../context/ToastContext";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { EMPTY_EXPERIENCE } from "../../lib/templates";

export default function ExperienceSection({ resume, save }) {
  const [aiIndex, setAiIndex] = useState(null);
  const toast = useToast();

  const list = resume.experience || [];

  const setList = (next) => save({ ...resume, experience: next });
  const updateItem = (i, field, value) => {
    const next = [...list];
    next[i] = { ...next[i], [field]: value };
    save({ ...resume, experience: next });
  };
  const add = () => setList([...list, { ...EMPTY_EXPERIENCE }]);
  const remove = (i) => setList(list.filter((_, idx) => idx !== i));
  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    setList(next);
  };

  const writeBullets = async (i) => {
    setAiIndex(i);
    try {
      const { data } = await api.post("/ai/bullets", { resume, item: list[i], kind: "experience" });
      updateItem(i, "details", data.text);
      toast.success("Bullet points written by AI.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not write bullet points.");
    } finally {
      setAiIndex(null);
    }
  };

  return (
    <CardShell
      title="Experience"
      id="sec-experience"
      action={
        <button onClick={add} className="text-xs text-gold hover:text-goldsoft flex items-center gap-1">
          <Plus size={13} /> Add role
        </button>
      }
    >
      <div className="space-y-4">
        {list.length === 0 && <p className="text-xs text-white/30">No experience added yet.</p>}
        {list.map((exp, i) => (
          <div key={i} className="border border-white/10 rounded-sm p-4 space-y-2.5 bg-white/[0.015]">
            <div className="flex items-center justify-between">
              <span className="text-white/20 flex items-center gap-1 text-[10px]">
                <GripVertical size={12} /> Role {i + 1}
              </span>
              <div className="flex items-center gap-3">
                <button onClick={() => move(i, -1)} disabled={i === 0} className="text-white/30 hover:text-white disabled:opacity-20 text-xs">
                  ↑
                </button>
                <button onClick={() => move(i, 1)} disabled={i === list.length - 1} className="text-white/30 hover:text-white disabled:opacity-20 text-xs">
                  ↓
                </button>
                <button onClick={() => remove(i)} className="text-danger/70 hover:text-danger">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <MiniField value={exp.role} onChange={(v) => updateItem(i, "role", v)} placeholder="Role" />
              <MiniField value={exp.company} onChange={(v) => updateItem(i, "company", v)} placeholder="Company" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <MiniField value={exp.location} onChange={(v) => updateItem(i, "location", v)} placeholder="Location (optional)" />
              <MiniField value={exp.duration} onChange={(v) => updateItem(i, "duration", v)} placeholder="Duration (e.g. Jul 2026 – Present)" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-white/30">One achievement per line</span>
                <AiButton onClick={() => writeBullets(i)} loading={aiIndex === i}>
                  {exp.details ? "Rewrite" : "Write for me"}
                </AiButton>
              </div>
              <TextArea
                value={exp.details}
                onChange={(v) => updateItem(i, "details", v)}
                rows={3}
                placeholder="What did you do and achieve? One point per line."
              />
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  );
}
