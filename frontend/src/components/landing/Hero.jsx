"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function Hero() {
  const [donationType, setDonationType] = useState("one-time");
  const [amount, setAmount] = useState("");
  const [campaign, setCampaign] = useState("");

  return (
    <section className="relative pt-32 pb-20 bg-gradient-to-b from-white to-emerald-50/30 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-50/50 to-transparent" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-medium mb-6">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              Decentralized crowdfunding on Ethereum
            </span>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Online fundraising for any{" "}
              <span className="text-emerald-600">startup</span>, anytime, anywhere!
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg">
              Initiate a campaign with us to champion innovative projects close to your heart, 
              enjoying the benefit of 0% platform fees, ensuring every dollar goes directly to the project.
            </p>

            {/* Trust indicators */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="20" height="20" viewBox="0 0 24 24" fill="#00b67a">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500">
                <span className="font-semibold text-gray-900">Trustpilot</span> Excellent, 10,000+ reviews
              </span>
            </div>
          </motion.div>

          {/* Right content - Image & Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Hero image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/10">
              <div className="aspect-[4/3] relative bg-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1553729459-uj68oji8ejh8?auto=format&fit=crop&w=1200&q=80"
                  alt="Startup community collaborating on innovative projects"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/50 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-white font-bold text-xl">Startup Community</p>
                  <p className="text-emerald-100 text-sm">Innovating together on Ethereum</p>
                </div>
              </div>
            </div>

            {/* Floating donation form */}
            <motion.div
              className="absolute -bottom-8 left-4 right-4 bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Make a</label>
                  <select 
                    value={donationType}
                    onChange={(e) => setDonationType(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="one-time">One-time</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Donation of</label>
                  <input
                    type="text"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Donation for</label>
                  <select 
                    value={campaign}
                    onChange={(e) => setCampaign(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Choose a startup</option>
                    <option value="tech">Tech Startup</option>
                    <option value="ai">AI Project</option>
                    <option value="web3">Web3 Platform</option>
                  </select>
                </div>
                <Link 
                  href="/explore"
                  className="btn-primary justify-center text-sm py-2.5"
                >
                  Donate
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
