import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, FileDown, Target, Wand2, Share2, Layers, ArrowRight } from "lucide-react";
import Logo from "../components/ui/Logo";
import { TEMPLATES } from "../lib/templates";

const FEATURES = [
  { icon: Wand2, title: "AI writing assistant", desc: "Generate a polished summary, achievement bullets, and skill suggestions from your own details — never invented facts." },
  { icon: Target, title: "ATS match analyzer", desc: "Paste any job description and get a match score, missing keywords, and specific edits to close the gap." },
  { icon: Layers, title: "Six luxury templates", desc: "Onyx, Ivory, Wine, Noir, Emerald, Sapphire — refined typography and layout, not another generic template." },
  { icon: FileDown, title: "Pixel-accurate PDF", desc: "What you see is exactly what you download — server-rendered, print-ready, recruiter-ready." },
  { icon: Share2, title: "Shareable live link", desc: "Publish a read-only link recruiters can open instantly, no download required." },
  { icon: Sparkles, title: "Autosaves as you type", desc: "Every change is saved quietly in the background. Come back anytime, exactly where you left off." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] } }),
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-onyx bg-onyx-radial bg-noise text-ivory overflow-x-hidden">
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Logo dark />
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-white/60 hover:text-white transition-colors">
            Sign in
          </Link>
          <Link to="/register" className="bg-gold-gradient text-onyx text-sm font-semibold px-4 py-2 rounded-sm shadow-gold hover:brightness-105 transition-all">
            Get started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-20 text-center">
        <motion.div initial="hidden" animate="show" custom={0} variants={fadeUp} className="inline-flex items-center gap-2 border border-gold/30 text-gold text-[11px] tracking-wide uppercase px-3 py-1.5 rounded-full mb-7">
          <Sparkles size={12} /> AI-assisted resume atelier
        </motion.div>
        <motion.h1 initial="hidden" animate="show" custom={1} variants={fadeUp} className="font-display text-[42px] sm:text-6xl leading-[1.08] font-semibold">
          A resume that reads like it was
          <br />
          <span className="italic text-gold">crafted</span>, not filled in.
        </motion.h1>
        <motion.p initial="hidden" animate="show" custom={2} variants={fadeUp} className="mt-6 text-white/55 text-lg max-w-2xl mx-auto leading-relaxed">
          Write, refine, and design a resume with an AI assistant that writes from your real experience, six premium templates, and a live preview that matches your download exactly.
        </motion.p>
        <motion.div initial="hidden" animate="show" custom={3} variants={fadeUp} className="mt-9 flex items-center justify-center gap-4">
          <Link to="/register" className="bg-gold-gradient text-onyx font-semibold px-7 py-3.5 rounded-sm shadow-gold hover:brightness-105 transition-all flex items-center gap-2">
            Build my resume <ArrowRight size={16} />
          </Link>
          <Link to="/login" className="border border-white/15 text-white/80 px-7 py-3.5 rounded-sm hover:bg-white/5 transition-colors">
            Sign in
          </Link>
        </motion.div>
      </section>

      {/* Template strip */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {TEMPLATES.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              className="aspect-[3/4] rounded-sm overflow-hidden border border-white/10 relative animate-floatSlow"
              style={{ animationDelay: `${i * 0.3}s` }}
            >
              {t.layout === "atelier" ? (
                <div className="flex h-full">
                  <div className="w-[38%]" style={{ background: t.side }} />
                  <div className="flex-1 bg-white p-2">
                    <div className="h-1.5 w-3/4 rounded-full mb-1" style={{ background: t.accent }} />
                    <div className="h-1 w-1/2 rounded-full bg-black/10" />
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  <div className="h-[30%] px-2 flex flex-col justify-center" style={{ background: t.band }}>
                    <div className="h-1.5 w-3/4 rounded-full" style={{ background: t.bandText }} />
                  </div>
                  <div className="flex-1 bg-white p-2">
                    <div className="h-1 w-full rounded-full bg-black/10 mb-1" />
                    <div className="h-1 w-4/5 rounded-full bg-black/10" />
                  </div>
                </div>
              )}
              <p className="absolute bottom-0 inset-x-0 bg-onyx/80 text-ivory text-[10px] text-center py-1">{t.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.5 }}
              className="bg-onyxcard border border-white/10 rounded-xl p-6 shadow-panel hover:border-gold/30 transition-colors"
            >
              <div className="h-10 w-10 rounded-sm bg-gold/10 border border-gold/25 flex items-center justify-center mb-4">
                <f.icon size={18} className="text-gold" />
              </div>
              <h3 className="font-display text-lg mb-1.5">{f.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="font-display text-3xl sm:text-4xl mb-4">Craft a resume worth reading.</h2>
          <p className="text-white/50 mb-8">Free to start. No credit card. Export as many times as you like.</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-gold-gradient text-onyx font-semibold px-7 py-3.5 rounded-sm shadow-gold hover:brightness-105 transition-all">
            Create your resume <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 py-6 text-center text-[11px] text-white/30">
        Resume Builder Pro — crafted with care.
      </footer>
    </div>
  );
}
