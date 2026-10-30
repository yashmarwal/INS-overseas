import { lazy, Suspense } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/seo";
import { seoPages } from "@/data/seoPages";
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
import OrderingSteps from "@/components/home/OrderingSteps";
import WholesaleCta from "@/components/home/WholesaleCta";
import HomeFaq from "@/components/home/HomeFaq";
import InstagramFeed from "@/components/home/InstagramFeed";
import BlogPreview from "@/components/home/BlogPreview";
import ContactStrip from "@/components/home/ContactStrip";

// World map + d3 + its topology download are only needed once the section is about to be seen.
const GlobalReach = lazy(() => import("@/components/home/GlobalReach"));

const P = seoPages["/"];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: P.title },
      { name: "description", content: P.description },
      { name: "keywords", content: "handmade leather journal wholesale India, cotton rag paper manufacturer Jaipur, leather journal exporter, handmade paper wholesale" },
      { property: "og:title", content: P.ogTitle ?? P.title },
      { property: "og:description", content: P.description },
      { property: "og:url", content: `${SITE_URL}/` },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/` },
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
      <LazyMount className="relative z-[2] bg-ink min-h-[calc(804px_+_45.4vw)] sm:min-h-[calc(644px_+_59vw)] md:min-h-[calc(631px_+_60.8vw)] lg:min-h-[calc(616px_+_60.8vw)] xl:min-h-[calc(857px_+_42vw)] min-[1440px]:min-h-[1462px]">
        <Suspense fallback={null}><GlobalReach /></Suspense>
      </LazyMount>
      <OrderingSteps />
      <WholesaleCta />
      <ManufacturingTeaser />
      <HomeFaq />
      <InstagramFeed />
      <BlogPreview />
      <ContactStrip />
    </>
  );
}
