import { useEffect } from "react";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { setProductTerms, useProductTermsStore, type ProductTerms } from "@/data/catalogue";

// Per-product minimum order and lead time. One small row per product that has its own terms, in the existing site_images table:
//   section = "product_terms", storage_path = the product's id, alt_text = {"moq": 500, "lead": 45} (either may be missing)
export const TERMS_SECTION = "product_terms";

const parse = (alt: unknown): { moq?: number; lead?: number } => {
  try {
    const m = JSON.parse(String(alt ?? ""));
    const moq = Math.round(Number(m.moq)), lead = Math.round(Number(m.lead));
    return { moq: Number.isFinite(moq) && moq >= 1 ? moq : undefined, lead: Number.isFinite(lead) && lead >= 1 ? lead : undefined };
  } catch { return {}; }
};

export const productTermsQuery = () =>
  queryOptions({
    queryKey: ["site_images", TERMS_SECTION],
    staleTime: 5 * 60_000,
    queryFn: async () => {
      const { data, error } = await supabase.from("site_images").select("id,storage_path,alt_text").eq("section", TERMS_SECTION);
      if (error) throw error;
      const map = new Map<string, ProductTerms>();
      for (const r of (data ?? []) as { id: string; storage_path: string; alt_text: string }[]) {
        const t = parse(r.alt_text);
        if (r.storage_path && (t.moq || t.lead)) map.set(r.storage_path, { rowId: r.id, ...t });
      }
      setProductTerms(map); // ready for every lookup before anything re-renders
      return map;
    },
  });

/** Re-renders when the terms load or change. Use it in any component that shows a minimum order or lead time. */
export function useProductTerms() {
  const q = useQuery(productTermsQuery());
  const terms = useProductTermsStore();
  useEffect(() => { if (q.data) setProductTerms(q.data); }, [q.data]);
  return { terms, loading: q.isPending, refetch: q.refetch };
}
