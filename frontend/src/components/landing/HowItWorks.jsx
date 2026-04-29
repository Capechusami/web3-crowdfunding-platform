"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

const STEPS = [
  {
    number: "01",
    title: "Start your campaign",
    description: "There is no better way to mobilize around an idea and attract investor support.",
    detail: "Easy to Launch",
    detailDesc: "Set your funding goal and deadline in minutes. Your campaign is deployed on Ethereum, fully transparent and immutable.",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80",
    alt: "Founder launching a startup project",
  },
  {
    number: "02",
    title: "Share with backers",
    description: "Invite supporters to participate in your campaign via social networks, talk about it everywhere.",
    detail: "Easy to Promote",
    detailDesc: "Share your campaign URL across social media. Every contribution is verified on-chain, building trust with potential backers.",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    alt: "Team sharing project with community",
  },
  {
    number: "03",
    title: "Track the progress",
    description: "Visualize in real time the progress of each campaign thanks to live blockchain statistics.",
    detail: "Real-time Updates",
    detailDesc: "Watch your campaign grow with live updates. Every donation is instantly visible, building momentum and engagement.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    alt: "Analytics dashboard showing real-time progress",
  },
  {
    number: "04",
    title: "Receive your funds",
    description: "Receive funds directly to your wallet by withdrawing from the smart contract once your goal is met.",
    detail: "Instant Withdrawal",
    detailDesc: "When your goal is reached, withdraw funds instantly to your wallet. No bank delays, no platform fees, just pure efficiency.",
    image: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?auto=format&fit=crop&w=1200&q=80",
    alt: "Crypto wallet receiving funds",
  },
];

export default function HowItWorks() {
  const [active, setActive] = useState(1);
  const step = STEPS[active];

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Quick FundChain Campaigns!
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Embark on your fundraising journey effortlessly with FundChain — a platform where
            creating a campaign takes just a few minutes, streamlining the process of turning your
            ideas into impactful blockchain-secured initiatives.
          </p>
        </motion.div>

        {/* Active step content card */}
        <motion.div
          key={active}
          className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 mb-8 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-emerald-600 font-medium text-lg mb-4">{step.number}</p>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-6">{step.description}</p>
              <div className="border-t border-gray-100 pt-6 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">
                    {step.detail}: <span className="font-normal text-gray-600">{step.detailDesc}</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
              <Image
                src={step.image}
                alt={step.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm">
                <p className="text-emerald-700 font-bold text-sm">Step {step.number}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Steps tab navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {STEPS.map((s, i) => (
            <button
              key={s.number}
              onClick={() => setActive(i)}
              className={`text-left pt-6 border-t-2 transition-colors ${
                active === i
                  ? "border-emerald-500"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <p
                className={`text-sm mb-2 ${
                  active === i ? "text-emerald-600" : "text-gray-400"
                }`}
              >
                {s.number}
              </p>
              <h4
                className={`font-bold mb-2 ${
                  active === i ? "text-emerald-600" : "text-gray-900"
                }`}
              >
                {s.title}
              </h4>
              <p className="text-xs text-gray-500 leading-relaxed">{s.description}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
