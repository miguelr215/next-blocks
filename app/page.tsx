import CategorySection from "@/components/categorySection";
import Hero from "@/components/hero";
import HowToPlaySection from "@/components/how-to-play";
import HowToWinSection from "@/components/how-to-win";
import HPBannerCTA from "@/components/hp-banner-cta";

export default function Home() {
  return (
    <div className="">
      <Hero />
      <CategorySection />
      <HowToPlaySection />
      <HowToWinSection />
      <HPBannerCTA />
    </div>
  );
}
