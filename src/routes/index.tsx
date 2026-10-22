import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import LazyMount from "@/components/shared/LazyMount";
import HeroSection from "@/components/home/HeroSection";
import TrustBar from "@/components/home/TrustBar";
import ProductCategories from "@/components/home/ProductCategories";
import HeritageStory from "@/components/home/HeritageStory";
import CraftProcess from "@/components/home/CraftProcess";
import ManufacturingTeaser from "@/components/home/ManufacturingTeaser";
import SustainabilitySection from "@/components/home/SustainabilitySection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import FeaturedCollection from "@/components/home/FeaturedCollection";
import WholesaleCta from "@/components/home/WholesaleCta";
import HomeFaq from "@/components/home/HomeFaq";
import InstagramFeed from "@/components/home/InstagramFeed";
import BlogPreview from "@/components/home/BlogPreview";
import ContactStrip from "@/components/home/ContactStrip";

// World map + d3 + its topology download are only needed once the section is about to be seen.
const GlobalReach = lazy(() => import("@/components/home/GlobalReach"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "INS Overseas — Handmade Leather Journals & Eco-Friendly Paper | Wholesale Jaipur" },
      { name: "description", content: "India's largest manufacturer of handmade leather journals, cotton rag paper, seed paper & artisan gift products. Wholesale export to 40+ countries from Sanganer, Jaipur since 1995." },
      { name: "keywords", content: "handmade leather journal wholesale India, cotton rag paper manufacturer Jaipur, leather journal exporter, handmade paper wholesale" },
      { property: "og:title", content: "INS Overseas — Handmade Leather Journals & Eco-Friendly Paper" },
      { property: "og:description", content: "Four-generation family craft from Sanganer, Jaipur. Wholesale leather journals, seed paper, gift boxes & artisan stationery exported to 40+ countries." },
      { property: "og:url", content: "https://ins-overseas.com/" },
    ],
    links: [
      { rel: "canonical", href: "https://ins-overseas.com/" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <ProductCategories />
      <div className="relative z-[2]"><HeritageStory /></div>{/* slides up over the last pinned collection card */}
      <CraftProcess />
      <SustainabilitySection />
      <FeaturedProducts />
      <FeaturedCollection />
      {/* placeholder heights measured from the real section at each breakpoint — keep in sync with GlobalReach */}
      <LazyMount className="relative z-[2] bg-ink min-h-[832px] sm:min-h-[888px] md:min-h-[945px] lg:min-h-[1064px] xl:min-h-[1254px] min-[1440px]:min-h-[1327px]">
        <Suspense fallback={null}><GlobalReach /></Suspense>
      </LazyMount>
      <WholesaleCta />
      <ManufacturingTeaser />
      <HomeFaq />
      <InstagramFeed />
      <BlogPreview />
      <ContactStrip />
    </>
  );
}
