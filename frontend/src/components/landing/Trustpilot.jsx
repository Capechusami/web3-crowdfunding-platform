"use client";

import { motion } from "framer-motion";

export default function Trustpilot() {
  return (
    <section className="bg-white pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Left - Trustpilot */}
          <div className="flex items-center gap-3">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#00b67a">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <div>
              <p className="text-base font-bold text-gray-900">Trustpilot</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#00b67a">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className="text-xs text-gray-500">Excellent, 10,000+ reviews</p>
              </div>
            </div>
          </div>

          {/* Center - Quote */}
          <div className="text-center max-w-xl">
            <p className="text-lg md:text-xl text-gray-700 italic font-medium leading-relaxed">
              &quot;Easy to use and great customer service. FundChain is now my favorite crowdfunding platform.&quot;
            </p>
            <p className="text-sm text-gray-500 mt-3">- John Dellen</p>
          </div>

          {/* Right - Navigation */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-emerald-500 hover:text-emerald-600 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 hover:bg-emerald-100 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <a href="#" className="text-xs text-gray-500 hover:text-emerald-600 transition-colors">View all Reviews</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
