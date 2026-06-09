import { createFileRoute } from "@tanstack/react-router";
import PageHero from "@/components/shared/PageHero";
import SectionHeading from "@/components/shared/SectionHeading";
import TrustBar from "@/components/home/TrustBar";
import { motion } from "framer-motion";
import { Leaf, Globe, Star, Award } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Four-Generation Handmade Paper Legacy | INS Overseas Jaipur" },
      { name: "description", content: "INS Overseas is one of India's largest manufacturers of eco-friendly handmade paper and leather journals. A four-generation family legacy from Sanganer, Jaipur since 1995." },
      { property: "og:title", content: "About INS Overseas — India's Leading Eco-Friendly Paper Manufacturer" },
      { property: "og:url", content: "https://insoverseas.com/about" },
    ],
  }),
  component: About,
});

const values = [
  {
    icon: Award,
    title: "Largest Manufacturer",
    text: "We lead the industry in cotton recycled handmade and gift paper production, with India's highest production capacity to meet your largest global demands consistently.",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly",
    text: "Our papers are crafted entirely from recycled cotton — an environmentally conscious solution that delivers premium quality without compromising the planet.",
  },
  {
    icon: Star,
    title: "Premium Quality",
    text: "From soft textures to precision-bound journals, every product upholds the standard of excellence our global clients have trusted for over three decades.",
  },
  {
    icon: Globe,
    title: "Trusted Exporter",
    text: "Recognised globally for reliability, consistency, and outstanding service. We proudly export to clients across 40+ countries who continue to place repeat orders.",
  },
];

const whyUs = [
  "India's highest production capacity for handmade cotton paper",
  "Four-generation family craft rooted in Sanganer, Jaipur",
  "100% recycled cotton — zero trees, zero harsh chemicals",
  "Wide range: journals, seed papers, gift boxes, ornaments, paper bags, handmade sheets",
  "Consistent quality across small samples and large bulk orders",
  "Competitive pricing with no compromise on craftsmanship",
  "Trusted by boutique retailers, corporates and designers in 40+ countries",
];

function About() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title={
          <>
            India's Leading<br />
            <em className="italic font-light text-gold-light">
              Eco-Friendly Paper Maker
            </em>
          </>
        }
        subtitle="A four-generation legacy of handcrafted paper and gift products — born in Sanganer, Jaipur. Exported worldwide."
        image="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=2200&q=80"
      />

      {/* Intro */}
      <section className="bg-cream py-24 lg:py-32">
        <div
          className="max-w-3xl mx-auto px-5 sm:px-8 space-y-7 text-umber-dark"
          style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 17, lineHeight: 1.85 }}
        >
          <p>
            INS Overseas is one of India's largest manufacturers and exporters of
            eco-friendly handmade paper and premium handmade gift products. Our journey
            began in a single small room, where our great-grandfather started this craft
            with deep dedication and respect for nature.
          </p>
          <p>
            Today, with four generations of experience and the country's highest
            production capacity, we proudly meet large global demands with consistent
            quality. We create a wide range of handmade products — journals, seed papers,
            ornaments, paper bags, handmade sheets, and gift boxes — crafted using natural
            and recycled materials that do not harm the environment.
          </p>
          <p>
            Our brand stands for premium quality, customer satisfaction, ethical
            standards, and sustainable craftsmanship. Rooted in tradition yet driven by
            innovation, INS Overseas carries forward a legacy of eco-friendly
            paper-making that connects our heritage with a greener future.
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-parchment-dark linen py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="border-l-2 border-gold pl-8"
          >
            <p
              className="text-gold uppercase mb-4"
              style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 11, letterSpacing: "0.25em" }}
            >
              Our Vision
            </p>
            <h3
              className="text-ink mb-6"
              style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(24px, 3vw, 36px)", lineHeight: 1.2 }}
            >
              Global Leader in Sustainable Handmade Paper
            </h3>
            <p
              className="text-umber-dark leading-relaxed"
              style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 16, lineHeight: 1.8 }}
            >
              To be the global leader in sustainable, recycled handmade paper and premium
              gift paper products — setting benchmarks in quality, innovation, and
              eco-conscious manufacturing while preserving the rich heritage of
              papermaking and promoting a greener tomorrow.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="border-l-2 border-gold pl-8"
          >
            <p
              className="text-gold uppercase mb-4"
              style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 11, letterSpacing: "0.25em" }}
            >
              Our Mission
            </p>
            <h3
              className="text-ink mb-6"
              style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(24px, 3vw, 36px)", lineHeight: 1.2 }}
            >
              Crafting Excellence, Honouring Tradition
            </h3>
            <ul
              className="space-y-3 text-umber-dark"
              style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 15, lineHeight: 1.75 }}
            >
              {[
                "Manufacture and export high-quality, eco-friendly handcrafted paper products that inspire creativity and sustainability.",
                "Serve customers with unmatched service, value, and reliability through continuous innovation.",
                "Uphold strong ethical standards, care for our artisans, and contribute to a cleaner planet.",
                "Honour the legacy of traditional papermaking while adopting modern methods to meet growing global demand.",
              ].map((item, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="mt-2 shrink-0 w-1.5 h-1.5 rounded-full bg-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Trust bar */}
      <TrustBar />

      {/* Why Choose Us */}
      <section className="bg-cream py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20">
          <SectionHeading
            eyebrow="Why Choose Us"
            title={<>Built on Trust. <em className="italic font-light">Proven by Quality.</em></>}
          />

          {/* 4 value cards */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="bg-parchment p-8 border-t-2 border-gold"
              >
                <v.icon className="text-gold mb-5" size={28} />
                <h3
                  className="text-ink mb-4"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 22 }}
                >
                  {v.title}
                </h3>
                <p
                  className="text-umber leading-relaxed"
                  style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 14, lineHeight: 1.75 }}
                >
                  {v.text}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Why us checklist */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 bg-parchment-dark linen p-8 md:p-12"
          >
            <p
              className="text-gold uppercase mb-8"
              style={{ fontFamily: "var(--font-body)", fontWeight: 400, fontSize: 11, letterSpacing: "0.25em" }}
            >
              What Sets Us Apart
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {whyUs.map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <span className="mt-1 shrink-0 text-gold" style={{ fontSize: 18 }}>✓</span>
                  <p
                    className="text-umber-dark"
                    style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 15, lineHeight: 1.7 }}
                  >
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Location */}
      <section className="bg-parchment py-24 lg:py-32">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <SectionHeading
              eyebrow="Our Location"
              align="left"
              title={<>Rooted in <em className="italic font-light">Sanganer</em></>}
            >
              Jain Nasiya Road, Near Jain Hostel, Sanganer, Jaipur – 302029,
              Rajasthan, India. Trade buyers and visitors welcome by appointment.
            </SectionHeading>
          </div>
          <div className="aspect-[4/3] overflow-hidden rounded-sm">
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
