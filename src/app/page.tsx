import { Navbar } from "@/components/marketing/Navbar";
import { Hero } from "@/components/marketing/Hero";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { Features } from "@/components/marketing/Features";
import { DashboardPreview } from "@/components/marketing/DashboardPreview";
import { SocialProof } from "@/components/marketing/SocialProof";
import { PricingPreview } from "@/components/marketing/PricingPreview";
import { FAQ } from "@/components/marketing/FAQ";
import { CTASection } from "@/components/marketing/CTASection";
import { Footer } from "@/components/marketing/Footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Features />
        <DashboardPreview />
        <SocialProof />
        <PricingPreview />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
