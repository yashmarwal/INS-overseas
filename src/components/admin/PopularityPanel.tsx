import { useCallback, useEffect, useMemo, useState } from "react";
import { Copy, Eye, Mail, ListPlus, RefreshCw, Share2 } from "lucide-react";
import type { ProductImage } from "@/hooks/useProductImages";
import { adminCategoryLabel, useCategories } from "@/hooks/useCategories";
import { buildEventsSql, fetchEventsSince, probeEventsTable } from "@/lib/adminData";
import { EmptyState, GhostButton, MUTED, Panel, PrimaryButton, Spinner } from "@/components/admin/AdminUI";

type EventName = "view" | "share" | "quote" | "enquire";
const METRICS: { id: EventName; label: string; short: string; one: string; icon: typeof Eye }[] = [
  { id: "view", label: "Most viewed", short: "Views", one: "view", icon: Eye },
  { id: "share", label: "Most shared", short: "Shares", one: "share", icon: Share2 },
  { id: "quote", label: "Most quoted", short: "Quotes", one: "quote", icon: ListPlus },
  { id: "enquire", label: "Most enquired", short: "Enquiries", one: "enquiry", icon: Mail },
];
const PERIODS = [{ days: 7, label: "7 days" }, { days: 30, label: "30 days" }, { days: 90, label: "90 days" }];
type Counts = Record<EventName, number>;
const zero = (): Counts => ({ view: 0, share: 0, quote: 0, enquire: 0 });

