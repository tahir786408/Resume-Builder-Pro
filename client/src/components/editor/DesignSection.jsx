import CardShell from "./CardShell";
import { TEMPLATES } from "../../lib/templates";
import { Check } from "lucide-react";

export default function DesignSection({ resume, save }) {
  return (
    <CardShell title="Design & template" id="sec-design">
      <div className="grid grid-cols-3 gap-3">
        {TEMPLATES.map((t) => {
          const active = resume.template === t.id;
          return (
            <button
              key={t.id}
              onClick={() => save({ ...resume, template: t.id })}
              className={`relative rounded-sm overflow-hidden border-2 transition-all aspect-[3/4] ${
                active ? "border-gold shadow-gold" : "border-white/10 hover:border-white/25"
              }`}
            >
              <div className="h-full w-full flex flex-col" style={{ background: t.layout === "atelier" ? t.side : t.band }}>
                {t.layout === "atelier" ? (
                  <div className="flex h-full">
                    <div className="w-[38%]" style={{ background: t.side }} />
                    <div className="flex-1 bg-white p-2">
                      <div className="h-1.5 w-3/4 rounded-full mb-1" style={{ background: t.accent }} />
                      <div className="h-1 w-1/2 rounded-full bg-black/10" />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="h-[30%] w-full flex flex-col justify-center px-2" style={{ background: t.band }}>
                      <div className="h-1.5 w-3/4 rounded-full" style={{ background: t.bandText }} />
                      <div className="h-1 w-1/2 rounded-full mt-1" style={{ background: t.bandAccent }} />
                    </div>
                    <div className="flex-1 bg-white p-2">
                      <div className="h-1 w-full rounded-full bg-black/10 mb-1" />
                      <div className="h-1 w-4/5 rounded-full bg-black/10" />
                    </div>
                  </>
                )}
              </div>
              {active && (
                <div className="absolute top-1.5 right-1.5 h-5 w-5 rounded-full bg-gold flex items-center justify-center">
                  <Check size={12} className="text-onyx" />
                </div>
              )}
              <p className="absolute bottom-0 inset-x-0 bg-onyx/80 text-ivory text-[10px] text-center py-1">{t.label}</p>
            </button>
          );
        })}
      </div>
    </CardShell>
  );
}
