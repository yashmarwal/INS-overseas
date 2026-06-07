import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { IMAGE_SLOTS } from "@/data/imageSections";

// In-memory cache so each section is only fetched once per session
const imageCache: Record<string, string> = {};

export function useSiteImage(section: string): string {
  const slot = IMAGE_SLOTS.find((s) => s.section === section);
  const defaultUrl = slot?.defaultUrl ?? "";

  const [url, setUrl] = useState<string>(imageCache[section] ?? defaultUrl);

  useEffect(() => {
    // Already cached — use instantly, no network call
    if (imageCache[section]) {
      setUrl(imageCache[section]);
      return;
    }
    supabase
      .from("site_images")
      .select("url")
      .eq("section", section)
      .order("created_at", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) {
          imageCache[section] = data[0].url;
          setUrl(data[0].url);
        }
        // No row → keep defaultUrl already set in useState initialiser
      });
  }, [section]);

  return url;
}
