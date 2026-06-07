export type ImageSlot = {
  section: string;
  label: string;
  description: string;
  location: string;
  tip: string;
  pageUrl: string;
  defaultUrl: string;
  aspectRatio: string;
};

export const IMAGE_SLOTS: ImageSlot[] = [
  // Hero
  {
    section: "hero_main",
    label: "Homepage Hero",
    description: "Main full-screen background image on homepage",
    location: "Homepage → Full screen background",
    tip: "Landscape photo. Min 2000px wide. Dark or moody works best.",
    pageUrl: "/",
    defaultUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2400&q=80",
    aspectRatio: "16/7",
  },
  // Product Categories
  {
    section: "category_leather_journals",
    label: "Leather Journals — Category Image",
    description: "Background image for the Leather Journals category card",
    location: "Homepage → Leather Journals card",
    tip: "Square or portrait photo of leather journals.",
    pageUrl: "/",
    defaultUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1400&q=80",
    aspectRatio: "5/4",
  },
  {
    section: "category_handmade_paper",
    label: "Handmade Paper — Category Image",
    description: "Background image for the Handmade Paper category card",
    location: "Homepage → Handmade Paper card",
    tip: "Square or portrait photo of handmade paper / notebooks.",
    pageUrl: "/",
    defaultUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=80",
    aspectRatio: "5/4",
  },
  {
    section: "category_stationery",
    label: "Artisan Stationery — Category Image",
    description: "Background image for the Stationery category card",
    location: "Homepage → Stationery card",
    tip: "Square or portrait photo of cards, envelopes, gift bags.",
    pageUrl: "/",
    defaultUrl: "https://images.unsplash.com/photo-1606293459339-aa5d34a7b0e1?auto=format&fit=crop&w=1400&q=80",
    aspectRatio: "5/4",
  },
  {
    section: "category_leather_accessories",
    label: "Leather Accessories — Category Image",
    description: "Background image for the Leather Accessories category card",
    location: "Homepage → Leather Accessories card",
    tip: "Square or portrait photo of leather bags or accessories.",
    pageUrl: "/",
    defaultUrl: "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=1400&q=80",
    aspectRatio: "5/4",
  },
  // Heritage Story
  {
    section: "heritage_artisan",
    label: "Heritage Story — Artisan Photo",
    description: "Large image of artisan at work in the Our Story section",
    location: "Homepage → Our Story section (large photo)",
    tip: "Photo of artisan at work. Portrait orientation preferred.",
    pageUrl: "/",
    defaultUrl: "https://images.unsplash.com/photo-1597149959983-9ac80c4a9e64?auto=format&fit=crop&w=1200&q=80",
    aspectRatio: "4/3",
  },
  {
    section: "heritage_paper",
    label: "Heritage Story — Paper Close-up",
    description: "Small overlapping image of deckle edge paper in the Our Story section",
    location: "Homepage → Our Story section (small photo)",
    tip: "Close-up of paper texture or deckle edge.",
    pageUrl: "/",
    defaultUrl: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=900&q=80",
    aspectRatio: "4/3",
  },
  // Wholesale CTA
  {
    section: "wholesale_bg",
    label: "Wholesale CTA — Background",
    description: "Full-bleed background image for the Wholesale section",
    location: "Homepage → Wholesale section background",
    tip: "Landscape photo. Dark tones preferred — text overlays this.",
    pageUrl: "/",
    defaultUrl: "https://images.unsplash.com/photo-1559563458-527698bf5295?auto=format&fit=crop&w=2200&q=80",
    aspectRatio: "16/7",
  },
];
