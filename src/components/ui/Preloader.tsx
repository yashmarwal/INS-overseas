import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Preloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100vh" }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed inset-0 z-[200] bg-ink flex flex-col items-center justify-center"
        >
          {/* Gold line draw */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 60 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="h-px bg-gold mb-8"
          />

          {/* Logo text */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="text-center"
          >
            <h1
              className="text-cream"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 300,
                letterSpacing: "0.4em",
                fontSize: "clamp(20px, 3vw, 32px)",
              }}
            >
              INS OVERSEAS
            </h1>
            <p
              className="mt-3 text-gold"
              style={{
                fontFamily: "var(--font-body)",
                fontWeight: 300,
                fontSize: 11,
                letterSpacing: "0.3em",
              }}
            >
              EST. 1995 · JAIPUR, INDIA
            </p>
          </motion.div>

          {/* Radial glow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.12 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(circle at center, rgba(201,151,58,0.4) 0%, transparent 60%)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
