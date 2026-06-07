export type Product = {
  id: string;
  name: string;
  category: "leather-journals" | "handmade-paper" | "stationery" | "leather-accessories";
  description: string;
  image: string;
};

export const products: Product[] = [
  { id: "p1", name: "Vintage Buffalo Leather Journal", category: "leather-journals", description: "A5 · wrap-around strap · 240 deckle pages", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=900&q=80" },
  { id: "p2", name: "Antique Goat Leather Diary", category: "leather-journals", description: "A6 · brass closure · custom embossing", image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80" },
  { id: "p3", name: "Refillable Leather Notebook", category: "leather-journals", description: "A5 · interchangeable inserts · hand-stitched spine", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=80" },
  { id: "p4", name: "Travel Journal with Pocket", category: "leather-journals", description: "Pocket sized · expandable gusset · brass corner", image: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?auto=format&fit=crop&w=900&q=80" },

  { id: "p5", name: "Handmade Deckle Edge Notebook", category: "handmade-paper", description: "Cotton rag · unlined · A5", image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=80" },
  { id: "p6", name: "Watercolour Sketch Pad", category: "handmade-paper", description: "300 gsm · cotton rag · cold-press", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80" },
  { id: "p7", name: "Loose Cotton Sheets (Pack 50)", category: "handmade-paper", description: "A4 · ivory · deckle-edge", image: "https://images.unsplash.com/photo-1517164850305-99a3e65bb47e?auto=format&fit=crop&w=900&q=80" },
  { id: "p8", name: "Botanical Inlay Paper Set", category: "handmade-paper", description: "Pressed petals · 20 sheets · gift-boxed", image: "https://images.unsplash.com/photo-1599492816851-9cc4f3f06f88?auto=format&fit=crop&w=900&q=80" },

  { id: "p9", name: "Set of 6 Luxury Greeting Cards", category: "stationery", description: "Cotton paper · hand-stamped · envelopes included", image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=900&q=80" },
  { id: "p10", name: "Paper Gift Bags Set (12pc)", category: "stationery", description: "Recycled cotton · ribbon handles · assorted", image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=900&q=80" },
  { id: "p11", name: "Wax-Sealed Envelope Collection", category: "stationery", description: "10 envelopes · gold seal · A6", image: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=900&q=80" },
  { id: "p12", name: "Hand-Stitched Gift Tags (Set 24)", category: "stationery", description: "Kraft cotton · jute string", image: "https://images.unsplash.com/photo-1606293459339-aa5d34a7b0e1?auto=format&fit=crop&w=900&q=80" },

  { id: "p13", name: "Leather Crossbody Bag", category: "leather-accessories", description: "Full-grain · brass buckles · adjustable strap", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80" },
  { id: "p14", name: "Corporate Leather Portfolio", category: "leather-accessories", description: "A4 · zipper close · debossed branding", image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=900&q=80" },
  { id: "p15", name: "Leather Card Holder", category: "leather-accessories", description: "Slim profile · 6 slots · hand-burnished edges", image: "https://images.unsplash.com/photo-1620578994920-1d488f9ccc7e?auto=format&fit=crop&w=900&q=80" },
  { id: "p16", name: "Buffalo Leather Tote", category: "leather-accessories", description: "Oversized · interior pocket · burnished handles", image: "https://images.unsplash.com/photo-1606522754091-a3bbf9ad4cb3?auto=format&fit=crop&w=900&q=80" },
];

export const categoryMeta: Record<Product["category"], { label: string; description: string; hero: string }> = {
  "leather-journals": {
    label: "Leather Journals",
    description: "Hand-stitched full-grain buffalo and goat leather journals, bound around deckle-edge cotton paper.",
    hero: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2200&q=80",
  },
  "handmade-paper": {
    label: "Handmade Paper",
    description: "100% cotton rag paper, sun-dried in Sanganer. Tree-free, bleed-resistant, made for fountain pens and watercolour.",
    hero: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=2200&q=80",
  },
  "stationery": {
    label: "Artisan Stationery",
    description: "Greeting cards, envelopes, paper bags and gifting essentials — printed and stitched by hand in our Jaipur atelier.",
    hero: "https://images.unsplash.com/photo-1606293459339-aa5d34a7b0e1?auto=format&fit=crop&w=2200&q=80",
  },
  "leather-accessories": {
    label: "Leather Accessories",
    description: "Crossbody bags, portfolios, totes and corporate gifts in full-grain leather with hand-fitted brass hardware.",
    hero: "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=2200&q=80",
  },
};
