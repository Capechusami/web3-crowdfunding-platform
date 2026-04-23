"use client";

import { useState } from "react";
import { useWeb3 } from "@/context/Web3Context";
import { useContract } from "@/hooks/useContract";
import { parseEth, formatEth } from "@/utils/format";

export default function DonateForm({ campaignId: propId, onFunded }) {
  const { isConnected, isCorrectNetwork, connect } = useWeb3();
  const contract = useContract();

  const [campaignId, setCampaignId] = useState(
    propId !== undefined ? String(propId) : ""
  );
  const [amount, setAmount]     = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [txHash, setTxHash]     = useState(null);
  const [success, setSuccess]   = useState(false);

  const isIdControlled = propId !== undefined;

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setTxHash(null);
    setSuccess(false);

    if (!isConnected || !isCorrectNetwork) {
      await connect();
      return;
    }
    if (!contract) {
      setError("Contract not loaded. Check your network and ABI.");
      return;
    }

    const id  = parseInt(campaignId, 10);
    const eth = parseFloat(amount);

    if (isNaN(id) || id < 0) {
      setError("Enter a valid campaign ID.");
      return;
    }
    if (!eth || eth <= 0) {
      setError("Amount must be greater than 0 ETH.");
      return;
    }

    try {
      setLoading(true);

      const value = parseEth(amount);
      const tx    = await contract.fund(id, { value });
      setTxHash(tx.hash);

      await tx.wait();

      setSuccess(true);
      setAmount("");
      if (onFunded) onFunded({ campaignId: id, amount: value });
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
        Fund a Campaign
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Campaign ID */}
        {!isIdControlled && (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Campaign ID
            </label>
            <input
              type="number"
              min="0"
              step="1"
              placeholder="e.g. 0"
              value={campaignId}
              onChange={(e) => setCampaignId(e.target.value)}
              disabled={loading}
              required
              className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            />
          </div>
        )}

        {isIdControlled && (
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-2">
            <span className="text-xs text-gray-400 uppercase tracking-wide">Campaign</span>
            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              #{propId}
            </span>
          </div>
        )}

        {/* ETH Amount */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Amount (ETH)
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="any"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={loading}
              required
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 pr-14 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">
              ETH
            </span>
          </div>
          {amount && parseFloat(amount) > 0 && (
            <p className="text-xs text-gray-400">
              ≈ {formatEth(parseEth(amount))} ETH will be sent
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Pending */}
        {txHash && !success && loading && (
          <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 px-4 py-3 text-sm text-yellow-700 dark:text-yellow-400">
            <p className="font-medium mb-0.5">Confirming transaction…</p>
            <p className="font-mono text-xs break-all">{txHash}</p>
          </div>
        )}

        {/* Success */}
        {success && txHash && (
          <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3 text-sm text-green-700 dark:text-green-400">
            <p className="font-medium mb-0.5">
              Successfully funded campaign #{campaignId}!
            </p>
            <p className="font-mono text-xs break-all text-green-600 dark:text-green-500">
              Tx: {txHash}
            </p>
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
            "Connect Wallet to Fund"
          ) : (
            "Send ETH"
          )}
        </button>
      </form>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
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
