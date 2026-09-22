import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export default function Modal({ open, onClose, title, subtitle, children, wide = false }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-onyx/80 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            className={`relative bg-onyxcard border border-white/10 rounded-xl shadow-panel w-full ${
              wide ? "max-w-2xl" : "max-w-md"
            } max-h-[86vh] overflow-y-auto scroll-slim`}
          >
            <div className="sticky top-0 bg-onyxcard/95 backdrop-blur border-b border-white/10 px-6 py-4 flex items-start justify-between">
              <div>
                <h2 className="font-display text-lg text-ivory">{title}</h2>
                {subtitle && <p className="text-xs text-white/40 mt-0.5">{subtitle}</p>}
              </div>
              <button onClick={onClose} className="text-white/40 hover:text-white p-1 -mr-1 -mt-1">
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
