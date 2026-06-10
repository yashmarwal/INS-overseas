import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { posts, type Post } from "@/data/blogPosts";

export const Route = createFileRoute("/journal/$slug")({
  head: ({ params }) => {
    const post = posts.find((p) => p.slug === params.slug);
    if (!post) return { meta: [{ title: "Post Not Found | INS Overseas" }] };
    return {
      meta: [
        { title: `${post.title} | INS Overseas Journal` },
        { name: "description", content: post.excerpt },
        { property: "og:title", content: post.title },
        { property: "og:image", content: post.img },
      ],
    };
  },
  loader: ({ params }): Post => {
    const post = posts.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return post;
  },
  component: BlogPost,
});

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

function BlogPost() {
  const post = Route.useLoaderData() as Post;

  const paragraphs = post.content
    .split("\n\n")
    .map((p: string) => p.trim())
    .filter(Boolean);

  const currentIndex = posts.findIndex((p) => p.slug === post.slug);
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  return (
    <>
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[340px] overflow-hidden">
        <img
          src={post.img}
          alt={post.title}
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.55) sepia(0.1)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-5 sm:px-8 lg:px-20 pb-12 max-w-[1400px] mx-auto left-0 right-0">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span
                className="text-gold uppercase"
                style={{ fontFamily: "var(--font-body)", fontSize: 10, letterSpacing: "0.25em" }}
              >
                {post.cat}
              </span>
              <span className="w-1 h-1 rounded-full bg-gold/60" />
              <span className="text-cream/70 flex items-center gap-1.5" style={{ fontSize: 11 }}>
                <Clock size={11} /> {post.readTime}
              </span>
              <span className="w-1 h-1 rounded-full bg-gold/60" />
              <span className="text-cream/70 flex items-center gap-1.5" style={{ fontSize: 11 }}>
                <Calendar size={11} /> {post.date}
              </span>
            </div>
            <h1
              className="text-cream"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                fontSize: "clamp(24px, 4vw, 52px)",
                lineHeight: 1.1,
                maxWidth: "22ch",
              }}
            >
              {post.title}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Back link */}
      <div className="bg-cream border-b border-warm-grey-light/40">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20 py-4">
          <Link
            to="/journal"
            className="inline-flex items-center gap-2 text-umber hover:text-ink transition-colors"
            style={{ fontFamily: "var(--font-body)", fontSize: 12, letterSpacing: "0.1em" }}
          >
            <ArrowLeft size={14} />
            Back to Journal
          </Link>
        </div>
      </div>

      {/* Article body */}
      <article className="bg-cream py-16 md:py-24">
        <div className="max-w-[760px] mx-auto px-5 sm:px-8">

          {/* Excerpt / lead */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-umber-dark mb-10 leading-relaxed"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 300,
              fontSize: "clamp(17px, 2vw, 22px)",
              lineHeight: 1.6,
              borderLeft: "3px solid var(--color-gold, #C9973A)",
              paddingLeft: "1.25rem",
            }}
          >
            {post.excerpt}
          </motion.p>

          {/* Body paragraphs */}
          <div className="space-y-5">
            {paragraphs.map((para: string, i: number) => {
              const isHeading =
                para.length < 70 &&
                !para.endsWith(".") &&
                !para.endsWith(",") &&
                !para.includes("—");
              return isHeading ? (
                <h2
                  key={i}
                  className="text-ink pt-6"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 500,
                    fontSize: "clamp(18px, 2vw, 24px)",
                    lineHeight: 1.2,
                  }}
                >
                  {para}
                </h2>
              ) : (
                <p
                  key={i}
                  className="text-warm-grey"
                  style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 16, lineHeight: 1.85 }}
                >
                  {para}
                </p>
              );
            })}
          </div>

          {/* CTAs */}
          <div className="mt-16 pt-10 border-t border-warm-grey-light/40 flex flex-col sm:flex-row gap-4">
            <a
              href="mailto:Sezan@ins-overseas.com?subject=Wholesale Enquiry — INS Overseas"
              className="inline-flex items-center justify-center gap-2 bg-umber text-cream px-7 py-3.5 uppercase hover:bg-umber-dark transition-colors"
              style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 11, letterSpacing: "0.15em" }}
            >
              Contact Us
            </a>
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 border border-umber text-umber px-7 py-3.5 uppercase hover:bg-umber hover:text-cream transition-colors"
              style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 11, letterSpacing: "0.15em" }}
            >
              Browse Products
            </Link>
          </div>
        </div>
      </article>

      {/* Prev / Next */}
      {(prevPost || nextPost) && (
        <nav className="bg-parchment border-t border-warm-grey-light/40 py-12">
          <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20 flex flex-col sm:flex-row justify-between gap-6">
            {prevPost ? (
              <Link
                to="/journal/$slug"
                params={{ slug: prevPost.slug }}
                className="group flex flex-col gap-1 max-w-xs"
              >
                <span className="text-gold uppercase text-[10px]" style={{ letterSpacing: "0.2em" }}>← Previous</span>
                <span
                  className="text-ink group-hover:text-umber transition-colors leading-snug"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 16 }}
                >
                  {prevPost.title}
                </span>
              </Link>
            ) : <div />}

            {nextPost ? (
              <Link
                to="/journal/$slug"
                params={{ slug: nextPost.slug }}
                className="group flex flex-col gap-1 max-w-xs text-right"
              >
                <span className="text-gold uppercase text-[10px]" style={{ letterSpacing: "0.2em" }}>Next →</span>
                <span
                  className="text-ink group-hover:text-umber transition-colors leading-snug"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 16 }}
                >
                  {nextPost.title}
                </span>
              </Link>
            ) : <div />}
          </div>
        </nav>
      )}
    </>
  );
}
