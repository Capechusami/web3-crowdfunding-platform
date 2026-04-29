"use client";

import { useCampaigns } from "@/hooks/useCampaigns";
import CampaignCard from "./CampaignCard";
import { StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";

export default function CampaignList({ refreshKey, limit, showHeader = true }) {
  const { campaigns, loading, error, refetch } = useCampaigns(refreshKey);
  const displayed = limit ? campaigns.slice(0, limit) : campaigns;

  if (loading) {
    return (
      <section>
        {showHeader && <ListHeader count={0} onRefresh={refetch} />}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(limit || 3)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section>
        {showHeader && <ListHeader count={0} onRefresh={refetch} />}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
          <p className="text-red-600 mb-3">{error}</p>
          <button onClick={refetch} className="btn-secondary text-sm px-4 py-2">
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section>
      {showHeader && <ListHeader count={campaigns.length} onRefresh={refetch} />}

      {displayed.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-2xl p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5"><path d="M12 5v14M5 12h14" /></svg>
          </div>
          <p className="text-gray-900 font-semibold mb-1">No campaigns yet</p>
          <p className="text-sm text-gray-500">Be the first to create one and start raising capital.</p>
        </div>
      ) : (
        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.08}>
          {displayed.map((c) => (
            <StaggerItem key={c.id}>
              <CampaignCard campaign={c} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </section>
  );
}

function ListHeader({ count, onRefresh }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">All Campaigns</h2>
        <p className="text-sm text-gray-500 mt-1">{count} campaign{count !== 1 ? "s" : ""} on-chain</p>
      </div>
      <button
        onClick={onRefresh}
        className="flex items-center gap-2 rounded-xl bg-gray-50 border border-gray-200 px-4 py-2.5 text-xs font-medium text-gray-600 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 transition-all"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 4v6h-6M1 20v-6h6" />
          <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
        </svg>
        Refresh
      </button>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden animate-pulse shadow-sm">
      <div className="aspect-[4/3] bg-gray-100" />
      <div className="p-5">
        <div className="h-5 w-3/4 bg-gray-100 rounded mb-3" />
        <div className="h-3 w-full bg-gray-50 rounded mb-1" />
        <div className="h-3 w-2/3 bg-gray-50 rounded mb-5" />
        <div className="h-2 w-full bg-gray-100 rounded-full mb-4" />
        <div className="flex justify-between pt-4 border-t border-gray-100">
          <div className="h-3 w-20 bg-gray-100 rounded" />
          <div className="h-8 w-20 bg-gray-100 rounded-full" />
        </div>
      </div>
    </div>
  );
}
