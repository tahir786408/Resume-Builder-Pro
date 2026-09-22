import { useState } from "react";
import CardShell from "./CardShell";
import { MiniField, TextArea } from "../ui/Field";
import AiButton from "../ui/AiButton";
import api from "../../api/axios";
import { useToast } from "../../context/ToastContext";
import { Plus, Trash2 } from "lucide-react";
import { EMPTY_PROJECT } from "../../lib/templates";

export default function ProjectsSection({ resume, save }) {
  const [aiIndex, setAiIndex] = useState(null);
  const toast = useToast();
  const list = resume.projects || [];
  const setList = (next) => save({ ...resume, projects: next });
  const updateItem = (i, field, value) => {
    const next = [...list];
    next[i] = { ...next[i], [field]: value };
    setList(next);
  };
  const add = () => setList([...list, { ...EMPTY_PROJECT }]);
  const remove = (i) => setList(list.filter((_, idx) => idx !== i));

  const writeBullets = async (i) => {
    setAiIndex(i);
    try {
      const { data } = await api.post("/ai/bullets", { resume, item: list[i], kind: "project" });
      updateItem(i, "details", data.text);
      toast.success("Project description written by AI.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not write a description.");
    } finally {
      setAiIndex(null);
    }
  };

  return (
    <CardShell
      title="Projects"
      id="sec-projects"
      action={
        <button onClick={add} className="text-xs text-gold hover:text-goldsoft flex items-center gap-1">
          <Plus size={13} /> Add
        </button>
      }
    >
      <div className="space-y-4">
        {list.length === 0 && <p className="text-xs text-white/30">No projects added yet.</p>}
        {list.map((p, i) => (
          <div key={i} className="border border-white/10 rounded-sm p-4 space-y-2.5 bg-white/[0.015]">
            <div className="flex items-center justify-between gap-2">
              <MiniField value={p.name} onChange={(v) => updateItem(i, "name", v)} placeholder="Project name" />
              <button onClick={() => remove(i)} className="text-danger/70 hover:text-danger shrink-0">
                <Trash2 size={14} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <MiniField value={p.tech} onChange={(v) => updateItem(i, "tech", v)} placeholder="Tech stack" />
              <MiniField value={p.link} onChange={(v) => updateItem(i, "link", v)} placeholder="Link (optional)" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-white/30">One point per line</span>
                <AiButton onClick={() => writeBullets(i)} loading={aiIndex === i}>
                  {p.details ? "Rewrite" : "Write for me"}
                </AiButton>
              </div>
              <TextArea value={p.details} onChange={(v) => updateItem(i, "details", v)} rows={3} placeholder="What did the project do? What did you build?" />
            </div>
          </div>
        ))}
      </div>
    </CardShell>
  );
}
