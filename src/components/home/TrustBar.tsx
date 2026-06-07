import { useCounter } from "@/hooks/useCounter";

const stats = [
  { label: "Established", value: 1995, suffix: "", prefix: "EST. " },
  { label: "Countries Served", value: 40, suffix: "+" },
  { label: "Years of Craft", value: 30, suffix: "" },
  { label: "Products Shipped", value: 10000, suffix: "+" },
];

function Stat({ value, suffix, prefix, label }: { value: number; suffix?: string; prefix?: string; label: string }) {
  const { value: v, ref } = useCounter(value);
  return (
    <div className="flex flex-col items-center text-center px-4">
      <span
        ref={ref}
        className="text-gold"
        style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(28px, 3.2vw, 36px)" }}
      >
        {prefix}{v.toLocaleString()}{suffix}
      </span>
      <span
        className="mt-2 text-warm-grey-light uppercase"
        style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: 11, letterSpacing: "0.2em" }}
      >
        {label}
      </span>
    </div>
  );
}

export default function TrustBar() {
  return (
    <section className="bg-umber py-7">
      <div className="max-w-[1400px] mx-auto px-5 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-y-6 md:divide-x divide-gold/30">
        {stats.map((s) => (
          <Stat key={s.label} {...s} />
        ))}
      </div>
    </section>
  );
}
