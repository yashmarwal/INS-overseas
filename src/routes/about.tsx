import { createFileRoute } from "@tanstack/react-router";
import PageHero from "@/components/shared/PageHero";
import SectionHeading from "@/components/shared/SectionHeading";
import TrustBar from "@/components/home/TrustBar";
import { motion } from "framer-motion";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story | INS Overseas — 30 Years of Rajasthani Craft" },
      { name: "description", content: "Founded in 1995 in Sanganer, Jaipur — the historic heart of Indian papermaking. Three decades of handcrafted journals and paper, exported worldwide." },
    ],
  }),
  component: About,
});

const values = [
  { title: "Craftsmanship", text: "Every page, every stitch is touched by human hands trained over generations." },
  { title: "Sustainability", text: "Tree-free, chemical-free, zero-waste — luxury that does not cost the earth." },
  { title: "Global Vision", text: "Jaipur taste, world reach. We partner with boutique retailers in 40+ countries." },
];

function About() {
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title={<>Made in Sanganer.<br /><em className="italic font-light text-gold-light">Loved Worldwide.</em></>}
        subtitle="Three decades of handcrafted leather and paper, born in the historic papermaking village of Sanganer."
        image="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=2200&q=80"
      />

      <section className="bg-cream py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 space-y-7 text-umber-dark" style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 17, lineHeight: 1.85 }}>
          <p>
            INS Overseas was founded in 1995 in Sanganer — a village on the outskirts of Jaipur whose
            papermaking tradition stretches back to the Mughal era. For centuries, the Kagzi community
            here has lifted cotton-pulp sheets from manual vats and dried them under the Rajasthan sun.
          </p>
          <p>
            We started small: one workshop, three artisans, a single export order to a London stationer.
            Today our atelier ships journals, papers and leather goods to more than forty countries — but
            the craft has not changed. The same vats. The same hands. The same patient rhythm.
          </p>
          <p>
            We believe handcrafted objects carry a spirit no machine can replicate. That conviction guides
            every order we accept and every sheet we send out into the world.
          </p>
        </div>
      </section>

      <section className="bg-parchment py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20">
          <SectionHeading eyebrow="What We Stand For" title={<>Our <em className="italic font-light">Values</em></>} />
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
            {values.map((v, i) => (
              <motion.div key={v.title}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: i * 0.1 }}
                className="border-t border-gold/40 pt-8"
              >
                <h3 className="text-3xl text-ink" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>{v.title}</h3>
                <p className="mt-4 text-umber leading-relaxed">{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <TrustBar />

      <section className="bg-cream py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeading eyebrow="Our Location" align="left" title={<>Rooted in <em className="italic font-light">Sanganer</em></>}>
              Jain Nasiya Road, Sanganer, Jaipur – 302029, Rajasthan, India. Visitors and trade buyers welcome by appointment.
            </SectionHeading>
          </div>
          <div className="aspect-[4/3] overflow-hidden">
            <iframe
              title="Sanganer, Jaipur map"
              src="https://www.google.com/maps?q=Sanganer,Jaipur&output=embed"
              className="w-full h-full grayscale-[40%] sepia-[20%]"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </>
  );
}
