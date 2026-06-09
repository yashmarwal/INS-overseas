import { createFileRoute } from "@tanstack/react-router";
import HeroSection from "@/components/home/HeroSection";
import TrustBar from "@/components/home/TrustBar";
import ProductCategories from "@/components/home/ProductCategories";
import HeritageStory from "@/components/home/HeritageStory";
import CraftProcess from "@/components/home/CraftProcess";
import ManufacturingTeaser from "@/components/home/ManufacturingTeaser";
import SustainabilitySection from "@/components/home/SustainabilitySection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import GlobalReach from "@/components/home/GlobalReach";
import Testimonials from "@/components/home/Testimonials";
import WholesaleCta from "@/components/home/WholesaleCta";
import HomeFaq from "@/components/home/HomeFaq";
import InstagramFeed from "@/components/home/InstagramFeed";
import BlogPreview from "@/components/home/BlogPreview";
import ContactStrip from "@/components/home/ContactStrip";

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
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <HeroSection />
      <TrustBar />
      <ProductCategories />
      <HeritageStory />
      <CraftProcess />
      <SustainabilitySection />
      <FeaturedProducts />
      <GlobalReach />
      <Testimonials />
      <WholesaleCta />
      <ManufacturingTeaser />
      <HomeFaq />
      <InstagramFeed />
      <BlogPreview />
      <ContactStrip />
    </>
  );
}
