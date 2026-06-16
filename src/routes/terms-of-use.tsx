import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/terms-of-use")({
  head: () => ({
    meta: [
      { title: "Terms of Use | INS Overseas" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TermsOfUse,
});

function TermsOfUse() {
  return (
    <div className="bg-cream min-h-screen pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-gold uppercase mb-4"
            style={{ fontFamily: "var(--font-body)", fontSize: 11, letterSpacing: "0.25em" }}
          >
            Legal
          </p>
          <h1
            className="text-ink mb-3"
            style={{ fontFamily: "var(--font-display)", fontWeight: 300, fontSize: "clamp(32px, 4vw, 56px)" }}
          >
            Terms of Use
          </h1>
          <p className="text-warm-grey mb-12" style={{ fontFamily: "var(--font-body)", fontSize: 13 }}>
            Last updated: June 2025
          </p>

          <div
            className="space-y-10 text-umber-dark"
            style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 16, lineHeight: 1.85 }}
          >
            <Section title="1. Acceptance of Terms">
              By accessing and using https://ins-overseas.com, you accept and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use this website.
            </Section>

            <Section title="2. About INS Overseas">
              INS Overseas is a registered manufacturer and exporter of handmade paper and leather products based in Sanganer, Jaipur, India. This website serves as our product showcase and wholesale enquiry platform. It is not an e-commerce store — no purchases are made directly on this site.
            </Section>

            <Section title="3. Use of This Website">
              You may use this website for lawful purposes only. You agree not to use this site to transmit unsolicited communications, attempt to gain unauthorised access to any part of the website, scrape, copy, or redistribute our content without written permission, or misrepresent your identity or affiliation when submitting enquiries.
            </Section>

            <Section title="4. Intellectual Property">
              All content on this website — including text, images, videos, product photography, the INS Overseas logo, and design — is the property of INS Overseas or its content suppliers and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works from our content without prior written permission.
            </Section>

            <Section title="5. Product Information">
              All product descriptions, specifications, and images on this website are provided for informational purposes. As our products are handmade, there will be natural variations in colour, texture, size, and appearance between individual pieces and between production batches. These variations are a characteristic of handmade goods, not defects.
            </Section>

            <Section title="6. Wholesale Enquiries">
              Submitting an enquiry form on this website does not constitute a binding order or contract. All wholesale orders are subject to separate written confirmation, proforma invoice, and payment of advance as agreed between INS Overseas and the buyer.
            </Section>

            <Section title="7. External Links">
              This website contains links to third-party websites including Instagram, LinkedIn, X (Twitter), Pinterest, and Vimeo. These links are provided for convenience. INS Overseas has no control over the content of those sites and accepts no responsibility for them.
            </Section>

            <Section title="8. Limitation of Liability">
              INS Overseas makes no warranties, expressed or implied, about the accuracy or completeness of information on this website. To the fullest extent permitted by law, INS Overseas shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of this website.
            </Section>

            <Section title="9. Governing Law">
              These terms are governed by the laws of India. Any disputes arising from use of this website shall be subject to the exclusive jurisdiction of the courts of Jaipur, Rajasthan, India.
            </Section>

            <Section title="10. Changes to These Terms">
              We reserve the right to modify these terms at any time. The date at the top of this page indicates when they were last revised. Continued use of the website constitutes acceptance of any changes.
            </Section>

            <Section title="11. Contact">
              For any questions about these terms: Sezan@ins-overseas.com or write to INS Overseas, Jain Nasiya Road, Near Jain Hostel, Sanganer, Jaipur – 302029, Rajasthan, India.
            </Section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2
        className="text-ink mb-4"
        style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: 22 }}
      >
        {title}
      </h2>
      <p>{children}</p>
    </div>
  );
}
