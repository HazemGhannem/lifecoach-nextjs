import HeroSection from "@/components/home/hero-section";
import AboutSection from "@/components/home/about-section";
import PricingSection from "@/components/home/pricing-section";

export default function HomePage() {
  return (
    <div className="pt-16">
      <HeroSection />
      <AboutSection />
      <PricingSection />
    </div>
  );
}
