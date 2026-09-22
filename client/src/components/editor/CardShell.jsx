export default function CardShell({ title, action, children, id }) {
  return (
    <section id={id} className="bg-onyxcard border border-white/10 rounded-xl p-5 sm:p-6 shadow-panel scroll-mt-24">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-gold text-[11px] font-semibold uppercase tracking-[0.15em]">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
