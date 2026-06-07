import { motion } from "framer-motion";
import SectionHeading from "@/components/shared/SectionHeading";

const imgs = [
  "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1606293459339-aa5d34a7b0e1?auto=format&fit=crop&w=600&q=80",
];

export default function InstagramFeed() {
  return (
    <section className="bg-cream py-12 md:py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20">
        <SectionHeading eyebrow="@ins_overseas" title={<>From Our <em className="italic font-light">Workshop</em></>} />

        {/* Grid: 2 cols on mobile, 3 on md+ */}
        <div className="mt-10 md:mt-14 grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-5">
          {imgs.map((src, i) => (
            <motion.a
              key={src}
              href="https://instagram.com/ins_overseas"
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, scale: 1.05 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.06 }}
              className="group relative aspect-square overflow-hidden block"
              data-cursor-view
            >
              <img src={src} alt="Workshop" className="w-full h-full object-cover transition-transform duration-[1800ms] group-hover:scale-110" />
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/60 transition-colors duration-500 flex items-center justify-center text-cream opacity-0 group-hover:opacity-100" style={{ fontFamily: "var(--font-body)", letterSpacing: "0.2em", fontSize: 11 }}>
                VIEW ON INSTAGRAM
              </div>
            </motion.a>
          ))}
        </div>
        <div className="text-center mt-8 md:mt-10">
          <a href="https://instagram.com/ins_overseas" target="_blank" rel="noreferrer" className="inline-block uppercase text-[12px] text-umber border-b border-umber pb-1" style={{ letterSpacing: "0.15em", fontWeight: 500 }}>
            Follow Us @ins_overseas →
          </a>
        </div>
      </div>
    </section>
  );
}
