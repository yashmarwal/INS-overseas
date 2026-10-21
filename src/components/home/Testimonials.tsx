import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  { quote: "The leather journals we ordered for our shop in Amsterdam sold out in two weeks. Quality is extraordinary — our customers ask for them by name now.", name: "Sarah V.", role: "Boutique Stationery Owner", country: "Netherlands" },
  { quote: "INS Overseas has been our paper supplier for 8 years. The cotton rag paper is unmatched for watercolour work — no bleed, perfect texture, beautiful deckle edge.", name: "James T.", role: "Art Supply Retailer", country: "UK" },
  { quote: "We ordered 500 custom leather diaries for our annual corporate event. The branding was perfect, delivery was on time, and the quality left our clients speechless.", name: "Priya M.", role: "Corporate Gifting Manager", country: "UAE" },
  { quote: "I've sourced from manufacturers across India and Southeast Asia. INS Overseas stands alone — the craftsmanship, the communication, the packaging. Worth every rupee.", name: "Kenji W.", role: "Wholesale Buyer", country: "Japan" },
];

const N = testimonials.length;
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

// Where a non-active quote waits: the NEXT one on the right, everything else on the left, so
// advancing slides the next quote in from the right and the old one out to the left (and back again).
const restX = (i: number, current: number, distance: number) => ((i - current + N) % N === 1 ? distance : -distance);

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const touchStart = useRef(0);

  const go = (dir: number) => setCurrent((p) => (p + dir + N) % N);

  // Auto-advance every 4 seconds (both desktop and mobile)
  useEffect(() => {
    const timer = setInterval(() => setCurrent((p) => (p + 1) % N), 4000);
    return () => clearInterval(timer);
  }, [current]);

  return (
    <section className="bg-parchment py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center relative">

        {/* ── Desktop: horizontal carousel with prev/next arrows ── */}
        {/* All quotes share ONE grid cell, so the section is always as tall as the longest quote and the
            page below never jumps when the quote changes. */}
        <div className="hidden md:block relative overflow-hidden">
          {/* Prev arrow */}
          <button
            onClick={() => go(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center border border-umber/25 text-umber hover:bg-umber hover:text-cream transition-all rounded-full"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="grid">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                aria-hidden={i !== current}
                initial={false}
                animate={{ opacity: i === current ? 1 : 0, x: i === current ? 0 : restX(i, current, 80) }}
                transition={{ duration: 0.5, ease: EASE }}
                style={{ pointerEvents: i === current ? "auto" : "none" }}
                className="col-start-1 row-start-1 py-20 px-16 text-center"
              >
                <span
                  className="absolute -top-12 left-1/2 -translate-x-1/2 text-gold/20 select-none pointer-events-none"
                  style={{ fontFamily: "var(--font-display)", fontSize: 200, lineHeight: 1 }}
                >
                  "
                </span>
                <blockquote
                  className="italic text-umber-dark relative max-w-3xl mx-auto"
                  style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", fontWeight: 400, fontSize: "clamp(18px, 2vw, 26px)", lineHeight: 1.55 }}
                >
                  {t.quote}
                </blockquote>
                <div className="mt-8 flex items-center justify-center gap-4">
                  <span className="h-px w-10 bg-gold" />
                  <p className="uppercase text-[11px] text-umber" style={{ fontFamily: "var(--font-body)", fontWeight: 400, letterSpacing: "0.2em" }}>
                    {t.name} · {t.role} · {t.country}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Next arrow */}
          <button
            onClick={() => go(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center border border-umber/25 text-umber hover:bg-umber hover:text-cream transition-all rounded-full"
            aria-label="Next testimonial"
          >
            <ChevronRight size={18} />
          </button>

          {/* Dot indicators */}
          <div className="flex items-center justify-center gap-2 pb-8">
            {testimonials.map((t, i) => (
              <button
                key={t.name}
                onClick={() => setCurrent(i)}
                aria-label={`Show testimonial ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? "bg-gold w-8" : "bg-umber/25 w-1.5"}`}
              />
            ))}
          </div>
        </div>

        {/* ── Mobile: touch-swipeable card (same single-cell stacking) ── */}
        <div className="md:hidden">
          <div
            className="grid"
            onTouchStart={(e) => { touchStart.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              const diff = touchStart.current - e.changedTouches[0].clientX;
              if (Math.abs(diff) > 40) go(diff > 0 ? 1 : -1);
            }}
          >
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                aria-hidden={i !== current}
                initial={false}
                animate={{ opacity: i === current ? 1 : 0, x: i === current ? 0 : restX(i, current, 60) }}
                transition={{ duration: 0.35, ease: EASE }}
                style={{ pointerEvents: i === current ? "auto" : "none" }}
                className="col-start-1 row-start-1 bg-cream rounded-sm px-6 py-10 relative"
              >
                <span className="absolute top-2 left-4 text-gold/20 select-none" style={{ fontFamily: "var(--font-display)", fontSize: 80, lineHeight: 1 }}>"</span>
                <blockquote
                  className="italic text-umber-dark relative pt-6"
                  style={{ fontFamily: "var(--font-accent)", fontStyle: "italic", fontWeight: 400, fontSize: 17, lineHeight: 1.65 }}
                >
                  {t.quote}
                </blockquote>
                <div className="mt-6 flex items-center justify-center gap-3">
                  <span className="h-px w-8 bg-gold" />
                  <p className="uppercase text-[10px] text-umber" style={{ fontFamily: "var(--font-body)", fontWeight: 400, letterSpacing: "0.18em" }}>
                    {t.name} · {t.country}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Swipe controls */}
          <div className="flex items-center justify-between mt-6 px-2">
            <button onClick={() => go(-1)} aria-label="Previous testimonial" className="w-10 h-10 flex items-center justify-center border border-umber/30 text-umber hover:bg-umber hover:text-cream transition-colors rounded-full">
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((t, i) => (
                <button
                  key={t.name}
                  onClick={() => setCurrent(i)}
                  aria-label={`Show testimonial ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${i === current ? "bg-gold w-5" : "bg-umber/25 w-2"}`}
                />
              ))}
            </div>
            <button onClick={() => go(1)} aria-label="Next testimonial" className="w-10 h-10 flex items-center justify-center border border-umber/30 text-umber hover:bg-umber hover:text-cream transition-colors rounded-full">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
