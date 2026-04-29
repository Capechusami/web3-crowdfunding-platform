"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const STATS = [
  { value: "$50.4M", label: "Funds raised for innovative startups", position: "left-top" },
  { value: "60%", label: "Of founders successfully reach their goal", position: "top-left" },
  { value: "86", label: "Countries where founders raise capital", position: "top-right" },
  { value: "863", label: "Startups funded by FundChain backers", position: "right-top" },
];

export default function Stats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-gradient-to-br from-teal-700 to-emerald-700 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6" ref={ref}>
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            A Vast User Community!
          </h2>
          <p className="text-emerald-50 max-w-xl mx-auto">
            Thanks to our trustless on-chain crowdfunding, even the smallest contributions
            can fuel an extraordinary startup.
          </p>
        </motion.div>

        {/* Center icon with stats around */}
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 items-center max-w-5xl mx-auto">
          {STATS.map((stat, i) => (
            <motion.div
              key={i}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <p className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</p>
              <p className="text-sm text-emerald-100 leading-relaxed">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Community photo */}
        <motion.div
          className="flex justify-center mt-16"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="relative w-full max-w-3xl aspect-[16/7] rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1600&q=80"
              alt="Diverse global community of founders and backers"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-white text-xl md:text-2xl font-bold">
                Built by founders, for founders.
              </p>
              <p className="text-emerald-50 text-sm mt-1">
                A worldwide community shaping the future of innovation.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

