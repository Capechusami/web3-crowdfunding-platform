"use client";

import { motion } from "framer-motion";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";
import Link from "next/link";

const VALUES = [
  {
    title: "Decentralized",
    desc: "No central authority. Smart contracts govern all operations autonomously on Ethereum.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
  },
  {
    title: "Transparent",
    desc: "Every transaction, contribution, and withdrawal is publicly verifiable on the blockchain.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    title: "Secure",
    desc: "Built with OpenZeppelin security standards and reentrancy protection. Auditable by anyone.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "Zero Fees",
    desc: "We don't take a cut. 100% of raised funds go directly to campaign creators.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
  },
  {
    title: "Global Access",
    desc: "Anyone with an Ethereum wallet can create or fund campaigns — no borders, no restrictions.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </svg>
    ),
  },
  {
    title: "Instant",
    desc: "No waiting periods. Funds are available immediately after successful campaign completion.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
];

const TECH_STACK = [
  {
    name: "Smart Contract",
    desc: "Solidity 0.8.24 + OpenZeppelin",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    name: "Frontend",
    desc: "Next.js 16 + TailwindCSS + ethers.js",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    name: "Testing",
    desc: "Hardhat + Chai + full coverage",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 2l1.5 5H22l-4 3 1.5 5L14 12l-5 3 1.5-5-4-3h6z" />
      </svg>
    ),
  },
  {
    name: "Deployment",
    desc: "Hardhat + Etherscan verification",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
];

export default function AboutPage() {
  return (
    <main className="bg-white min-h-screen pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* Hero with image */}
        <AnimatedSection className="grid lg:grid-cols-2 gap-12 items-center mb-24">
          <div>
            <span className="badge badge-primary mb-4">About FundChain</span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              The Future of <span className="text-emerald-600">Crowdfunding</span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              FundChain is a fully decentralized crowdfunding platform built on Ethereum.
              We believe in a world where anyone can raise capital for their ideas without
              intermediaries, fees, or geographic restrictions.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/create" className="btn-primary text-sm">Start a Campaign</Link>
              <Link href="/explore" className="btn-secondary text-sm">Explore Campaigns</Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-emerald-500/10">
            <img
              src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1200&q=80"
              alt="Crowdfunding and investment concept"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="text-white font-bold text-lg">Transparent. Trustless. Global.</p>
            </div>
          </div>
        </AnimatedSection>

        {/* Mission */}
        <AnimatedSection className="mb-24">
          <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-10 md:p-14">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  To democratize access to capital by leveraging blockchain technology. We provide
                  a trustless, transparent platform where founders can connect directly with backers,
                  with smart contracts guaranteeing fairness for all parties.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Every campaign is governed by an immutable smart contract. Funds are held securely
                  on-chain until the goal is met — if not, backers receive an automatic full refund.
                  No middlemen. No hidden fees. Just pure innovation.
                </p>
              </div>
              <div className="relative aspect-square rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80"
                  alt="Team collaborating on blockchain project"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* How it works */}
        <AnimatedSection className="text-center mb-10">
          <span className="badge badge-primary mb-4">How It Works</span>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Simple. Transparent. Secure.</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            From idea to funded project in four straightforward steps.
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-4 gap-6 mb-24">
          {[
            { step: "01", title: "Create", desc: "Set your goal, deadline, and tell the world about your idea." },
            { step: "02", title: "Share", desc: "Promote your campaign link to attract backers globally." },
            { step: "03", title: "Fund", desc: "Backers contribute ETH directly to your smart contract." },
            { step: "04", title: "Withdraw", desc: "Claim your funds once the goal is reached. Backers get refunds if not." },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              className="text-center bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-emerald-300 hover:shadow-lg transition-all"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Core Values */}
        <AnimatedSection className="text-center mb-10">
          <span className="badge badge-primary mb-4">Our Values</span>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Core Principles</h2>
          <p className="text-gray-600 max-w-xl mx-auto">The principles that guide everything we build.</p>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24" staggerDelay={0.08}>
          {VALUES.map((v) => (
            <StaggerItem key={v.title}>
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 h-full hover:border-emerald-300 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  {v.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{v.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Tech Stack */}
        <AnimatedSection className="text-center mb-10">
          <span className="badge badge-primary mb-4">Technology</span>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Built With</h2>
          <p className="text-gray-600 max-w-xl mx-auto">Production-grade technology stack.</p>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-24" staggerDelay={0.08}>
          {TECH_STACK.map((t) => (
            <StaggerItem key={t.name}>
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 text-center hover:border-emerald-300 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 rounded-xl bg-gray-50 text-gray-700 flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  {t.icon}
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1">{t.name}</h3>
                <p className="text-xs text-gray-500">{t.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* CTA */}
        <AnimatedSection>
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-3">Ready to get started?</h2>
              <p className="text-emerald-50 mb-8 text-lg max-w-lg mx-auto">
                Create your first campaign or discover innovative projects to back.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link href="/create" className="bg-white text-emerald-700 font-semibold text-sm px-6 py-3 rounded-full hover:bg-emerald-50 transition-colors shadow-lg">
                  Create Campaign
                </Link>
                <Link href="/explore" className="border-2 border-white text-white font-semibold text-sm px-6 py-3 rounded-full hover:bg-white/10 transition-colors">
                  Explore
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </main>
  );
}
