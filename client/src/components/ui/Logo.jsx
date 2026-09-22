export default function Logo({ className = "", dark = false }) {
  const ink = dark ? "#FAF7F2" : "#1C1B1F";
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
        <rect x="0.5" y="0.5" width="29" height="29" rx="6.5" stroke="#C9A45C" strokeWidth="1" />
        <path d="M9 21.5V8.5H15.4C17.9 8.5 19.6 9.9 19.6 12.15C19.6 13.85 18.65 15.05 17.1 15.55L20 21.5H17.15L14.55 15.95H11.55V21.5H9ZM11.55 13.75H15.05C16.35 13.75 17.1 13.1 17.1 12.15C17.1 11.2 16.35 10.6 15.05 10.6H11.55V13.75Z" fill="#C9A45C" />
      </svg>
      <div className="leading-none">
        <p className="font-display text-[15px] tracking-wide" style={{ color: ink }}>
          Resume<span className="text-gold">Builder</span>
        </p>
        <p className="text-[8.5px] tracking-[0.25em] uppercase" style={{ color: "#C9A45C" }}>
          Pro Atelier
        </p>
      </div>
    </div>
  );
}
