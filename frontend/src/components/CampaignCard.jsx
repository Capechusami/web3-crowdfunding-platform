"use client";

import Link from "next/link";
import { formatEth, shortAddress, timeLeft, progressPercent, formatDeadline } from "@/utils/format";
import { ethers } from "ethers";

export default function CampaignCard({ campaign }) {
  const { id, creator, goal, totalRaised, deadline, withdrawn } = campaign;

  const pct      = progressPercent(totalRaised, goal);
  const ended    = Date.now() / 1000 >= Number(deadline);
  const success  = ended && totalRaised >= goal;
  const failed   = ended && totalRaised < goal;

  return (
    <div className="flex flex-col rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Status bar */}
      <div
        className={`h-1 w-full ${
          success
            ? "bg-green-500"
            : failed
            ? "bg-red-400"
            : "bg-indigo-500"
        }`}
        style={{ width: `${pct}%`, minWidth: "4px" }}
      />

      <div className="flex flex-col gap-4 p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Campaign</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              #{id}
            </p>
          </div>
          <StatusBadge success={success} failed={failed} withdrawn={withdrawn} />
        </div>

        {/* Creator */}
        <div>
          <p className="text-xs text-gray-400 mb-0.5">Creator</p>
          <p className="font-mono text-xs text-gray-600 dark:text-gray-400">
            {shortAddress(creator, 6)}
          </p>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span className="font-medium text-gray-800 dark:text-gray-200">
              {formatEth(totalRaised)} ETH raised
            </span>
            <span>of {formatEth(goal)} ETH</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                success ? "bg-green-500" : failed ? "bg-red-400" : "bg-indigo-500"
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-right text-xs text-gray-400 mt-1">{pct.toFixed(1)}%</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          <StatBox label="Goal" value={`${formatEth(goal)} ETH`} />
          <StatBox
            label={ended ? "Total Raised" : "Raised So Far"}
            value={`${formatEth(totalRaised)} ETH`}
          />
          <StatBox
            label="Deadline"
            value={formatDeadline(deadline)}
            sub={timeLeft(deadline)}
            highlight={!ended}
          />
          <StatBox
            label="Status"
            value={
              withdrawn
                ? "Withdrawn"
                : success
                ? "Goal Reached"
                : failed
                ? "Failed"
                : "Active"
            }
          />
        </div>

        {/* View link */}
        <Link
          href={`/campaign/${id}`}
          className="mt-1 rounded-lg border border-indigo-200 dark:border-indigo-800 px-4 py-2 text-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
        >
          View Campaign →
        </Link>
      </div>
    </div>
  );
}

function StatBox({ label, value, sub, highlight }) {
  return (
    <div className="rounded-lg bg-gray-50 dark:bg-gray-800 px-3 py-2">
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">
        {value}
      </p>
      {sub && (
        <p className={`text-xs mt-0.5 ${highlight ? "text-indigo-500" : "text-gray-400"}`}>
          {sub}
        </p>
      )}
    </div>
  );
}

function StatusBadge({ success, failed, withdrawn }) {
  if (withdrawn) {
    return (
      <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-1 text-xs font-medium text-gray-500">
        Withdrawn
      </span>
    );
  }
  if (success) {
    return (
      <span className="rounded-full bg-green-100 dark:bg-green-900/30 px-2.5 py-1 text-xs font-medium text-green-700 dark:text-green-400">
        Success
      </span>
    );
  }
  if (failed) {
    return (
      <span className="rounded-full bg-red-100 dark:bg-red-900/30 px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400">
        Failed
      </span>
    );
  }
  return (
    <span className="rounded-full bg-indigo-100 dark:bg-indigo-900/30 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:text-indigo-400">
      Active
    </span>
  );
}
