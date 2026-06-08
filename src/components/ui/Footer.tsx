import { Link } from "@tanstack/react-router";
function Instagram({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-ink text-warm-grey-light relative">
      <div className="h-6 -mt-6 bg-parchment torn-edge-bottom" aria-hidden />
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20 pt-20 pb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div>
          <h3
            className="text-cream text-xl"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500, letterSpacing: "0.15em" }}
          >
            INS OVERSEAS
          </h3>
          <p className="text-[10px] tracking-[0.2em] mt-1 text-gold">EST. 1995 · JAIPUR, INDIA</p>
          <p className="mt-6 text-sm font-light leading-relaxed max-w-[260px]">
            Handcrafted with intention. Shipped with pride.
          </p>
          <a
            href="https://instagram.com/ins_overseas"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 mt-6 text-sm hover:text-gold transition-colors"
          >
            <Instagram size={16} /> @ins_overseas
          </a>
        </div>

        <FooterCol
          title="Products"
          links={[
            ["Leather Journals", "/products/leather-journals"],
            ["Handmade Paper", "/products/handmade-paper"],
            ["Artisan Stationery", "/products/stationery"],
            ["Leather Accessories", "/products/leather-accessories"],
            ["Custom Orders", "/wholesale"],
            ["Wholesale Catalogue", "/wholesale"],
          ]}
        />
        <FooterCol
          title="Company"
          links={[
            ["About Us", "/about"],
            ["Our Craft", "/our-craft"],
            ["Sustainability", "/sustainability"],
            ["Gallery", "/gallery"],
            ["Journal", "/journal"],
            ["Contact", "/contact"],
          ]}
        />

        <div>
          <h4 className="text-cream uppercase tracking-[0.2em] text-xs mb-5">Contact</h4>
          <p className="text-sm leading-relaxed">
            Jain Nasiya Road, Near Jain Hostel,
            <br />
            Sanganer, Jaipur – 302029
            <br />
            Rajasthan, India
          </p>
          <p className="mt-4 text-sm">
            <a href="tel:+919680478483" className="hover:text-gold">+91 96804 78483</a>
          </p>
          <p className="text-sm">
            <a href="mailto:Sezan@ins-overseas.com" className="hover:text-gold">Sezan@ins-overseas.com</a>
          </p>
          <p className="text-sm mt-3 text-warm-grey">Mon–Sat · 24 Hours</p>
        </div>
      </div>
      <div className="border-t border-warm-grey/20">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20 py-6 flex flex-col sm:flex-row items-center justify-between text-xs text-warm-grey">
          <p>© 2025 INS Overseas. All rights reserved.</p>
          <div className="flex gap-6 mt-3 sm:mt-0">
            <a href="#" className="hover:text-gold">Privacy Policy</a>
            <a href="#" className="hover:text-gold">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="text-cream uppercase tracking-[0.2em] text-xs mb-5">{title}</h4>
      <ul className="space-y-3 text-sm">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link to={href} className="hover:text-gold transition-colors">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
