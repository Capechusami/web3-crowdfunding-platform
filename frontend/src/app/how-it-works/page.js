"use client";

import { motion } from "framer-motion";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";
import Link from "next/link";
import Image from "next/image";

/* ─── Lifecycle Steps ─── */
const LIFECYCLE = [
  {
    step: "01",
    title: "Create a Campaign",
    subtitle: "Launch in minutes",
    desc: "Any Ethereum wallet holder can create a campaign by setting a funding goal (in ETH) and a deadline. The smart contract deploys your campaign on-chain — no approval process, no middlemen.",
    details: [
      "Connect your MetaMask or any Web3 wallet",
      "Set your funding goal in ETH and campaign duration",
      "Add a title, description, and banner image",
      "Your campaign is live on the blockchain instantly",
    ],
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    alt: "Developer launching a campaign on laptop",
    accent: "emerald",
  },
  {
    step: "02",
    title: "Fund a Campaign",
    subtitle: "Back ideas you believe in",
    desc: "Supporters contribute ETH directly to the smart contract. Every contribution is recorded on-chain with full transparency — the creator cannot touch the funds until the campaign ends successfully.",
    details: [
      "Browse active campaigns on the Explore page",
      "Enter any ETH amount and confirm the transaction",
      "Your contribution is tracked in real-time on the progress bar",
      "Funds are held securely by the smart contract, not the creator",
    ],
    image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80",
    alt: "People shaking hands to fund a project",
    accent: "blue",
  },
  {
    step: "03",
    title: "Goal Reached — Withdraw",
    subtitle: "Creator receives funds",
    desc: "When the deadline passes and the total raised meets or exceeds the goal, the campaign creator can withdraw all funds in a single transaction. The smart contract enforces this — only the creator can withdraw, and only after success.",
    details: [
      "Campaign deadline must have passed",
      "Total contributions must meet or exceed the goal",
      "Only the original creator wallet can call withdraw",
      "Funds are transferred directly — zero platform fees",
    ],
    image: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?auto=format&fit=crop&w=800&q=80",
    alt: "Receiving cryptocurrency funds",
    accent: "teal",
  },
  {
    step: "04",
    title: "Goal Not Reached — Refund",
    subtitle: "Backers are fully protected",
    desc: "If the campaign fails to reach its goal by the deadline, every contributor can claim a full refund of their exact contribution. The smart contract guarantees this — no partial refunds, no disputes.",
    details: [
      "Campaign deadline must have passed",
      "Total raised must be below the goal",
      "Each backer claims their own refund individually",
      "100% of your contribution is returned to your wallet",
    ],
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80",
    alt: "Financial protection and refund guarantee",
    accent: "amber",
  },
];

/* ─── Smart Contract Features ─── */
const CONTRACT_FEATURES = [
  {
    title: "Permissionless",
    desc: "Anyone with an Ethereum wallet can create or fund a campaign. No sign-ups, no KYC, no gatekeepers.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
    ),
  },
  {
    title: "Reentrancy Protected",
    desc: "Built with OpenZeppelin's ReentrancyGuard to prevent exploit attacks on fund, withdraw, and refund functions.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "On-Chain Transparency",
    desc: "Every action emits an event — CampaignCreated, Funded, Withdrawn, Refunded — all publicly verifiable on Etherscan.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    title: "Zero Platform Fees",
    desc: "The smart contract takes no cut. 100% of contributed funds go to the creator on success or back to backers on failure.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
  },
  {
    title: "Immutable Rules",
    desc: "Campaign goal and deadline are set at creation and cannot be changed. No one — not even the creator — can modify the terms.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    title: "Trustless Escrow",
    desc: "Funds are held by the smart contract, not by any individual or company. Code is law — the rules execute automatically.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
      </svg>
    ),
  },
];

/* ─── Flow Diagram Data ─── */
const FLOW_STEPS = [
  { label: "Connect Wallet", icon: "wallet" },
  { label: "Create / Fund", icon: "plus" },
  { label: "Smart Contract", icon: "contract" },
  { label: "Goal Met?", icon: "check" },
  { label: "Withdraw / Refund", icon: "transfer" },
];

