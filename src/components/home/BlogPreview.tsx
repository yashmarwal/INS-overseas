import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import SectionHeading from "@/components/shared/SectionHeading";
import { ArrowRight } from "lucide-react";
import { posts } from "@/data/blogPosts";

// Show first 3 posts from the shared data source
const previewPosts = posts.slice(0, 3);

export default function BlogPreview() {
  return (
    <section className="hidden md:block bg-parchment py-24 lg:py-32">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20">
        <SectionHeading eyebrow="The Journal" title={<>From <em className="italic font-light">The Journal</em></>} />
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
          {previewPosts.map((p, i) => (
            <motion.article
              key={p.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
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
                <p className="mt-5 text-gold uppercase text-[11px]" style={{ letterSpacing: "0.2em" }}>{p.cat}</p>
                <h3 className="mt-3 text-ink text-2xl leading-snug" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                  {p.title}
                </h3>
                <p className="mt-2 text-warm-grey text-xs" style={{ letterSpacing: "0.1em" }}>{p.date.toUpperCase()}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-umber uppercase text-[11px]" style={{ letterSpacing: "0.18em" }}>
                  Read More <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
