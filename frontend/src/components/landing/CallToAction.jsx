"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-700 px-8 py-16 md:px-16 md:py-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl" />

          {/* Content */}
          <div className="relative text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to Fund the Future of Innovation?
            </h2>
            <p className="text-lg text-emerald-50 mb-10">
              Join thousands of founders and backers shaping the next generation of startups.
              Launch your campaign or discover breakthrough projects on FundChain.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/create"
                className="px-8 py-4 bg-white text-emerald-700 font-semibold rounded-full hover:bg-emerald-50 transition-all hover:shadow-xl text-base inline-flex items-center gap-2"
              >
                Start a Campaign
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <Link
                href="/explore"
                className="px-8 py-4 bg-transparent text-white font-semibold rounded-full border-2 border-white hover:bg-white/10 transition-all text-base inline-flex items-center gap-2"
              >
                Browse Campaigns
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
