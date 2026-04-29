"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCampaign } from "@/hooks/useCampaigns";
import { useWeb3 } from "@/context/Web3Context";
import DonateForm from "@/components/DonateForm";
import WithdrawButton from "@/components/WithdrawButton";
import RefundButton from "@/components/RefundButton";
import { formatEth, shortAddress, timeLeft, formatDeadline, progressPercent } from "@/utils/format";
import { getCampaignCategory, getCampaignName, getCampaignDescription, getCreatorName } from "@/utils/campaignMeta";

export default function CampaignPage() {
  const { id } = useParams();
  const router = useRouter();
  const { account } = useWeb3();
  const { campaign, loading, error, refetch } = useCampaign(id);

  if (loading) return <PageSkeleton />;

  if (error || !campaign) {
    return (
      <main className="bg-white min-h-screen pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" />
              </svg>
            </div>
            <p className="text-red-600 font-medium mb-4">{error || "Campaign not found"}</p>
            <button onClick={() => router.push("/explore")} className="btn-secondary text-sm">
              Back to Explore
            </button>
          </div>
        </div>
      </main>
    );
  }

  const { creator, goal, totalRaised, deadline, withdrawn, image } = campaign;
  const now = BigInt(Math.floor(Date.now() / 1000));
  const ended = now >= BigInt(deadline);
  const success = ended && BigInt(totalRaised) >= BigInt(goal);
  const failed = ended && BigInt(totalRaised) < BigInt(goal);
  const pct = progressPercent(totalRaised, goal);
  const isCreator = account?.toLowerCase() === creator?.toLowerCase();
  const category = getCampaignCategory(campaign.id);
  const displayTitle = campaign.title || getCampaignName(campaign.id);
  const displayDesc = campaign.description || getCampaignDescription(campaign.id);
  const creatorName = getCreatorName(creator);

  return (
    <main className="bg-white min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <motion.button
          onClick={() => router.push("/explore")}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition-colors mb-6"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          All Campaigns
        </motion.button>

        {/* Banner */}
        <motion.div
          className={`relative aspect-[21/9] rounded-3xl overflow-hidden mb-8 ${
            image ? "bg-gray-100" : `bg-gradient-to-br ${category.color}`
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {image && (
            <img
              src={image}
              alt={displayTitle}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute top-5 left-5 flex items-center gap-2">
            <span className="badge bg-white/95 text-gray-900 backdrop-blur-sm">{category.name}</span>
            <StatusBadge success={success} failed={failed} withdrawn={withdrawn} />
          </div>
          <div className="absolute bottom-5 left-5 right-5">
            <p className="text-white/80 text-xs font-medium uppercase tracking-wider mb-2">
              Campaign #{campaign.id}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight drop-shadow-lg">
              {displayTitle}
            </h1>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            className="lg:col-span-2 flex flex-col gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-sm hover:border-emerald-200 transition-colors">
              <h2 className="text-lg font-bold text-gray-900 mb-3">About this campaign</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{displayDesc}</p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm hover:border-emerald-200 transition-colors">
              <p className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-3">Creator</p>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center text-white text-sm font-bold`}>
                  {creatorName.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {creatorName}
                    {isCreator && <span className="ml-2 text-emerald-600 text-xs">(you)</span>}
                  </p>
                  <p className="text-xs text-gray-500 font-mono">{shortAddress(creator, 8)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-sm hover:border-emerald-200 transition-colors">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{formatEth(totalRaised)} ETH</p>
                  <p className="text-sm text-gray-500 mt-1">raised of {formatEth(goal)} ETH goal</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-600">{pct.toFixed(1)}%</p>
                  <p className="text-xs text-gray-500">funded</p>
                </div>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    success
                      ? "bg-gradient-to-r from-emerald-500 to-green-400"
                      : failed
                      ? "bg-gradient-to-r from-red-500 to-rose-400"
                      : "bg-gradient-to-r from-emerald-500 to-teal-500"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(pct, 100)}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6">
                <StatBox label="Goal" value={`${formatEth(goal)} ETH`} />
                <StatBox label="Raised" value={`${formatEth(totalRaised)} ETH`} />
                <StatBox
                  label="Deadline"
                  value={formatDeadline(deadline)}
                  sub={timeLeft(deadline)}
                  highlight={!ended}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="flex flex-col gap-5 lg:sticky lg:top-24 lg:self-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {!ended && (
              <ActionCard title="Fund this Campaign" accent="emerald">
                <DonateForm campaignId={campaign.id} onFunded={refetch} />
              </ActionCard>
            )}

            {success && isCreator && !withdrawn && (
              <ActionCard title="Withdraw Funds" accent="emerald">
                <WithdrawButton campaign={campaign} onWithdrawn={refetch} />
              </ActionCard>
            )}

            {success && withdrawn && (
              <ActionCard title="Funds Withdrawn" accent="gray">
                <p className="text-sm text-gray-600">All funds have been successfully withdrawn by the creator.</p>
              </ActionCard>
            )}

            {failed && (
              <ActionCard title="Claim Refund" accent="red">
                <RefundButton campaign={campaign} onRefunded={refetch} />
              </ActionCard>
            )}

            {ended && !failed && !success && (
              <ActionCard title="Campaign Ended" accent="gray">
                <p className="text-sm text-gray-600">This campaign has ended.</p>
              </ActionCard>
            )}

            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-3">How it works</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">1.</span>
                  Connect your wallet and send ETH
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">2.</span>
                  If the goal is met, the creator withdraws
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">3.</span>
                  If it fails, you get a full refund
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

function ActionCard({ title, accent, children }) {
  const borderMap = {
    emerald: "border-emerald-200",
    red: "border-red-200",
    gray: "border-gray-200",
  };
  return (
    <div className={`bg-white border-2 rounded-2xl p-6 shadow-sm ${borderMap[accent] || borderMap.gray}`}>
      <h3 className="text-base font-bold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function StatBox({ label, value, sub, highlight }) {
  return (
    <div className="rounded-xl bg-gray-50 border-2 border-gray-200 px-4 py-3">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
      {sub && (
        <p className={`text-xs mt-0.5 ${highlight ? "text-emerald-600" : "text-gray-500"}`}>
          {sub}
        </p>
      )}
    </div>
  );
}

function StatusBadge({ success, failed, withdrawn }) {
  if (withdrawn) {
    return <span className="badge bg-gray-700/90 text-white backdrop-blur-sm">Withdrawn</span>;
  }
  if (success) {
    return <span className="badge bg-emerald-500/95 text-white backdrop-blur-sm">Goal Reached</span>;
  }
  if (failed) {
    return <span className="badge bg-red-500/95 text-white backdrop-blur-sm">Failed</span>;
  }
  return <span className="badge bg-emerald-500/95 text-white backdrop-blur-sm">Active</span>;
}

function PageSkeleton() {
  return (
    <main className="bg-white min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6 animate-pulse">
        <div className="h-4 w-28 bg-gray-100 rounded mb-6" />
        <div className="aspect-[21/9] bg-gray-100 rounded-3xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="h-32 bg-gray-100 rounded-2xl" />
            <div className="h-24 bg-gray-100 rounded-2xl" />
            <div className="h-48 bg-gray-100 rounded-2xl" />
          </div>
          <div className="h-64 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    </main>
  );
}