// "What buyers like": how often each product was opened, shared, added to a quote list and enquired about.
export default function PopularityPanel({ products, email, showToast }: { products: ProductImage[]; email: string; showToast: (t: "success" | "error", m: string) => void }) {
  useCategories(); // category names (including the ones you made yourself)
  const [table, setTable] = useState<"checking" | "ready" | "missing">("checking");
  const [days, setDays] = useState(30);
  const [metric, setMetric] = useState<EventName>("view");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [byProduct, setByProduct] = useState<Map<string, Counts>>(new Map());
  const [totals, setTotals] = useState<Counts>(zero());
  const [showAll, setShowAll] = useState(false);
  const sql = useMemo(() => buildEventsSql(email), [email]);

  const check = useCallback(async () => {
    setTable("checking");
    try { setTable(await probeEventsTable()); } catch { setTable("missing"); }
  }, []);
  useEffect(() => { void check(); }, [check]);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const since = new Date(Date.now() - days * 86_400_000).toISOString();
      const rows = await fetchEventsSince(since);
      const m = new Map<string, Counts>();
      const t = zero();
      for (const r of rows) {
        if (!(r.event in t)) continue;
        const e = r.event as EventName;
        t[e]++;
        const c = m.get(r.product_id) ?? zero();
        c[e]++;
        m.set(r.product_id, c);
      }
      setByProduct(m); setTotals(t);
    } catch (e) {
      setError(e instanceof Error ? e.message : "unknown error");
    } finally { setLoading(false); }
  }, [days]);
  useEffect(() => { if (table === "ready") void load(); }, [table, load]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(sql); showToast("success", "Copied. Paste it into the Supabase SQL Editor and press Run."); }
    catch { showToast("error", "Couldn't copy automatically. Select the text and copy it."); }
  };

  const ranked = useMemo(() => {
    const list = products
      .map((p) => ({ p, c: byProduct.get(p.id) ?? zero() }))
      .filter((x) => x.c[metric] > 0)
      .sort((a, b) => b.c[metric] - a.c[metric] || b.c.view - a.c.view || (a.p.product_name || "").localeCompare(b.p.product_name || ""));
    return list;
  }, [products, byProduct, metric]);
  const shown = showAll ? ranked.slice(0, 50) : ranked.slice(0, 10);
  const top = ranked[0]?.c[metric] || 1;
  const metricInfo = METRICS.find((m) => m.id === metric)!;

  if (table === "checking") return <p className="text-[13px]" style={{ color: MUTED }} role="status">Checking...</p>;

  if (table === "missing") {
    return (
      <Panel className="p-5 sm:p-6">
        <h2 className="text-[17px] font-semibold">Turn on popularity stats (2 minutes)</h2>
        <p className="mt-1 text-[14px] leading-relaxed" style={{ color: MUTED }}>
          This shows which products your visitors open, share, add to a quote and enquire about. It needs one small table in your Supabase, created once. Only the product and what happened are saved: never names, emails or anything personal. Visitors can only add a line to it; only this login can read it.
        </p>
        <ol className="mt-3 list-decimal pl-5 space-y-1 text-[14px] leading-relaxed" style={{ color: "#4A3219" }}>
          <li>Open your project at supabase.com, then <b>SQL Editor</b>, then <b>New query</b>.</li>
          <li>Press <b>Copy SQL</b>, paste it in and press <b>Run</b>. It is written for <b>{email}</b>.</li>
          <li>Come back and press <b>I've run it</b>.</li>
        </ol>
        <pre className="mt-3 max-h-56 overflow-auto rounded-xl bg-[#1A1410] text-[#F5EFE0] p-3 text-[12px] leading-relaxed whitespace-pre-wrap" tabIndex={0}>{sql}</pre>
        <div className="mt-3 flex flex-wrap gap-2">
          <PrimaryButton onClick={() => void copy()}><Copy size={15} /> Copy SQL</PrimaryButton>
          <GhostButton onClick={() => void check()}>I've run it</GhostButton>
        </div>
      </Panel>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <div role="group" aria-label="Time period" className="inline-flex rounded-full bg-white border border-black/15 p-1">
          {PERIODS.map((p) => (
            <button key={p.days} type="button" aria-pressed={days === p.days} onClick={() => setDays(p.days)} className={`h-9 px-4 rounded-full text-[14px] font-medium transition-colors ${days === p.days ? "bg-[#6B4C2A] text-white" : "text-[#1A1410] hover:bg-black/[0.04]"}`}>Last {p.label}</button>
          ))}
        </div>
        <GhostButton onClick={() => void load()}><RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh</GhostButton>
      </div>

      <div className="mt-4 grid grid-cols-2 lg:grid-cols-4 gap-3" data-testid="pop-totals">
        {METRICS.map((m) => (
          <Panel key={m.id} className="p-4">
            <p className="flex items-center gap-2 text-[13px] font-medium" style={{ color: MUTED }}><m.icon size={15} /> {m.short}</p>
            <p className="mt-1 text-[28px] font-semibold tabular-nums leading-none" data-total={m.id}>{totals[m.id].toLocaleString()}</p>
          </Panel>
        ))}
      </div>

      <div role="tablist" aria-label="Rank products by" className="mt-6 flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {METRICS.map((m) => (
          <button key={m.id} role="tab" aria-selected={metric === m.id} type="button" onClick={() => { setMetric(m.id); setShowAll(false); }} className={`shrink-0 inline-flex items-center gap-2 h-11 px-4 rounded-full border text-[14px] font-medium transition-colors ${metric === m.id ? "bg-[#6B4C2A] text-white border-[#6B4C2A]" : "bg-white text-[#1A1410] border-black/20 hover:border-[#6B4C2A]"}`}>
            <m.icon size={15} /> {m.label}
          </button>
        ))}
      </div>

      {error && <p role="alert" className="mt-4 text-[13px] font-medium text-[#B42318]">Couldn't load the numbers ({error}). Press Refresh to try again.</p>}

      {loading && ranked.length === 0 ? (
        <p className="mt-6 inline-flex items-center gap-2 text-[14px]" style={{ color: MUTED }} role="status"><Spinner /> Loading...</p>
      ) : ranked.length === 0 ? (
        <div className="mt-4"><EmptyState title="Nothing yet" text={`No product has any ${metricInfo.short.toLowerCase()} in the last ${days} days. Numbers appear as visitors browse your site. Each visitor counts once per product per visit.`} /></div>
      ) : (
        <Panel className="mt-4 divide-y divide-black/10">
          <ol aria-label={metricInfo.label}>
            {shown.map(({ p, c }, i) => (
              <li key={p.id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4" data-pop-row>
                <span className="w-6 text-[14px] font-semibold tabular-nums text-center" style={{ color: MUTED }}>{i + 1}</span>
                <img src={p.url} alt="" className="w-14 h-14 rounded-xl object-cover bg-[#EFEBE3] shrink-0" loading="lazy" />
                <div className="min-w-0 flex-1">
                  <p className="text-[15px] font-medium leading-snug truncate">{p.product_name || "Untitled"}</p>
                  <p className="text-[12px] truncate" style={{ color: MUTED }}>{adminCategoryLabel(p.category)}</p>
                  <div className="mt-1.5 h-2 rounded-full bg-[#EFEBE3] overflow-hidden" aria-hidden><div className="h-full bg-[#C9973A] rounded-full" style={{ width: `${Math.max(4, (c[metric] / top) * 100)}%` }} /></div>
                  <p className="mt-1.5 flex flex-wrap gap-x-3 text-[12px] tabular-nums" style={{ color: MUTED }}>
                    {METRICS.map((m) => <span key={m.id} className={m.id === metric ? "font-semibold text-[#1A1410]" : ""}>{c[m.id]} {c[m.id] === 1 ? m.one : m.short.toLowerCase()}</span>)}
                  </p>
                </div>
                <span className="shrink-0 text-[22px] font-semibold tabular-nums" aria-label={`${c[metric]} ${metricInfo.short.toLowerCase()}`}>{c[metric]}</span>
              </li>
            ))}
          </ol>
        </Panel>
      )}

      {ranked.length > 10 && (
        <div className="mt-3"><GhostButton onClick={() => setShowAll((v) => !v)}>{showAll ? "Show the top 10" : `Show more (${Math.min(ranked.length, 50)})`}</GhostButton></div>
      )}
      <p className="mt-5 text-[12.5px] leading-relaxed" style={{ color: MUTED }}>
        Counted once per visitor per product per visit. A "view" is opening a product's details; a "share" is copying or sending its link; a "quote" is adding it to the quote list; an "enquiry" is pressing Enquire or WhatsApp on it, or sending a quote list that has it. Only the product and the action are saved, never anything personal. Visits from a browser where you have signed in to this admin are not counted.
      </p>
    </div>
  );
}
