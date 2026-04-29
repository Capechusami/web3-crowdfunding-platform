"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useCampaigns } from "@/hooks/useCampaigns";
import CampaignCard from "@/components/CampaignCard";

export default function FeaturedCampaigns() {
  const { campaigns, loading } = useCampaigns();
  const featured = campaigns.slice(0, 4);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
            Initiate your <span className="text-emerald-600">fundraising</span><br />
            campaign today
          </h2>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-100 animate-pulse rounded-2xl h-96" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-6">No campaigns yet. Be the first to start one!</p>
            <Link href="/create" className="btn-primary">
              Create Your Campaign
            </Link>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {featured.map((campaign) => (
              <motion.div
                key={campaign.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <CampaignCard campaign={campaign} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* See more */}
        <div className="text-center mt-12">
          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gray-300 text-gray-700 hover:border-emerald-500 hover:text-emerald-600 transition-colors text-sm font-medium"
          >
            See More
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