const accentMap = {
  emerald: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", dot: "bg-emerald-500" },
  blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", dot: "bg-blue-500" },
  teal: { bg: "bg-teal-50", border: "border-teal-200", text: "text-teal-700", dot: "bg-teal-500" },
  amber: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", dot: "bg-amber-500" },
};

export default function HowItWorksPage() {
  return (
    <main className="bg-white min-h-screen pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* ─── Page Hero ─── */}
        <AnimatedSection className="text-center mb-20">
          <span className="badge badge-primary mb-4">How It Works</span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Understand the <span className="text-emerald-600">Full Process</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            FundChain is powered by an Ethereum smart contract that handles campaign creation,
            contributions, withdrawals, and refunds — all without intermediaries. Here's exactly
            how every part of the system works.
          </p>
        </AnimatedSection>

        {/* ─── Visual Flow Diagram ─── */}
        <AnimatedSection className="mb-24">
          <div className="bg-gray-50 border-2 border-gray-200 rounded-3xl p-8 md:p-12">
            <h2 className="text-center text-xl font-bold text-gray-900 mb-10">Transaction Flow Overview</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
              {FLOW_STEPS.map((s, i) => (
                <div key={s.label} className="flex items-center">
                  <motion.div
                    className="flex flex-col items-center gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12 }}
                  >
                    <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <FlowIcon type={s.icon} />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 text-center max-w-[100px]">{s.label}</p>
                  </motion.div>
                  {i < FLOW_STEPS.length - 1 && (
                    <div className="hidden md:block w-12 h-0.5 bg-emerald-300 mx-2" />
                  )}
                  {i < FLOW_STEPS.length - 1 && (
                    <div className="block md:hidden w-0.5 h-6 bg-emerald-300 my-1" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* ─── Lifecycle Steps ─── */}
        <AnimatedSection className="text-center mb-12">
          <span className="badge badge-primary mb-4">Step by Step</span>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Campaign Lifecycle</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            From creation to completion, every campaign follows this transparent lifecycle governed by the smart contract.
          </p>
        </AnimatedSection>

        <div className="flex flex-col gap-10 mb-24">
          {LIFECYCLE.map((item, i) => {
            const a = accentMap[item.accent];
            return (
              <motion.div
                key={item.step}
                className={`border-2 ${a.border} rounded-3xl overflow-hidden shadow-sm`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="grid lg:grid-cols-2">
                  {/* Image — always left */}
                  <div className="relative aspect-[4/3] lg:aspect-auto min-h-[300px] bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.alt}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-xs font-bold ${a.dot} shadow-lg`}>
                        Step {item.step}
                      </span>
                    </div>
                  </div>

                  {/* Content — always right */}
                  <div className="p-8 md:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className={`w-10 h-10 rounded-full ${a.dot} text-white flex items-center justify-center text-sm font-bold`}>
                        {item.step}
                      </span>
                      <span className={`text-xs font-semibold uppercase tracking-wider ${a.text}`}>
                        {item.subtitle}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed mb-6">{item.desc}</p>
                    <ul className="space-y-3">
                      {item.details.map((d, j) => (
                        <li key={j} className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-full ${a.dot} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          </div>
                          <span className="text-sm text-gray-700">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ─── Smart Contract Features ─── */}
        <AnimatedSection className="text-center mb-12">
          <span className="badge badge-primary mb-4">Smart Contract</span>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Built for Trust & Security</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            The Crowdfunding.sol contract is built with Solidity 0.8.24 and OpenZeppelin security primitives.
            Every function is designed with safety-first principles.
          </p>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24" staggerDelay={0.08}>
          {CONTRACT_FEATURES.map((f) => (
            <StaggerItem key={f.title}>
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 h-full hover:border-emerald-300 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* ─── Contract Functions Reference ─── */}
        <AnimatedSection className="mb-24">
          <div className="bg-gray-900 rounded-3xl p-8 md:p-12 overflow-hidden">
            <h2 className="text-2xl font-bold text-white mb-2">Contract Functions</h2>
            <p className="text-gray-400 mb-8 max-w-xl">
              The core smart contract exposes these public functions. Each is secured with custom error handling and reentrancy protection.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  fn: "createCampaign(goal, duration)",
                  desc: "Creates a new campaign with a funding goal (wei) and duration (seconds). Returns the campaign ID.",
                  tag: "Write",
                },
                {
                  fn: "fund(campaignId)",
                  desc: "Contribute ETH to an active campaign. Reverts if campaign has ended or contribution is zero.",
                  tag: "Payable",
                },
                {
                  fn: "withdraw(campaignId)",
                  desc: "Creator withdraws all funds after deadline if goal is met. Reverts for non-creators or failed campaigns.",
                  tag: "Write",
                },
                {
                  fn: "refund(campaignId)",
                  desc: "Contributor reclaims their exact contribution if campaign fails. Reverts if goal was reached.",
                  tag: "Write",
                },
                {
                  fn: "getCampaign(campaignId)",
                  desc: "Returns the full Campaign struct: creator, goal, deadline, totalRaised, withdrawn status.",
                  tag: "View",
                },
                {
                  fn: "getContribution(campaignId, address)",
                  desc: "Returns the amount a specific address has contributed to a campaign.",
                  tag: "View",
                },
              ].map((item) => (
                <motion.div
                  key={item.fn}
                  className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <code className="text-emerald-400 text-sm font-mono font-medium">{item.fn}</code>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      item.tag === "Payable"
                        ? "bg-amber-500/20 text-amber-400"
                        : item.tag === "View"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-emerald-500/20 text-emerald-400"
                    }`}>
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* ─── FAQ Section ─── */}
        <AnimatedSection className="text-center mb-12">
          <span className="badge badge-primary mb-4">FAQ</span>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Common Questions</h2>
        </AnimatedSection>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-24" staggerDelay={0.06}>
          {[
            {
              q: "What wallet do I need?",
              a: "Any Ethereum-compatible wallet like MetaMask, Coinbase Wallet, or WalletConnect-supported wallets.",
            },
            {
              q: "What network does FundChain run on?",
              a: "Currently deployed on Sepolia testnet for testing. The contract can be deployed to any EVM-compatible chain.",
            },
            {
              q: "Is there a minimum contribution?",
              a: "Any amount above 0 ETH is accepted. The smart contract will reject zero-value transactions.",
            },
            {
              q: "What happens if a campaign fails?",
              a: "If the goal is not reached by the deadline, every contributor can claim a full refund of their exact contribution.",
            },
            {
              q: "Can the creator change the goal or deadline?",
              a: "No. Once created, the goal and deadline are immutable. The smart contract enforces this permanently.",
            },
            {
              q: "Does FundChain charge fees?",
              a: "Zero platform fees. You only pay the standard Ethereum gas fee for your transaction.",
            },
          ].map((item) => (
            <StaggerItem key={item.q}>
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 h-full hover:border-emerald-200 transition-colors">
                <h4 className="text-base font-bold text-gray-900 mb-2">{item.q}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* ─── CTA ─── */}
        <AnimatedSection>
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-3">Ready to try it?</h2>
              <p className="text-emerald-50 mb-8 text-lg max-w-lg mx-auto">
                Create your first campaign or fund an innovative project — all secured by Ethereum smart contracts.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link href="/create" className="bg-white text-emerald-700 font-semibold text-sm px-6 py-3 rounded-full hover:bg-emerald-50 transition-colors shadow-lg">
                  Create Campaign
                </Link>
                <Link href="/explore" className="border-2 border-white text-white font-semibold text-sm px-6 py-3 rounded-full hover:bg-white/10 transition-colors">
                  Explore Campaigns
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </main>
  );
}

/* ─── Flow Diagram Icons ─── */
function FlowIcon({ type }) {
  const props = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (type) {
    case "wallet":
      return <svg {...props}><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" /></svg>;
    case "plus":
      return <svg {...props}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>;
    case "contract":
      return <svg {...props}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>;
    case "check":
      return <svg {...props}><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>;
    case "transfer":
      return <svg {...props}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>;
    default:
      return null;
  }
}
