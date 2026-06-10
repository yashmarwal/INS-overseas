import { createFileRoute } from "@tanstack/react-router";
import PageHero from "@/components/shared/PageHero";
import { motion } from "framer-motion";

const posts = [
  {
    slug: "art-of-deckle-edges",
    cat: "Craft Stories",
    date: "May 2025",
    readTime: "4 min read",
    img: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80",
    title: "The Art of Deckle Edges — Why Handmade Paper Feels Different",
    excerpt: "That soft, irregular fringe at the edge of a handmade sheet is not a flaw. It is the most honest thing about the paper. We explain how deckle edges form and why every serious paper collector prizes them.",
    content: `
When you hold a sheet of our handmade cotton paper for the first time, the first thing you notice is the edge. It is not straight. It is not cut. It feathers outward in a soft, organic fringe that catches the light differently at every angle.

That edge is called the deckle edge. And it is not a byproduct of imperfect manufacturing — it is proof that no machine touched this paper.

**How it forms**

Our papermakers in Sanganer use a mold and deckle — two wooden frames, one with a fine mesh screen stretched across it (the mold), one without (the deckle). The deckle sits on top of the mold as the papermaker dips the entire frame into a vat of cotton pulp suspended in water.

As the frame is lifted out, water drains through the mesh and the cotton fibers begin to mat together. Where the pulp reaches the edge of the deckle frame, it seeps slightly underneath — creating that characteristic soft, uneven border as it dries.

Every sheet is different. Every edge is unrepeatable.

**Why buyers love it**

Fountain pen writers value deckle edges as a sign of paper quality — if the edges are hand-formed, the body of the paper is likely made with the same care. Watercolour artists prize the texture. Bookbinders use deckle-edge sheets for endpapers in fine editions. And retailers find that deckle-edge notebooks sell faster than machine-cut ones, simply because customers can feel the difference.

**What kills deckle edges**

Humidity, pressure, and careless storage. Our journals are packed in tissue and boxed individually precisely to protect the edges in transit. If you are storing loose sheets, keep them flat, in a cool dry place, away from direct sunlight.

A deckle edge is fragile. That is part of what makes it precious.
    `,
  },
  {
    slug: "sanganer-village-papers-world",
    cat: "Jaipur Heritage",
    date: "Apr 2025",
    readTime: "5 min read",
    img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=900&q=80",
    title: "Sanganer: The Ancient Village That Papers the World",
    excerpt: "Fifteen kilometres from Jaipur's old city, on the banks of the Sâmbhar river, a community has been making paper by hand for over 400 years. This is their story — and ours.",
    content: `
If you have ever received a handmade paper journal from India, there is a good chance it passed through Sanganer.

The village — now technically a township absorbed into the sprawl of Jaipur — has been a centre of paper and textile craft since the Mughal era. The Kagzi community (kagaz means paper in Hindi) settled here generations ago and built an industry that has survived industrialisation, partition, and globalisation through sheer quality.

**The craft that refused to die**

In the 1980s, machine-made paper threatened to end handmade paper production everywhere in India. Most centres did not survive. Sanganer did, partly because of its artisan community's stubbornness, and partly because the global market for premium handmade paper was just beginning to grow.

European stationery buyers discovered Sanganer in the early 1990s. INS Overseas was among the first exporters to serve them systematically, shipping handmade journals and paper sheets to boutiques in London, Amsterdam, and Paris.

**The cotton rag process**

What makes Sanganer paper different from most Indian handmade paper is the raw material. The Kagzi families of Sanganer have always used cotton rags rather than plant fibre. Cotton rags — sourced today from the textile mills of Tirupur, Bengaluru, and Punjab — produce a paper that is stronger, more bleed-resistant, and more archival than anything made from wood pulp.

The rags are cleaned, beaten into pulp, and pulled by hand into individual sheets on molds. The entire process uses no harsh chemicals. The paper is dried in the Rajasthan sun.

**What we are protecting**

When you buy a journal from INS Overseas, you are sustaining a craft that 25 families in Sanganer depend on. You are also buying into 400 years of accumulated knowledge about how to make paper that lasts.

We do not take that lightly.
    `,
  },
  {
    slug: "leather-journal-care-guide",
    cat: "Product Care",
    date: "Mar 2025",
    readTime: "3 min read",
    img: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80",
    title: "How to Care for Your Leather Journal — A Complete Guide",
    excerpt: "Buffalo leather improves with age — but only if you treat it right. Here is everything your customers need to know about conditioning, storing, and using their INS Overseas journal.",
    content: `
A well-made leather journal should last decades. The buffalo leather we use at INS Overseas is full-grain — the outermost layer of the hide, with all the natural grain intact. It is the most durable part of the leather, and it develops a patina over time that makes each journal unique.

But leather is skin. It needs care.

**Conditioning**

New leather is dry. Before first use, apply a small amount of leather conditioner or pure beeswax to the cover using a soft cloth. Rub in small circular motions. Buff off the excess. This prevents cracking and deepens the colour.

Condition your journal every 3–6 months depending on use and climate. In dry climates, condition more frequently. In humid climates, condition less.

Do not use: petroleum-based products, silicone sprays, or anything marketed as a "protector" rather than a conditioner. These clog the pores of the leather.

**Storing**

Store your journal upright on a shelf, away from direct sunlight. UV light fades leather and dries it out faster than almost anything else.

Do not leave your journal in a car or bag in direct heat. Temperatures above 40°C can warp the leather permanently.

**Water damage**

If your journal gets wet, do not panic. Blot off excess water with a clean cloth — do not rub. Allow to dry naturally at room temperature. Once dry, apply conditioner. The leather may darken slightly where it got wet — this is normal and usually fades.

**The wrap strap**

The leather wrap strap on your journal will loosen over time with use. This is intentional — it forms to the size of your journal as it fills with pages. The brass hardware is solid and does not require polishing.

**Ageing beautifully**

The best thing you can do for your leather journal is use it. The oils from your hands condition the leather naturally. The scratches and marks it accumulates tell the story of where it has been. A ten-year-old INS Overseas journal, well-used and well-loved, is a more beautiful object than a new one.

That is the point.
    `,
  },
  {
    slug: "paper-fountain-pen-vs-watercolour",
    cat: "How-To Guides",
    date: "Feb 2025",
    readTime: "4 min read",
    img: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=80",
    title: "Choosing Paper for Fountain Pens vs Watercolour — What Actually Matters",
    excerpt: "Not all handmade paper is the same. The weight, surface texture, and sizing treatment all determine whether your pen glides or catches, whether your colours bleed or bloom. A practical guide.",
    content: `
We get asked this question constantly by retailers sourcing for art supply shops: which of your papers works for fountain pens, and which for watercolour?

The honest answer is that our cotton rag paper works for both — but not identically, and knowing why helps you choose the right product for your customers.

**What fountain pen writers need**

Fountain pen ink is water-based and flows freely. The paper needs to be:

- **Sized** — treated to resist liquid absorption. Unsized paper causes ink to bleed into the fibres immediately, creating feathering.
- **Smooth enough** to allow the nib to glide without catching. Our standard cotton rag has a natural texture that most nib sizes handle well. Very fine nibs (EF, F) perform best on our smoother pressed sheets.
- **Dry quickly** — cotton rag paper absorbs and releases moisture well, which means ink dries faster than on coated papers.

Our unlined deckle-edge notebooks use medium-weight (120 gsm) cotton rag with light internal sizing. They have been tested by our buyers with Pilot, Lamy, Waterman, and TWSBI pens without feathering or bleed-through.

**What watercolour artists need**

Watercolour requires the opposite of quick absorption. Artists want the paint to stay workable on the surface long enough to blend and layer. They need:

- **Weight** — our 200–300 gsm cotton sheets hold water without buckling.
- **Texture (tooth)** — the natural grain of our handmade paper holds pigment in the valleys, creating the characteristic soft edge of watercolour on cotton.
- **No fluorescent whiteners** — our paper contains none. This matters for colour accuracy.

**The practical answer for retailers**

If you are stocking for a general stationery audience: our standard 120 gsm lined and unlined notebooks work for both fountain pens and light watercolour use.

If you are stocking for serious artists: specify our loose sheet packs in 200+ gsm. These are designed for painting and mixed media use and will outperform anything made from wood pulp.
    `,
  },
  {
    slug: "hand-stitched-bindings",
    cat: "Craft Stories",
    date: "Jan 2025",
    readTime: "3 min read",
    img: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=900&q=80",
    title: "Hand-Stitched Bindings: An Ancient Skill That Holds Everything Together",
    excerpt: "The binding is the most technically demanding part of making a journal. We use three traditional stitch methods — Coptic, long stitch, and saddle stitch. Here is what each one does and why it matters.",
    content: `
You can tell a lot about a journal by looking at its spine.

A machine-bound book has a flat, uniform spine with no visible stitching. A hand-bound journal has a spine that shows the work — waxed linen thread, carefully tensioned, running through the signatures of paper in a pattern that has been used by bookbinders for centuries.

At INS Overseas, every journal is hand-sewn by our binding team in Sanganer. We use three main stitch methods depending on the design and the intended use.

**Coptic stitch**

The Coptic stitch originated in Egypt in the early Christian era and is one of the oldest surviving binding techniques. It leaves the spine exposed — you can see the thread linking each signature. The book lies completely flat when open at any page, which makes it ideal for journals and sketchbooks.

Our Coptic-bound journals have no glue in the spine. They are held together entirely by thread tension. Done correctly, they last for generations.

**Long stitch**

Long stitch bindings thread through the cover directly, creating a visible pattern of stitches on the outside spine. It is a stronger structure than Coptic for heavy use and handles well even when carried in a bag.

We use long stitch for our travel journals and larger A4 formats where the additional page count puts more stress on the binding.

**Saddle stitch**

For our smaller A6 notebooks and pocket journals, we use saddle stitch — a two-needle technique where thread passes through the same holes in opposite directions. It creates a very tight, durable seam that is difficult to unpick and holds under repeated use.

**Why it matters for buyers**

Machine-bound books fail at the spine. The glue cracks, pages fall out, and the book eventually comes apart. A well hand-stitched journal does not do this. The thread stretches slightly under stress and returns. The signatures flex independently.

Our binding team stitches by feel as much as by sight. Every journal passes through their hands twice — once to sew, once to inspect. It takes longer. That is why it holds.
    `,
  },
  {
    slug: "wholesale-guide-sourcing-handmade-paper-india",
    cat: "Wholesale Guide",
    date: "Dec 2024",
    readTime: "5 min read",
    img: "https://images.unsplash.com/photo-1597149959983-9ac80c4a9e64?auto=format&fit=crop&w=900&q=80",
    title: "The Complete Guide to Sourcing Handmade Paper Products from India",
    excerpt: "For boutique retailers, gift shops and stationery brands considering India as a source market — what to look for, what to avoid, and how to build a reliable supply relationship.",
    content: `
India is the world's largest producer of handmade cotton rag paper. The craft is concentrated in three regions: Sanganer in Rajasthan, Kagzi in Uttar Pradesh, and parts of West Bengal. If you are a retailer or brand looking to source premium handmade paper products, you will eventually end up dealing with one of these regions.

Here is what three decades of exporting has taught us about making that relationship work.

**What to look for in a manufacturer**

The first question is not price. It is consistency. Handmade paper varies naturally between batches — but a professional manufacturer minimises that variation through process control. Ask for samples from three different production runs, not one. If the weight, texture, and colour are consistent across all three, the manufacturer has their process under control.

Ask about raw material sourcing. Cotton rag paper is only as good as the cotton used. Manufacturers who source from certified textile mills produce more consistent paper than those who buy from informal markets.

**Minimum order quantities**

Most serious manufacturers in Sanganer require a minimum of 200 units per design for wholesale orders. Be wary of manufacturers who accept orders of 20 or 50 units — they are likely middlemen, not manufacturers, and their pricing will not allow you to build a sustainable retail margin.

**Lead times**

Standard production takes 25–35 days after order confirmation and payment of advance. Custom orders with embossing, debossing, or non-standard sizes take 40–50 days. Build this into your buying calendar. Do not place your first order expecting to receive it in two weeks.

**Payment terms**

The standard in the industry is 50% advance on order confirmation, 50% before shipment. Established manufacturers may offer 30/70 terms after a track record of 3–5 orders. Avoid manufacturers who ask for 100% advance on first orders — this is a red flag.

**Building a long-term relationship**

The best source relationships are not transactional. Visit your manufacturer if possible — Jaipur is accessible and the workspace visits are always illuminating. Communicate clearly about your customers' preferences. Give feedback on every order.

At INS Overseas, our longest-standing clients have been with us for over a decade. They get priority production scheduling, first access to new products, and pricing that reflects the relationship. That is what consistent, honest sourcing builds.
    `,
  },
];

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Journal | INS Overseas — Craft Stories & Jaipur Heritage" },
      { name: "description", content: "Essays on handmade paper, leather binding, Rajasthani craft, and care guides for your INS Overseas pieces." },
    ],
  }),
  component: Journal,
});

function Journal() {
  return (
    <>
      <PageHero
        eyebrow="The Journal"
        title={<>Stories From <em className="italic font-light text-gold-light">Sanganer</em></>}
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
              className="group cursor-pointer"
            >
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
                style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "clamp(18px, 2vw, 24px)" }}
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
            </motion.article>
          ))}
        </div>
      </section>
    </>
  );
}
