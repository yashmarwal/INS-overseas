import { useEffect, useState } from "react";
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

export function useProductImages(category?: string) {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchImages = async () => {
    setLoading(true);
    let query = supabase
      .from("site_images")
      .select("*")
      .eq("section", "product")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    const { data } = await query;
    setImages((data as ProductImage[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchImages(); }, [category]);

  return { images, loading, refetch: fetchImages };
}
