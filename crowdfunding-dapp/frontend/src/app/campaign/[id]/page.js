"use client";

import { useParams, useRouter } from "next/navigation";
import { useCampaign } from "@/hooks/useCampaigns";
import { useWeb3 } from "@/context/Web3Context";
import DonateForm from "@/components/DonateForm";
import WithdrawButton from "@/components/WithdrawButton";
import RefundButton from "@/components/RefundButton";
import {
  formatEth,
  shortAddress,
  timeLeft,
  formatDeadline,
  progressPercent,
} from "@/utils/format";

export default function CampaignPage() {
  const { id }   = useParams();
  const router   = useRouter();
  const { account } = useWeb3();
  const { campaign, loading, error, refetch } = useCampaign(id);

  if (loading) return <PageSkeleton />;

  if (error || !campaign) {
    return (
      <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-6 py-8 text-center">
        <p className="text-red-600 dark:text-red-400 font-medium mb-2">
          {error || "Campaign not found"}
        </p>
        <button
          onClick={() => router.push("/")}
          className="text-sm text-indigo-600 underline"
        >
          Back to home
        </button>
      </div>
    );
  }

  const { creator, goal, totalRaised, deadline, withdrawn } = campaign;

  const now        = BigInt(Math.floor(Date.now() / 1000));
  const ended      = now >= BigInt(deadline);
  const success    = ended && BigInt(totalRaised) >= BigInt(goal);
  const failed     = ended && BigInt(totalRaised) < BigInt(goal);
  const pct        = progressPercent(totalRaised, goal);
  const isCreator  = account?.toLowerCase() === creator?.toLowerCase();

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      {/* Back */}
      <button
        onClick={() => router.push("/")}
        className="self-start text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 transition-colors"
      >
        ← All Campaigns
      </button>

      {/* Header card */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
        <div className={`h-2 w-full ${success ? "bg-green-500" : failed ? "bg-red-400" : "bg-indigo-500"}`}>
          <div
            className={`h-full ${success ? "bg-green-500" : failed ? "bg-red-400" : "bg-indigo-500"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="p-6 flex flex-col gap-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide">Campaign</p>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-0.5">
                #{campaign.id}
              </h1>
            </div>
            <StatusBadge success={success} failed={failed} withdrawn={withdrawn} />
          </div>

          {/* Creator */}
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Created by</span>
            <span className="font-mono text-gray-800 dark:text-gray-200">
              {shortAddress(creator, 8)}{isCreator && " (you)"}
            </span>
          </div>

          {/* Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-semibold text-gray-900 dark:text-white">
                {formatEth(totalRaised)} ETH raised
              </span>
              <span className="text-gray-500">of {formatEth(goal)} ETH goal</span>
            </div>
            <div className="h-3 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  success ? "bg-green-500" : failed ? "bg-red-400" : "bg-indigo-500"
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-right text-xs text-gray-400 mt-1">{pct.toFixed(1)}%</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <StatBox label="Goal"        value={`${formatEth(goal)} ETH`} />
            <StatBox label="Raised"      value={`${formatEth(totalRaised)} ETH`} />
            <StatBox
              label="Deadline"
              value={formatDeadline(deadline)}
              sub={timeLeft(deadline)}
              highlight={!ended}
            />
          </div>
        </div>
      </div>

      {/* Action panels */}
      {!ended && (
        <Section title="Fund this Campaign">
          <DonateForm campaignId={campaign.id} onFunded={refetch} />
        </Section>
      )}

      {success && !withdrawn && isCreator && (
        <Section title="Withdraw Funds" accent="green">
          <WithdrawButton campaign={campaign} onWithdrawn={refetch} />
        </Section>
      )}

      {success && withdrawn && (
        <Section title="Withdraw Funds" accent="gray">
          <WithdrawButton campaign={campaign} onWithdrawn={refetch} />
        </Section>
      )}

      {failed && (
        <Section title="Claim Refund" accent="red">
          <RefundButton campaign={campaign} onRefunded={refetch} />
        </Section>
      )}
    </div>
  );
}

function Section({ title, children, accent = "indigo" }) {
  const colors = {
    indigo: "text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900",
    green:  "text-green-700 dark:text-green-400 border-green-100 dark:border-green-900",
    red:    "text-red-700 dark:text-red-400 border-red-100 dark:border-red-900",
    gray:   "text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-800",
  };
  return (
    <div className={`rounded-xl border bg-white dark:bg-gray-900 p-6 shadow-sm ${colors[accent]}`}>
      <h2 className={`text-base font-semibold mb-4 ${colors[accent].split(" ")[0]} ${colors[accent].split(" ")[1]}`}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function StatBox({ label, value, sub, highlight }) {
  return (
    <div className="rounded-lg bg-gray-50 dark:bg-gray-800 px-3 py-2">
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-gray-900 dark:text-white">{value}</p>
      {sub && (
        <p className={`text-xs mt-0.5 ${highlight ? "text-indigo-500" : "text-gray-400"}`}>
          {sub}
        </p>
      )}
    </div>
  );
}

function StatusBadge({ success, failed, withdrawn }) {
  if (withdrawn)
    return <Badge color="gray" label="Withdrawn" />;
  if (success)
    return <Badge color="green" label="Goal Reached" />;
  if (failed)
    return <Badge color="red" label="Failed" />;
  return <Badge color="indigo" label="Active" />;
}

function Badge({ color, label }) {
  const map = {
    gray:   "bg-gray-100 dark:bg-gray-800 text-gray-500",
    green:  "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    red:    "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    indigo: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${map[color]}`}>
      {label}
    </span>
  );
}

function PageSkeleton() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto animate-pulse">
      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 flex flex-col gap-4">
        <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 w-full bg-gray-100 dark:bg-gray-800 rounded" />
        <div className="h-3 w-3/4 bg-gray-100 dark:bg-gray-800 rounded" />
        <div className="grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-100 dark:bg-gray-800 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
