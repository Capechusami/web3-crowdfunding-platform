"use client";

import { useState } from "react";
import { useWeb3 } from "@/context/Web3Context";
import { useContract } from "@/hooks/useContract";
import { formatEth } from "@/utils/format";

export default function WithdrawButton({ campaign, onWithdrawn }) {
  const { account, isConnected, isCorrectNetwork, connect } = useWeb3();
  const contract = useContract();

  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [txHash, setTxHash]   = useState(null);
  const [done, setDone]       = useState(false);

  const { id, creator, goal, totalRaised, deadline, withdrawn } = campaign;

  const now          = BigInt(Math.floor(Date.now() / 1000));
  const deadlineBig  = BigInt(deadline);
  const goalBig      = BigInt(goal);
  const raisedBig    = BigInt(totalRaised);

  const isCreator    = account?.toLowerCase() === creator?.toLowerCase();
  const hasEnded     = now >= deadlineBig;
  const goalReached  = raisedBig >= goalBig;
  const alreadyDone  = withdrawn || done;

  function getBlockReason() {
    if (!isConnected)         return "Connect your wallet to withdraw.";
    if (!isCorrectNetwork)    return "Switch to the correct network.";
    if (!isCreator)           return "Only the campaign creator can withdraw.";
    if (!hasEnded)            return "Campaign is still active — wait for the deadline.";
    if (!goalReached)         return "Goal was not reached — contributors can claim refunds.";
    if (alreadyDone)          return "Funds have already been withdrawn.";
    return null;
  }

  const blockReason = getBlockReason();
  const canWithdraw = !blockReason;

  async function handleWithdraw() {
    setError(null);
    setTxHash(null);

    if (!isConnected || !isCorrectNetwork) {
      await connect();
      return;
    }
    if (!contract) {
      setError("Contract not loaded.");
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.withdraw(id);
      setTxHash(tx.hash);
      await tx.wait();
      setDone(true);
      if (onWithdrawn) onWithdrawn(id);
    } catch (e) {
      setError(e?.reason || e?.shortMessage || e?.message || "Transaction failed.");
    } finally {
      setLoading(false);
    }
  }

  if (alreadyDone && txHash) {
    return (
      <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 text-sm text-emerald-400">
        <p className="font-medium">Withdrawal successful!</p>
        <p className="font-mono text-xs break-all mt-1 text-emerald-500">
          Tx: {txHash}
        </p>
      </div>
    );
  }

  if (alreadyDone) {
    return (
      <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] px-4 py-3 text-sm text-gray-400">
        Funds already withdrawn.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Eligibility info */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <Check label="You are creator"   ok={isCreator} />
        <Check label="Campaign ended"    ok={hasEnded} />
        <Check label="Goal reached"      ok={goalReached} />
        <Check label="Not yet withdrawn" ok={!withdrawn} />
      </div>

      {/* Amount to receive */}
      {canWithdraw && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-sm text-emerald-400">
          You will receive <span className="font-semibold">{formatEth(totalRaised)} ETH</span>
        </div>
      )}

      {/* Block reason */}
      {blockReason && !canWithdraw && (
        <p className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
          {blockReason}
        </p>
      )}

      {/* Pending */}
      {txHash && loading && (
        <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-2 text-xs text-amber-400 font-mono break-all">
          Confirming… {txHash}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2 text-sm text-red-400">
          {error}
        </div>
      )}

      <button
        onClick={handleWithdraw}
        disabled={!canWithdraw || loading}
        className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 px-4 py-3 text-sm font-semibold text-white hover:shadow-lg hover:shadow-emerald-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Spinner />
            {txHash ? "Confirming…" : "Waiting for wallet…"}
          </>
        ) : (
          `Withdraw ${formatEth(totalRaised)} ETH`
        )}
      </button>
    </div>
  );
}

function Check({ label, ok }) {
  return (
    <div className={`flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium
      ${ok
        ? "bg-emerald-500/10 text-emerald-400"
        : "bg-white/[0.04] text-gray-500"
      }`}
    >
      <span>{ok ? "✓" : "○"}</span>
      <span>{label}</span>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor"
        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
    </svg>
  );
}
