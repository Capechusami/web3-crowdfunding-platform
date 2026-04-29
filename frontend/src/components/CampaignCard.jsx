"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { formatEth, timeLeft, progressPercent } from "@/utils/format";
import { getCampaignCategory, getCampaignName, getCampaignDescription } from "@/utils/campaignMeta";

export default function CampaignCard({ campaign }) {
  const { id, goal, totalRaised, deadline, withdrawn, title, description, image } = campaign;

  const now = BigInt(Math.floor(Date.now() / 1000));
  const ended = now >= BigInt(deadline);
  const success = ended && BigInt(totalRaised) >= BigInt(goal);
  const failed = ended && BigInt(totalRaised) < BigInt(goal);
  const pct = progressPercent(totalRaised, goal);
  const category = getCampaignCategory(id);

  // Use real metadata if available, fallback to mock
  const displayTitle = title || getCampaignName(id);
  const displayDesc = description || getCampaignDescription(id);

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.2 }}>
      <Link
        href={`/campaign/${id}`}
        className="group block bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow h-full"
      >
        {/* Image area */}
        <div className={`relative aspect-[4/3] overflow-hidden ${image ? "bg-gray-100" : `bg-gradient-to-br ${category.color}`}`}>
          {image && (
            <img
              src={image}
              alt={displayTitle}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          <div className="absolute top-3 left-3">
            <span className="badge bg-white/90 text-gray-900 backdrop-blur-sm">
              {category.name}
            </span>
          </div>
          <StatusBadge success={success} failed={failed} withdrawn={withdrawn} />
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-white/90 text-xs font-medium uppercase tracking-wider drop-shadow">
              Campaign #{id}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title */}
          <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-emerald-600 transition-colors">
            {displayTitle}
          </h3>

          {/* Description */}
          <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed">
            {displayDesc}
          </p>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-gray-500 font-medium">Raised</span>
              <span className="text-emerald-600 font-bold">
                {pct.toFixed(0)}% • {timeLeft(deadline)}
              </span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${
                  success
                    ? "bg-gradient-to-r from-emerald-500 to-green-400"
                    : failed
                    ? "bg-gradient-to-r from-red-500 to-rose-400"
                    : "bg-gradient-to-r from-emerald-500 to-teal-500"
                }`}
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
            <div>
              <p className="text-base font-bold text-gray-900">
                {formatEth(totalRaised)} ETH
              </p>
              <p className="text-xs text-gray-400">
                Funded of {formatEth(goal)} ETH
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-emerald-500 text-emerald-600 text-xs font-semibold group-hover:bg-emerald-500 group-hover:text-white transition-all">
              Donate
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function StatusBadge({ success, failed, withdrawn }) {
  if (withdrawn) {
    return (
      <span className="absolute top-3 right-3 badge bg-gray-700/90 text-white backdrop-blur-sm">
        Withdrawn
      </span>
    );
  }
  if (success) {
    return (
      <span className="absolute top-3 right-3 badge bg-emerald-500/95 text-white backdrop-blur-sm">
        Funded
      </span>
    );
  }
  if (failed) {
    return (
      <span className="absolute top-3 right-3 badge bg-red-500/95 text-white backdrop-blur-sm">
        Failed
      </span>
    );
  }
  return (
    <span className="absolute top-3 right-3 badge bg-emerald-500/95 text-white backdrop-blur-sm">
      Active
    </span>
  );
}
