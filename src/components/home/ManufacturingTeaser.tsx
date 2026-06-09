import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Play, ArrowRight } from "lucide-react";

// First 3 video IDs from the real Vimeo playlist
const previewVideos = [
  "1199824555",
  "1199824554",
  "1199824476",
];

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function ManufacturingTeaser() {
  return (
    <section className="bg-ink py-20 md:py-28 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-10 bg-gold" />
              <span
                className="text-gold uppercase"
                style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 11, letterSpacing: "0.25em" }}
              >
                Inside Our Workspace
              </span>
            </div>

            <h2
              className="text-cream mb-6"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 300,
                fontSize: "clamp(30px, 4vw, 54px)",
                lineHeight: 1.05,
                letterSpacing: "-0.01em",
              }}
            >
              See How We<br />
              <em className="italic font-light text-gold-light">Make Everything</em>
            </h2>

            <p
              className="text-warm-grey mb-10 leading-relaxed max-w-sm"
              style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 15, lineHeight: 1.85 }}
            >
              From recycled cotton rags pulled into handmade paper sheets, to buffalo leather hand-stitched around every journal spine — watch the full process in our Sanganer workspace.
            </p>

            {/* Stats row */}
            <div className="flex gap-8 mb-10 border-t border-white/10 pt-8">
              {([
                ["25+", "Artisans"],
                ["400", "Years of craft"],
                ["30",  "Years exporting"],
              ] as [string, string][]).map(([num, label]) => (
                <div key={label}>
                  <p
                    className="text-gold"
                    style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: 28, lineHeight: 1 }}
                  >
                    {num}
                  </p>
                  <p
                    className="text-warm-grey mt-1"
                    style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 11, letterSpacing: "0.1em" }}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              to="/manufacturing"
              className="inline-flex items-center gap-3 group border border-gold text-gold px-8 py-4 uppercase hover:bg-gold hover:text-ink transition-all duration-300"
              style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 12, letterSpacing: "0.18em" }}
            >
              <Play size={14} fill="currentColor" />
              Watch &amp; Explore
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Right — 3 stacked video thumbnails */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            className="relative"
          >
            <div className="relative h-[380px] md:h-[440px]">

              {/* Card 3 — back */}
              <div
                className="absolute top-0 right-0 w-[75%] overflow-hidden rounded-sm shadow-2xl"
                style={{ transform: "rotate(3deg)", opacity: 0.5 }}
              >
                <div className="aspect-[4/3] bg-parchment-dark">
                  <img
                    src={`https://vumbnail.com/${previewVideos[2]}.jpg`}
                    alt="Workspace preview"
                    className="w-full h-full object-cover"
                    style={{ filter: "brightness(0.5) sepia(0.2)" }}
                  />
                </div>
              </div>

              {/* Card 2 — middle */}
              <div
                className="absolute top-8 right-4 w-[80%] overflow-hidden rounded-sm shadow-2xl"
                style={{ transform: "rotate(1.5deg)", opacity: 0.75 }}
              >
                <div className="aspect-[4/3] bg-parchment-dark">
                  <img
                    src={`https://vumbnail.com/${previewVideos[1]}.jpg`}
                    alt="Workspace preview"
                    className="w-full h-full object-cover"
                    style={{ filter: "brightness(0.6) sepia(0.15)" }}
                  />
                </div>
              </div>

              {/* Card 1 — front */}
              <Link
                to="/manufacturing"
                className="absolute top-16 left-0 w-[85%] block overflow-hidden rounded-sm shadow-2xl group"
              >
                <div className="aspect-[4/3] bg-parchment-dark relative">
                  <img
                    src={`https://vumbnail.com/${previewVideos[0]}.jpg`}
                    alt="Watch the manufacturing process"
                    className="w-full h-full object-cover transition-transform duration-[2500ms] group-hover:scale-105"
                    style={{ filter: "brightness(0.7) sepia(0.1)" }}
                  />
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-ink/20 group-hover:bg-ink/40 transition-colors duration-300">
                    <div className="w-16 h-16 rounded-full bg-gold/90 flex items-center justify-center shadow-xl">
                      <Play size={22} className="text-ink ml-1.5" fill="#1A1410" />
                    </div>
                  </div>
                  {/* Label */}
                  <div
                    className="absolute bottom-0 left-0 right-0 p-4"
                    style={{ background: "linear-gradient(to top, rgba(26,20,16,0.9), transparent)" }}
                  >
                    <p className="text-cream text-xs uppercase" style={{ letterSpacing: "0.15em" }}>
                      Watch the process →
                    </p>
                  </div>
                </div>
              </Link>

              {/* Floating badge */}
              <div
                className="absolute bottom-2 right-2 bg-gold text-ink px-3 py-1.5 rounded-full shadow-lg"
                style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 11, letterSpacing: "0.1em" }}
              >
                Videos + Photos
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
