export function Field({ label, value, onChange, onBlur, placeholder, className = "", type = "text", maxLength }) {
  return (
    <div className={className}>
      {label && <label className="block text-[11px] text-white/50 mb-1.5 tracking-wide">{label}</label>}
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-3 py-2.5 text-sm text-ivory placeholder:text-white/25 focus-gold transition-colors focus:border-gold/60 focus:bg-white/[0.05]"
      />
    </div>
  );
}

export function TextArea({ label, value, onChange, onBlur, placeholder, rows = 4, className = "", maxLength, hint }) {
  return (
    <div className={className}>
      {label && <label className="block text-[11px] text-white/50 mb-1.5 tracking-wide">{label}</label>}
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        rows={rows}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-3 py-2.5 text-sm text-ivory placeholder:text-white/25 focus-gold transition-colors focus:border-gold/60 focus:bg-white/[0.05] resize-none"
      />
      {hint && <p className="text-[10px] text-white/25 mt-1">{hint}</p>}
    </div>
  );
}

export function MiniField({ value, onChange, onBlur, placeholder, className = "" }) {
  return (
    <input
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      className={`w-full bg-white/[0.03] border border-white/10 rounded-sm px-3 py-2 text-sm text-ivory placeholder:text-white/25 focus-gold transition-colors focus:border-gold/60 ${className}`}
    />
  );
}
