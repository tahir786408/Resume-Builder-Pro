import { useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { Copy, Globe, Lock, ExternalLink } from "lucide-react";
import { useToast } from "../../context/ToastContext";

export default function ShareModal({ open, onClose, resume, onToggle }) {
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const url = resume.slug ? `${window.location.origin}/r/${resume.slug}` : "";

  const toggle = async () => {
    setBusy(true);
    try {
      await onToggle(!resume.isPublic);
      toast.success(resume.isPublic ? "Your resume is now private." : "Your resume is now shareable.");
    } catch (err) {
      toast.error("Could not update sharing.");
    } finally {
      setBusy(false);
    }
  };

  const copy = () => {
    navigator.clipboard.writeText(url);
    toast.success("Link copied.");
  };

  return (
    <Modal open={open} onClose={onClose} title="Share your resume" subtitle="Publish a live, read-only link recruiters can open in one click">
      <div className="flex items-center justify-between bg-white/[0.03] border border-white/10 rounded-sm p-4">
        <div className="flex items-center gap-3">
          {resume.isPublic ? <Globe size={18} className="text-gold" /> : <Lock size={18} className="text-white/40" />}
          <div>
            <p className="text-sm text-ivory">{resume.isPublic ? "Public" : "Private"}</p>
            <p className="text-[11px] text-white/40">{resume.isPublic ? "Anyone with the link can view it" : "Only you can see this resume"}</p>
          </div>
        </div>
        <button
          onClick={toggle}
          disabled={busy}
          className={`w-11 h-6 rounded-full relative transition-colors ${resume.isPublic ? "bg-gold" : "bg-white/15"}`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-onyx transition-transform ${
              resume.isPublic ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {resume.isPublic && url && (
        <div className="mt-4">
          <label className="block text-[11px] text-white/50 mb-1.5 tracking-wide">Public link</label>
          <div className="flex gap-2">
            <input
              readOnly
              value={url}
              className="flex-1 bg-white/[0.03] border border-white/10 rounded-sm px-3 py-2.5 text-sm text-ivory/80"
            />
            <Button variant="outline" size="md" icon={Copy} onClick={copy} />
            <a href={url} target="_blank" rel="noreferrer">
              <Button variant="ghost" size="md" icon={ExternalLink} />
            </a>
          </div>
        </div>
      )}
    </Modal>
  );
}
