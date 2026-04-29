"use client";

import { useState } from "react";
import CampaignList from "@/components/CampaignList";
import AnimatedSection from "@/components/ui/AnimatedSection";

export default function ExplorePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <main className="bg-white min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-12">
          <span className="badge badge-primary mb-4">Discover</span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore <span className="text-emerald-600">Campaigns</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Browse active campaigns, find innovative startups to back, and invest in the future of decentralized innovation.
          </p>
        </AnimatedSection>

        <CampaignList refreshKey={refreshKey} />
      </div>
    </main>
  );
}
