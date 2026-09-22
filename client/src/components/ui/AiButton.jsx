import { Sparkles } from "lucide-react";

export default function AiButton({ onClick, loading, children = "AI Assist", className = "" }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold text-gold hover:text-goldsoft disabled:opacity-50 transition-colors ${className}`}
    >
      {loading ? (
        <span className="h-3 w-3 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
      ) : (
        <Sparkles size={12} />
      )}
      {loading ? "Thinking…" : children}
    </button>
  );
}
