import { createFileRoute } from "@tanstack/react-router";
import PageHero from "@/components/shared/PageHero";
import { motion } from "framer-motion";

const posts = [
  { cat: "Craft Stories", title: "The Art of Deckle Edges — Why Handmade Paper Feels Different", date: "May 2025", img: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80" },
  { cat: "Jaipur Heritage", title: "Sanganer: The Ancient Village That Papers the World", date: "Apr 2025", img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=80" },
  { cat: "Product Care", title: "How to Care for Your Leather Journal — A Complete Guide", date: "Mar 2025", img: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80" },
  { cat: "How-To Guides", title: "Choosing Paper for Fountain Pens vs Watercolour", date: "Feb 2025", img: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=80" },
  { cat: "Craft Stories", title: "Hand-Stitched Bindings: An Ancient Skill, Today", date: "Jan 2025", img: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=900&q=80" },
  { cat: "Jaipur Heritage", title: "Why Rajasthan Smells Like Paper in the Monsoon", date: "Dec 2024", img: "https://images.unsplash.com/photo-1597149959983-9ac80c4a9e64?auto=format&fit=crop&w=900&q=80" },
];

export const Route = createFileRoute("/journal")({
  head: () => ({ meta: [{ title: "Journal | INS Overseas — Craft Stories & Jaipur Heritage" }, { name: "description", content: "Essays on handmade paper, leather binding, Rajasthani craft, and care guides for your INS Overseas pieces." }] }),
  component: Journal,
});

function Journal() {
  return (
    <>
      <PageHero eyebrow="The Journal" title={<>Stories From <em className="italic font-light text-gold-light">Sanganer</em></>} />
      <section className="bg-cream py-20">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((p, i) => (
            <motion.article key={p.title}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: (i % 3) * 0.08 }}
              className="group"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img src={p.img} alt={p.title} className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" />
              </div>
              <p className="mt-5 text-gold uppercase text-[11px]" style={{ letterSpacing: "0.2em" }}>{p.cat}</p>
              <h3 className="mt-2 text-ink text-2xl leading-snug" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{p.title}</h3>
              <p className="mt-2 text-warm-grey text-xs" style={{ letterSpacing: "0.1em" }}>{p.date.toUpperCase()}</p>
            </motion.article>
          ))}
        </div>
      </section>
    </>
  );
}
