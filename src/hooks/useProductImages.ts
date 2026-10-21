import { queryOptions, useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export type ProductImage = {
  id: string;
  url: string;
  storage_path: string;
  alt_text: string;
  product_name: string;
  category: string;
  sort_order: number;
  created_at: string;
};

export const PRODUCT_CATEGORIES = [
  { id: "leather-journals",        label: "Leather Journals",        icon: "📓" },
  { id: "leather-bags",            label: "Leather Bags",            icon: "👜" },
  { id: "handmade-paper-gift-box", label: "Handmade Paper Gift Box", icon: "🎁" },
  { id: "handmade-paper-gift-bag", label: "Handmade Paper Gift Bag", icon: "🛍️" },
  { id: "handmade-seed-paper",     label: "Handmade Seed Paper",     icon: "🌱" },
  { id: "handmade-deckle-edge-paper", label: "Handmade Deckle Edge Paper", icon: "📜" },
  { id: "handblock-print-fabric",     label: "Handblock Print Fabric",     icon: "🎨" },
] as const;

export type ProductCategory = typeof PRODUCT_CATEGORIES[number]["id"];

// Cached for 5 min: revisiting the page is instant, and a background refetch picks up admin changes.
export const productsQuery = (category?: string) =>
  queryOptions({
    queryKey: ["site_images", "product", category ?? "all"],
    staleTime: 5 * 60_000,
    queryFn: async () => {
      let query = supabase
        .from("site_images")
        .select("*")
        .eq("section", "product")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (category && category !== "all") {
        query = query.eq("category", category);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data as ProductImage[]) || [];
    },
  });

export function useProductImages(category?: string) {
  const q = useQuery(productsQuery(category));
  return { images: q.data ?? [], loading: q.isPending, refetch: q.refetch };
}
