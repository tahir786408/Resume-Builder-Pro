import CardShell from "./CardShell";
import { MiniField } from "../ui/Field";
import { Plus, Trash2 } from "lucide-react";
import { EMPTY_CERTIFICATION } from "../../lib/templates";

export default function CertificationsSection({ resume, save }) {
  const list = resume.certifications || [];
  const setList = (next) => save({ ...resume, certifications: next });
  const updateItem = (i, field, value) => {
    const next = [...list];
    next[i] = { ...next[i], [field]: value };
    setList(next);
  };
  const add = () => setList([...list, { ...EMPTY_CERTIFICATION }]);
  const remove = (i) => setList(list.filter((_, idx) => idx !== i));

  return (
    <CardShell
      title="Certifications"
      id="sec-certifications"
      action={
        <button onClick={add} className="text-xs text-gold hover:text-goldsoft flex items-center gap-1">
          <Plus size={13} /> Add
        </button>
      }
    >
      <div className="space-y-3">
        {list.length === 0 && <p className="text-xs text-white/30">No certifications added yet.</p>}
        {list.map((c, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_90px_auto] gap-2 items-center">
            <MiniField value={c.name} onChange={(v) => updateItem(i, "name", v)} placeholder="Certification name" />
            <MiniField value={c.issuer} onChange={(v) => updateItem(i, "issuer", v)} placeholder="Issuer" />
            <MiniField value={c.year} onChange={(v) => updateItem(i, "year", v)} placeholder="Year" />
            <button onClick={() => remove(i)} className="text-danger/70 hover:text-danger">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </CardShell>
  );
}
