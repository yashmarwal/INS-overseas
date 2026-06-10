import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import PageHero from "@/components/shared/PageHero";
import { motion } from "framer-motion";
import { posts } from "@/data/blogPosts";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Journal | INS Overseas — Craft Stories & Jaipur Heritage" },
      {
        name: "description",
        content:
          "Essays on handmade paper, leather binding, Rajasthani craft, and care guides for your INS Overseas pieces.",
      },
    ],
  }),
  component: Journal,
});

function Journal() {
  return (
    <>
      <PageHero
        eyebrow="The Journal"
        title={
          <>
            Stories From{" "}
            <em className="italic font-light text-gold-light">Sanganer</em>
          </>
        }
        subtitle="Essays on handmade paper, leather craft, Rajasthani heritage, and guides for retailers and collectors."
      />
      <section className="bg-cream py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((p, i) => (
            <motion.article
              key={p.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.08 }}
              className="group"
            >
              <Link to="/journal/$slug" params={{ slug: p.slug }} className="block">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.title}
                    className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                  />
                </div>
                <div className="flex items-center gap-3 mt-5 mb-3">
                  <span
                    className="text-gold uppercase"
                    style={{ fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.2em" }}
                  >
                    {p.cat}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-warm-grey-light" />
                  <span
                    className="text-warm-grey"
                    style={{ fontFamily: "var(--font-body)", fontSize: 11 }}
                  >
                    {p.readTime}
                  </span>
                </div>
                <h3
                  className="text-ink leading-snug mb-3 group-hover:text-umber transition-colors"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                    fontSize: "clamp(18px, 2vw, 24px)",
                  }}
                >
                  {p.title}
                </h3>
                <p
                  className="text-warm-grey leading-relaxed mb-4"
                  style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 14, lineHeight: 1.75 }}
                >
                  {p.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className="text-warm-grey uppercase"
                    style={{ fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.1em" }}
                  >
                    {p.date}
                  </span>
                  <span
                    className="text-umber uppercase inline-flex items-center gap-1 group-hover:gap-2 transition-all"
                    style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 10, letterSpacing: "0.15em" }}
                  >
                    Read →
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>
    </>
  );
}
