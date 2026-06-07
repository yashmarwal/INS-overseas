import { createFileRoute } from "@tanstack/react-router";
import HeroSection from "@/components/home/HeroSection";
import TrustBar from "@/components/home/TrustBar";
import ProductCategories from "@/components/home/ProductCategories";
import HeritageStory from "@/components/home/HeritageStory";
import CraftProcess from "@/components/home/CraftProcess";
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
      { title: "INS Overseas — Handmade Leather Journals & Artisan Stationery | Wholesale from Jaipur" },
      { name: "description", content: "Premium handmade leather journals, cotton rag paper & artisan stationery manufactured in Jaipur, India since 1995. Wholesale export to 40+ countries. Request our catalogue." },
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
      <HomeFaq />
      <InstagramFeed />
      <BlogPreview />
      <ContactStrip />
    </>
  );
}
