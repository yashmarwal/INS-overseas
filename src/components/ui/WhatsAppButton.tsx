import { MessageCircle } from "lucide-react";
import { useState } from "react";

export default function WhatsAppButton() {
  const [hover, setHover] = useState(false);
  return (
    <a
      href="https://wa.me/919680478483"
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="fixed right-4 md:right-6 z-40 flex items-center gap-3 bg-[#25D366] text-white rounded-full shadow-2xl transition-all duration-300 bottom-24 md:bottom-6"
      style={{
        paddingLeft: hover ? 18 : 16,
        paddingRight: hover ? 22 : 16,
        height: 48,
      }}
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
      <MessageCircle size={22} className="relative" />
      {hover && (
        <span className="text-sm font-medium whitespace-nowrap relative" style={{ fontFamily: "var(--font-body)" }}>
          Chat on WhatsApp
        </span>
      )}
    </a>
  );
}
