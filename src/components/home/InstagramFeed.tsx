import { useEffect } from "react";

export default function InstagramFeed() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://w.behold.so/widget.js";
    script.type = "module";
    document.head.appendChild(script);
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Use a ref-based container so TS doesn't need to know the custom element type
  const BeholdWidget = "behold-widget" as unknown as React.ElementType;

  return (
    <section className="bg-cream py-20 md:py-24">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-20">

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-gold" />
            <div>
              <p
                className="text-gold uppercase"
                style={{ fontFamily: "var(--font-body)", fontSize: 11, fontWeight: 400, letterSpacing: "0.25em" }}
              >
                Follow Our Journey
              </p>
              <a
                href="https://www.instagram.com/ins_overseas"
                target="_blank"
                rel="noreferrer"
                className="text-ink hover:text-umber transition-colors"
                style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(20px, 2.5vw, 32px)" }}
              >
                @ins_overseas
              </a>
            </div>
          </div>
          <a
            href="https://www.instagram.com/ins_overseas"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 border border-umber text-umber uppercase px-5 py-2.5 hover:bg-umber hover:text-cream transition-colors shrink-0"
            style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 11, letterSpacing: "0.15em" }}
          >
            Follow on Instagram
          </a>
        </div>

        {/* Live Behold.so Instagram feed widget */}
        <BeholdWidget feed-id="WuYOWmn4Z0whV9Uh8FpV" />

      </div>
    </section>
  );
}
