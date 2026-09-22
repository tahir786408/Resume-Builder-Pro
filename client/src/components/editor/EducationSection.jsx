import CardShell from "./CardShell";
import { MiniField } from "../ui/Field";
import { Plus, Trash2 } from "lucide-react";
import { EMPTY_EDUCATION } from "../../lib/templates";

export default function EducationSection({ resume, save }) {
  const list = resume.education || [];
  const setList = (next) => save({ ...resume, education: next });
  const updateItem = (i, field, value) => {
    const next = [...list];
    next[i] = { ...next[i], [field]: value };
    setList(next);
  };
  const add = () => setList([...list, { ...EMPTY_EDUCATION }]);
  const remove = (i) => setList(list.filter((_, idx) => idx !== i));

  return (
    <CardShell
      title="Education"
      id="sec-education"
      action={
        <button onClick={add} className="text-xs text-gold hover:text-goldsoft flex items-center gap-1">
          <Plus size={13} /> Add
        </button>
      }
    >
      <div className="space-y-4">
        {list.length === 0 && <p className="text-xs text-white/30">No education added yet.</p>}
        {list.map((edu, i) => (
          <div key={i} className="border border-white/10 rounded-sm p-4 space-y-2.5 bg-white/[0.015]">
            <MiniField value={edu.degree} onChange={(v) => updateItem(i, "degree", v)} placeholder="Degree (e.g. BS Software Engineering)" />
            <div className="grid grid-cols-2 gap-2">
              <MiniField value={edu.institute} onChange={(v) => updateItem(i, "institute", v)} placeholder="Institute" />
              <MiniField value={edu.duration} onChange={(v) => updateItem(i, "duration", v)} placeholder="Duration" />
            </div>
            <div className="flex items-center justify-between gap-2">
              <MiniField value={edu.grade} onChange={(v) => updateItem(i, "grade", v)} placeholder="CGPA / Grade (optional)" />
              <button onClick={() => remove(i)} className="text-danger/70 hover:text-danger shrink-0">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  );
}
