import { queryOptions, useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export type GalleryImage = {
  id: string;
  url: string;
  storage_path: string;
  alt_text: string;
  sort_order: number;
  created_at: string;
};

// Cached for 5 min: revisiting the page is instant, and a background refetch picks up admin changes.
export const galleryQuery = queryOptions({
  queryKey: ["site_images", "gallery"],
  staleTime: 5 * 60_000,
  queryFn: async () => {
    const { data, error } = await supabase
      .from("site_images")
      .select("*")
      .eq("section", "gallery")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data as GalleryImage[]) || [];
  },
});

export function useGalleryImages() {
  const q = useQuery(galleryQuery);
  return { images: q.data ?? [], loading: q.isPending, refetch: q.refetch };
}
