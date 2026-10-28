import { useEffect } from "react";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { DETAIL_LIMITS, setProductDetails, useProductDetailsStore, type ProductDetails, type ProductPhoto } from "@/data/productDetails";

// Per-product details. One small row per product that has any, in the existing site_images table (nothing new to set up):
//   section = "product_details", storage_path = the product's id,
//   alt_text = {"code":"LJ-014","size":"A5","material":"Buffalo leather","colours":"Brown, black","custom":"Logo embossing","photos":[{"url":"…","path":"…"}]}
export const DETAILS_SECTION = "product_details";

const clean = (v: unknown, max: number) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, max);

export const parseDetails = (alt: unknown): Omit<ProductDetails, "rowId"> => {
  try {
    const m = JSON.parse(String(alt ?? ""));
    const photos: ProductPhoto[] = (Array.isArray(m.photos) ? m.photos : [])
      .filter((p: unknown): p is ProductPhoto => !!p && typeof (p as ProductPhoto).url === "string" && /^https?:\/\//.test((p as ProductPhoto).url))
      .map((p: ProductPhoto) => ({ url: p.url, path: String(p.path ?? "") }))
      .slice(0, DETAIL_LIMITS.photos);
    return {
      code: clean(m.code, DETAIL_LIMITS.code) || undefined,
      size: clean(m.size, DETAIL_LIMITS.size) || undefined,
      material: clean(m.material, DETAIL_LIMITS.material) || undefined,
      colours: clean(m.colours, DETAIL_LIMITS.colours) || undefined,
      custom: clean(m.custom, DETAIL_LIMITS.custom) || undefined,
      photos,
    };
  } catch { return { photos: [] }; }
};

/** What gets written to the row (empty things left out). */
export const serializeDetails = (d: Omit<ProductDetails, "rowId">) =>
  JSON.stringify({
    ...(d.code ? { code: clean(d.code, DETAIL_LIMITS.code) } : {}),
    ...(d.size ? { size: clean(d.size, DETAIL_LIMITS.size) } : {}),
    ...(d.material ? { material: clean(d.material, DETAIL_LIMITS.material) } : {}),
    ...(d.colours ? { colours: clean(d.colours, DETAIL_LIMITS.colours) } : {}),
    ...(d.custom ? { custom: clean(d.custom, DETAIL_LIMITS.custom) } : {}),
    ...(d.photos.length ? { photos: d.photos.slice(0, DETAIL_LIMITS.photos) } : {}),
  });

export const hasAnyDetail = (d: Omit<ProductDetails, "rowId">) => !!(d.code || d.size || d.material || d.colours || d.custom || d.photos.length);

export const productDetailsQuery = () =>
  queryOptions({
    queryKey: ["site_images", DETAILS_SECTION],
    staleTime: 5 * 60_000,
    queryFn: async () => {
      const { data, error } = await supabase.from("site_images").select("id,storage_path,alt_text").eq("section", DETAILS_SECTION);
      if (error) throw error;
      const map = new Map<string, ProductDetails>();
      for (const r of (data ?? []) as { id: string; storage_path: string; alt_text: string }[]) {
        const d = parseDetails(r.alt_text);
        if (r.storage_path && hasAnyDetail(d)) map.set(r.storage_path, { rowId: r.id, ...d });
      }
      setProductDetails(map); // ready for every lookup before anything re-renders
      return map;
    },
  });

/** Re-renders when the details load or change. Use it in any component that shows a code, size, material or extra photos. */
export function useProductDetails() {
  const q = useQuery(productDetailsQuery());
  const details = useProductDetailsStore();
  useEffect(() => { if (q.data) setProductDetails(q.data); }, [q.data]);
  return { details, loading: q.isPending, ready: q.isSuccess, refetch: q.refetch };
}
