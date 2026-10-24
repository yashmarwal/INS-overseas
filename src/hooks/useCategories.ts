import { useEffect } from "react";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { PRODUCT_CATEGORIES } from "@/hooks/useProductImages";
import { getCustomCategories, setCustomCategories, useCustomCategories, type CustomCategory } from "@/data/catalogue";

// Custom product categories. The admin adds them; each one is a single row in the existing site_images table
// (section "product_category"), so nothing new has to be set up in the database:
//   category     = the id (a URL-safe version of the name)
//   product_name = the name shown on the site
//   alt_text     = {"moq": 300, "icon": "🪵"}
export const CATEGORY_SECTION = "product_category";
export const DEFAULT_ICON = "🏷️";

const parseMeta = (alt: unknown): { moq: number; icon: string } => {
  try {
    const m = JSON.parse(String(alt ?? ""));
    const moq = Math.round(Number(m.moq));
    return { moq: Number.isFinite(moq) && moq >= 1 ? moq : 200, icon: typeof m.icon === "string" && m.icon.trim() ? m.icon.trim() : DEFAULT_ICON };
  } catch { return { moq: 200, icon: DEFAULT_ICON }; }
};

export const categoriesQuery = () =>
  queryOptions({
    queryKey: ["site_images", CATEGORY_SECTION],
    staleTime: 5 * 60_000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_images")
        .select("id,category,product_name,alt_text,sort_order,created_at")
        .eq("section", CATEGORY_SECTION)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      const list: CustomCategory[] = (data ?? [])
        .filter((r: { category?: string; product_name?: string }) => r.category && r.product_name)
        .map((r: { id: string; category: string; product_name: string; alt_text: string }) => ({ id: r.category, rowId: r.id, label: r.product_name, ...parseMeta(r.alt_text) }));
      setCustomCategories(list); // ready for every label lookup before anything re-renders
      return list;
    },
  });

export type CategoryOption = { id: string; label: string; icon: string; custom: boolean; rowId?: string; moq?: number };

/** Built-in categories first, then the admin's own. Components using this re-render when categories load or change. */
export function useCategories() {
  const q = useQuery(categoriesQuery());
  const custom = useCustomCategories();
  useEffect(() => { if (q.data) setCustomCategories(q.data); }, [q.data]);
  const all: CategoryOption[] = [
    ...PRODUCT_CATEGORIES.map((c) => ({ id: c.id as string, label: c.label as string, icon: c.icon as string, custom: false })),
    ...custom.map((c) => ({ id: c.id, label: c.label, icon: c.icon, custom: true, rowId: c.rowId, moq: c.moq })),
  ];
  return { all, custom, loading: q.isPending, refetch: q.refetch };
}

/** The full name of a category as the admin sees it (e.g. "Handmade Seed Paper"), built-in or custom. */
export const adminCategoryLabel = (id: string) =>
  PRODUCT_CATEGORIES.find((c) => c.id === id)?.label ?? getCustomCategories().find((c) => c.id === id)?.label ?? id;
