"use client";

import { useState } from "react";
import { useWeb3 } from "@/context/Web3Context";
import { useContract } from "@/hooks/useContract";
import { parseEth } from "@/utils/format";

const DURATION_PRESETS = [
  { label: "1 day",   value: 86400 },
  { label: "3 days",  value: 259200 },
  { label: "7 days",  value: 604800 },
  { label: "30 days", value: 2592000 },
];

export default function CreateCampaign({ onCreated }) {
  const { isConnected, isCorrectNetwork, connect } = useWeb3();
  const contract = useContract();

  const [goal, setGoal]         = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [txHash, setTxHash]     = useState(null);
  const [campaignId, setCampaignId] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setTxHash(null);

    if (!isConnected || !isCorrectNetwork) {
      await connect();
      return;
    }
    if (!contract) {
      setError("Contract not loaded. Check your network and ABI.");
      return;
    }

    const goalNum = parseFloat(goal);
    const durNum  = parseInt(duration, 10);

    if (!goalNum || goalNum <= 0) {
      setError("Goal must be greater than 0 ETH.");
      return;
    }
    if (!durNum || durNum <= 0) {
      setError("Duration must be greater than 0 seconds.");
      return;
    }

    try {
      setLoading(true);

      const goalWei = parseEth(goal);
      const tx = await contract.createCampaign(goalWei, durNum);
      setTxHash(tx.hash);

      const receipt = await tx.wait();

      const iface = contract.interface;
      let id = null;
      for (const log of receipt.logs) {
        try {
          const parsed = iface.parseLog(log);
          if (parsed?.name === "CampaignCreated") {
            id = Number(parsed.args.campaignId);
            break;
          }
        } catch {}
      }

      setCampaignId(id);
      setGoal("");
      setDuration("");
      if (onCreated) onCreated(id);
    } catch (e) {
      setError(
        e?.reason || e?.shortMessage || e?.message || "Transaction failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">
        Create Campaign
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Goal */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Funding Goal (ETH)
          </label>
          <input
            type="number"
            min="0"
            step="any"
            placeholder="e.g. 1.5"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            disabled={loading}
            required
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          />
        </div>

        {/* Duration */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Duration (seconds)
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {DURATION_PRESETS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setDuration(String(p.value))}
                disabled={loading}
                className={`rounded-md px-3 py-1 text-xs font-medium border transition-colors disabled:opacity-50 ${
                  duration === String(p.value)
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-indigo-400"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <input
            type="number"
            min="1"
            step="1"
            placeholder="or enter custom seconds"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            disabled={loading}
            required
            className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Success */}
        {txHash && campaignId !== null && (
          <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3 text-sm text-green-700 dark:text-green-400 flex flex-col gap-1">
            <span className="font-medium">Campaign #{campaignId} created!</span>
            <span className="font-mono text-xs break-all text-green-600 dark:text-green-500">
              Tx: {txHash}
            </span>
          </div>
        )}

        {/* Pending tx (waiting for confirmation) */}
        {txHash && campaignId === null && loading && (
          <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 px-4 py-3 text-sm text-yellow-700 dark:text-yellow-400 font-mono break-all">
            Confirming… {txHash}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Spinner />
              {txHash ? "Confirming…" : "Waiting for wallet…"}
            </>
          ) : !isConnected ? (
            "Connect Wallet to Create"
          ) : (
            "Create Campaign"
          )}
        </button>
      </form>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 text-white"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor" strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
      />
    </svg>
  );
}
