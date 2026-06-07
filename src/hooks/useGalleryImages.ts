import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type GalleryImage = {
  id: string;
  url: string;
  storage_path: string;
  alt_text: string;
  sort_order: number;
  created_at: string;
};

export function useGalleryImages() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchImages = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("site_images")
      .select("*")
      .eq("section", "gallery")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    setImages((data as GalleryImage[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchImages(); }, []);

  return { images, loading, refetch: fetchImages };
}
