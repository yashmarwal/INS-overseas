import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | INS Overseas" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
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
            Privacy Policy
          </h1>
          <p className="text-warm-grey mb-12" style={{ fontFamily: "var(--font-body)", fontSize: 13 }}>
            Last updated: June 2025
          </p>

          <div
            className="space-y-10 text-umber-dark"
            style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 16, lineHeight: 1.85 }}
          >
            <Section title="1. Who We Are">
              INS Overseas is a manufacturer and exporter of handmade leather journals, cotton rag paper, and artisan gift products, located at Jain Nasiya Road, Near Jain Hostel, Sanganer, Jaipur – 302029, Rajasthan, India. Our website is https://ins-overseas.com. For privacy-related queries, contact us at Sezan@ins-overseas.com.
            </Section>

            <Section title="2. What Information We Collect">
              We collect information you provide directly to us when you:
              fill in our contact or wholesale enquiry forms (name, email, phone, company, country, message), subscribe to updates, or contact us by email or WhatsApp. We do not collect payment information on this website. We do not use tracking pixels, behavioural advertising, or sell your data to third parties.
            </Section>

            <Section title="3. How We Use Your Information">
              We use the information you provide to respond to your enquiries, send you our product catalogue and pricing information, process wholesale orders, and improve our website and services. We do not send unsolicited marketing emails.
            </Section>

            <Section title="4. Cookies">
              Our website uses only essential cookies necessary for the site to function. We do not use advertising cookies or third-party tracking cookies. The Instagram feed on our homepage is provided by Behold.so, which may set its own cookies subject to their privacy policy.
            </Section>

            <Section title="5. Data Storage and Security">
              Enquiry form submissions are processed via Web3Forms and sent directly to our email. We do not store your form data on our own servers. Images uploaded through our admin panel are stored securely on Supabase (supabase.com). We take reasonable steps to protect your information from unauthorised access.
            </Section>

            <Section title="6. Third-Party Services">
              Our website uses the following third-party services: Supabase (image storage), Web3Forms (form submissions), Behold.so (Instagram feed), Vimeo (video hosting), Google Analytics (website traffic — anonymised). Each of these services has its own privacy policy governing their use of data.
            </Section>

            <Section title="7. Your Rights">
              You have the right to request access to, correction of, or deletion of any personal data we hold about you. To exercise these rights, contact us at Sezan@ins-overseas.com. We will respond within 30 days.
            </Section>

            <Section title="8. Children's Privacy">
              Our website is not directed at children under 13. We do not knowingly collect personal information from children.
            </Section>

            <Section title="9. Changes to This Policy">
              We may update this privacy policy from time to time. The date at the top of this page indicates when it was last revised. Continued use of the website after changes constitutes acceptance of the updated policy.
            </Section>

            <Section title="10. Contact">
              For any privacy-related questions: Sezan@ins-overseas.com or write to us at Jain Nasiya Road, Near Jain Hostel, Sanganer, Jaipur – 302029, India.
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
