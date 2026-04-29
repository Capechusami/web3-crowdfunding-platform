import Hero from "@/components/landing/Hero";
import Trustpilot from "@/components/landing/Trustpilot";
import Benefits from "@/components/landing/Benefits";
import FeaturedCampaigns from "@/components/landing/FeaturedCampaigns";
import Stats from "@/components/landing/Stats";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";
import CallToAction from "@/components/landing/CallToAction";

export default function Home() {
  return (
    <main className="bg-white">
      <Hero />
      <Trustpilot />
      <Benefits />
      <FeaturedCampaigns />
      <Stats />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
    </main>
  );
}
