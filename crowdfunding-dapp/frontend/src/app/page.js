"use client";

import { useState } from "react";
import CreateCampaign from "@/components/CreateCampaign";
import DonateForm from "@/components/DonateForm";
import CampaignList from "@/components/CampaignList";

export default function Home() {
  const [lastCreated, setLastCreated] = useState(null);
  const [refreshKey, setRefreshKey]   = useState(0);

  function handleCreated(id) {
    setLastCreated(id);
    setRefreshKey((k) => k + 1);
  }

  function handleFunded() {
    setRefreshKey((k) => k + 1);
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-8 py-12 text-center shadow-sm">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          Decentralized Crowdfunding
        </h1>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
          Create campaigns, fund projects, and claim or refund — all on-chain.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <CreateCampaign onCreated={handleCreated} />
        <DonateForm campaignId={lastCreated ?? undefined} onFunded={handleFunded} />
      </div>

      <CampaignList refreshKey={refreshKey} />
    </div>
  );
}
