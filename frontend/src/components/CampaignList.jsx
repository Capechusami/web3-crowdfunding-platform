"use client";

import { useCampaigns } from "@/hooks/useCampaigns";
import CampaignCard from "./CampaignCard";

export default function CampaignList({ refreshKey }) {
  const { campaigns, loading, error, refetch } = useCampaigns(refreshKey);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <SectionHeader count={null} onRefresh={refetch} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <SectionHeader count={0} onRefresh={refetch} />
        <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-6 py-5 text-sm text-red-600 dark:text-red-400">
          <p className="font-medium mb-1">Failed to load campaigns</p>
          <p className="text-xs break-all">{error}</p>
          <button
            onClick={refetch}
            className="mt-3 text-xs font-medium text-red-600 dark:text-red-400 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <SectionHeader count={0} onRefresh={refetch} />
        <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 px-6 py-12 text-center">
          <p className="text-gray-400 text-sm">No campaigns yet.</p>
          <p className="text-gray-400 text-xs mt-1">
            Create the first one using the form above.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader count={campaigns.length} onRefresh={refetch} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {campaigns.map((c) => (
          <CampaignCard key={c.id} campaign={c} />
        ))}
      </div>
    </div>
  );
}

function SectionHeader({ count, onRefresh }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        All Campaigns{" "}
        {count !== null && (
          <span className="text-sm font-normal text-gray-400">({count})</span>
        )}
      </h2>
      <button
        onClick={onRefresh}
        className="flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <RefreshIcon />
        Refresh
      </button>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 animate-pulse">
      <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
      <div className="h-2 w-32 bg-gray-100 dark:bg-gray-800 rounded mb-2" />
      <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded mb-1" />
      <div className="h-2 w-3/4 bg-gray-100 dark:bg-gray-800 rounded mb-4" />
      <div className="grid grid-cols-2 gap-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-lg" />
        ))}
      </div>
    </div>
  );
}

function RefreshIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
    </svg>
  );
}
