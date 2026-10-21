import { Link } from "@tanstack/react-router";


export default function Footer() {
  // bottom padding = the floating dock's height + its offset, so the last line always rests above it
  return (
    <footer className="bg-ink text-warm-grey-light relative pb-[calc(env(safe-area-inset-bottom)+92px)] md:pb-[96px]">
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
          <div className="flex items-center gap-4 mt-6">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/ins_overseas"
              target="_blank"
              rel="noreferrer"
              className="text-warm-grey hover:text-gold transition-colors"
              aria-label="Instagram"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            {/* X (Twitter) */}
            <a
              href="https://x.com/insoverseas999"
              target="_blank"
              rel="noreferrer"
              className="text-warm-grey hover:text-gold transition-colors"
              aria-label="X (Twitter)"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>

            {/* Pinterest */}
            <a
              href="https://pin.it/4eYZu9NB2"
              target="_blank"
              rel="noreferrer"
              className="text-warm-grey hover:text-gold transition-colors"
              aria-label="Pinterest"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/ins-overseas-b11b9a415"
              target="_blank"
              rel="noreferrer"
              className="text-warm-grey hover:text-gold transition-colors"
              aria-label="LinkedIn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/profile.php?id=61590863317913"
              target="_blank"
              rel="noreferrer"
              className="text-warm-grey hover:text-gold transition-colors"
              aria-label="Facebook"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com/@insoverseas?si=3s86uuttDHJIOMpE"
              target="_blank"
              rel="noreferrer"
              className="text-warm-grey hover:text-gold transition-colors"
              aria-label="YouTube"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.518 3.545 12 3.545 12 3.545s-7.518 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.87.508 9.388.508 9.388.508s7.518 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
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
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20 pb-10">
        <div className="flex flex-wrap items-center justify-between gap-4 
                        pt-8 mt-8 border-t border-white/10">
          <p
            className="text-warm-grey/50"
            style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 12 }}
          >
            © 2025 INS Overseas. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/privacy-policy"
              className="text-warm-grey/50 hover:text-gold transition-colors"
              style={{ fontFamily: "var(--font-body)", fontSize: 12 }}
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-use"
              className="text-warm-grey/50 hover:text-gold transition-colors"
              style={{ fontFamily: "var(--font-body)", fontSize: 12 }}
            >
              Terms of Use
            </Link>
          </div>
        </div>
        <p
          className="mt-5 text-center text-warm-grey/50"
          style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 12 }}
        >
          Developed by{" "}
          <a
            href="https://wa.me/918595475007?text=Hello%2C%20I%E2%80%99m%20interested%20in%20developing%20a%20website."
            target="_blank"
            rel="noreferrer"
            className="text-warm-grey/70 hover:text-gold transition-colors underline-offset-4 hover:underline"
          >
            Yash Marwal
          </a>
        </p>
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
