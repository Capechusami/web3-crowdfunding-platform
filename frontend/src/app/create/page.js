"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useWeb3 } from "@/context/Web3Context";
import { useContract } from "@/hooks/useContract";
import { parseEth } from "@/utils/format";
import { saveCampaignMetadata } from "@/utils/campaignStorage";

const DURATION_PRESETS = [
  { label: "7 days", value: 7 * 86400 },
  { label: "14 days", value: 14 * 86400 },
  { label: "30 days", value: 30 * 86400 },
  { label: "60 days", value: 60 * 86400 },
];

const STEPS = [
  { num: 1, label: "Project Info" },
  { num: 2, label: "Funding Details" },
  { num: 3, label: "Review & Launch" },
];

export default function CreatePage() {
  const router = useRouter();
  const { isConnected, connect, isCorrectNetwork, switchNetwork } = useWeb3();
  const contract = useContract();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [goal, setGoal] = useState("");
  const [duration, setDuration] = useState(String(7 * 86400));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [campaignId, setCampaignId] = useState(null);

  function handleImageUpload(e) {
    setImageError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setImageError("Please upload a valid image file (JPG, PNG, WebP).");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setImageError("Image too large. Max size: 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.onerror = () => setImageError("Failed to read image.");
    reader.readAsDataURL(file);
  }

  const canNextStep1 = title.trim().length >= 3 && description.trim().length >= 10;
  const canNextStep2 = parseFloat(goal) > 0 && parseInt(duration, 10) > 0;

  async function handleSubmit() {
    setError(null);
    setTxHash(null);

    if (!isConnected) {
      await connect();
      return;
    }
    if (!isCorrectNetwork) {
      await switchNetwork();
      return;
    }
    if (!contract) {
      setError("Contract not loaded.");
      return;
    }

    try {
      setLoading(true);
      const goalWei = parseEth(goal);
      const tx = await contract.createCampaign(goalWei, parseInt(duration, 10));
      setTxHash(tx.hash);

      const receipt = await tx.wait();
      let id = null;
      const iface = contract.interface;
      for (const log of receipt.logs) {
        try {
          const parsed = iface.parseLog(log);
          if (parsed?.name === "CampaignCreated") {
            id = Number(parsed.args.campaignId);
            break;
          }
        } catch {}
      }

      if (id !== null) {
        saveCampaignMetadata(id, { title, description, image });
      }
      setCampaignId(id);
    } catch (e) {
      setError(e?.reason || e?.shortMessage || e?.message || "Transaction failed.");
    } finally {
      setLoading(false);
    }
  }

  // Success screen
  if (campaignId !== null) {
    return (
      <main className="bg-white min-h-screen pt-32 pb-20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6"
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Campaign Launched! 🎉</h1>
          <p className="text-gray-600 mb-2">Your campaign is now live on Ethereum.</p>
          <p className="text-sm text-gray-500 mb-8">
            Campaign ID: <span className="font-mono font-semibold text-gray-900">#{campaignId}</span>
          </p>
          {txHash && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8 text-left">
              <p className="text-xs text-gray-500 mb-1">Transaction Hash</p>
              <p className="text-xs font-mono text-gray-700 break-all">{txHash}</p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={`/campaign/${campaignId}`} className="btn-primary justify-center">
              View Campaign
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/explore" className="btn-secondary justify-center">
              Browse All Campaigns
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white min-h-screen pt-32 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="badge badge-primary mb-4">Start a Campaign</span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Launch your <span className="text-emerald-600">startup</span> campaign
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Fill out the details below to deploy your campaign on Ethereum.
            All transactions are on-chain and transparent.
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between mb-12 max-w-md mx-auto">
          {STEPS.map((s, i) => (
            <div key={s.num} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    step >= s.num
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step > s.num ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    s.num
                  )}
                </div>
                <span className={`text-xs mt-2 ${step >= s.num ? "text-gray-900 font-medium" : "text-gray-400"}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 flex-1 -mt-6 transition-colors ${step > s.num ? "bg-emerald-500" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your project</h2>
                <p className="text-sm text-gray-500 mb-6">
                  A great title, description, and banner image help your campaign stand out.
                </p>

                <div className="space-y-5">
                  {/* Banner image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Banner Image <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    {image ? (
                      <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-gray-200 group">
                        <img src={image} alt="Banner preview" className="absolute inset-0 w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setImage(null)}
                          className="absolute top-3 right-3 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700 hover:bg-white transition-colors"
                        >
                          Replace
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center aspect-[16/9] rounded-xl border-2 border-dashed border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/30 transition-colors cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" className="mb-2">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <p className="text-sm font-medium text-gray-700">Click to upload banner</p>
                        <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — max 2MB</p>
                      </label>
                    )}
                    {imageError && (
                      <p className="text-xs text-red-600 mt-2">{imageError}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Campaign Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Nova Protocol — Decentralized Cloud Storage"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={80}
                      className="input-field"
                    />
                    <p className="text-xs text-gray-400 mt-1.5">{title.length}/80 characters</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Short Description
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Describe your project, what problem it solves, and why people should back it..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      maxLength={500}
                      className="input-field resize-none"
                    />
                    <p className="text-xs text-gray-400 mt-1.5">{description.length}/500 characters</p>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Set your funding goal</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Choose a realistic amount and timeframe for your campaign.
                </p>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Funding Goal (ETH)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="1.5"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        className="input-field pr-16"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500">
                        ETH
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Campaign Duration
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                      {DURATION_PRESETS.map((p) => (
                        <button
                          key={p.value}
                          type="button"
                          onClick={() => setDuration(String(p.value))}
                          className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${
                            duration === String(p.value)
                              ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                              : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      min="60"
                      placeholder="Or enter custom duration in seconds"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Review and launch</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Double-check your campaign details before launching to the blockchain.
                </p>

                <div className="bg-gray-50 rounded-xl p-6 space-y-4 mb-6">
                  {image && (
                    <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
                      <img src={image} alt="Campaign banner" className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                  )}
                  <ReviewItem label="Title" value={title} />
                  <ReviewItem label="Description" value={description} />
                  <ReviewItem label="Funding Goal" value={`${goal} ETH`} />
                  <ReviewItem
                    label="Duration"
                    value={`${(parseInt(duration, 10) / 86400).toFixed(0)} days`}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 mb-4">
                    {error}
                  </div>
                )}

                {txHash && loading && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 mb-4 font-mono break-all">
                    Confirming on-chain… {txHash}
                  </div>
                )}

                <p className="text-xs text-gray-500 leading-relaxed">
                  By launching this campaign, you agree to deploy it on Ethereum via the FundChain smart contract.
                  Funds will only be withdrawable when the goal is reached. Backers can request refunds if the goal
                  is not met by the deadline.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1 || loading}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ← Back
            </button>

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={(step === 1 && !canNextStep1) || (step === 2 && !canNextStep2)}
                className="btn-primary text-sm py-2.5 px-6 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary text-sm py-2.5 px-6 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Spinner />
                    {txHash ? "Confirming…" : "Waiting for wallet…"}
                  </>
                ) : !isConnected ? (
                  "Connect Wallet to Launch"
                ) : (
                  <>
                    Launch Campaign
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function ReviewItem({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">{label}</span>
      <span className="text-sm text-gray-900 break-words">{value}</span>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}
