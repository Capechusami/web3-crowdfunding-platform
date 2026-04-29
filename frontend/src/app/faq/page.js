"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection, { StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";
import Link from "next/link";

const FAQ_DATA = [
  {
    category: "General",
    questions: [
      {
        q: "What is FundChain?",
        a: "FundChain is a fully decentralized crowdfunding platform built on the Ethereum blockchain. It allows anyone to create campaigns, raise capital, and fund projects — all without intermediaries, with smart contracts ensuring transparency and fairness.",
      },
      {
        q: "How is this different from GoFundMe or Kickstarter?",
        a: "Unlike traditional platforms, FundChain has zero platform fees, no central authority, and operates entirely on-chain. Smart contracts automatically enforce rules — if a campaign fails its goal, contributors are guaranteed refunds by code, not by a company's promise.",
      },
      {
        q: "Do I need cryptocurrency to use FundChain?",
        a: "Yes. You need ETH (Ether) in a Web3 wallet like MetaMask to create campaigns, contribute funds, or pay for network transaction fees (gas).",
      },
    ],
  },
  {
    category: "For Founders",
    questions: [
      {
        q: "How do I create a campaign?",
        a: "Navigate to the Create page, set your funding goal (in ETH) and campaign duration, then confirm the transaction in your wallet. Your campaign will be deployed on the blockchain instantly.",
      },
      {
        q: "What happens if my campaign reaches its goal?",
        a: "Once the deadline passes and your total raised meets or exceeds the goal, you can withdraw all funds directly to your wallet. Only the campaign creator can withdraw.",
      },
      {
        q: "Are there any fees?",
        a: "FundChain charges zero platform fees. The only costs are Ethereum network gas fees for transactions (creating campaigns, withdrawing). 100% of raised funds go to the creator.",
      },
      {
        q: "Can I cancel my campaign?",
        a: "Campaigns cannot be cancelled once created — they are immutable smart contract deployments. The campaign will run until the deadline. If the goal isn't met, all contributors receive automatic refunds.",
      },
    ],
  },
  {
    category: "For Investors",
    questions: [
      {
        q: "How do I fund a campaign?",
        a: "Connect your MetaMask wallet, browse campaigns on the Explore page, click into a campaign, and use the Fund form to send ETH. Your contribution is recorded on-chain.",
      },
      {
        q: "What if a campaign fails?",
        a: "If the campaign doesn't reach its funding goal by the deadline, you can claim a full refund. The smart contract holds your ETH until either the creator withdraws (on success) or you refund (on failure).",
      },
      {
        q: "Can I contribute multiple times?",
        a: "Yes. Each contribution adds to your total for that campaign. If a refund is needed, you receive back your entire cumulative contribution.",
      },
      {
        q: "Is my investment safe?",
        a: "Your ETH is held by the smart contract, not by any person or company. The contract is built with OpenZeppelin's ReentrancyGuard and uses well-tested security patterns. The code is fully open-source and auditable.",
      },
    ],
  },
  {
    category: "Technical",
    questions: [
      {
        q: "Which blockchain does FundChain run on?",
        a: "FundChain runs on Ethereum. It supports both Ethereum mainnet and the Sepolia testnet for development and testing.",
      },
      {
        q: "What wallet do I need?",
        a: "MetaMask is the recommended wallet. Any EIP-1193 compatible wallet should work. Make sure you're connected to the correct network (Sepolia for testing, or the local Hardhat network for development).",
      },
      {
        q: "Is the smart contract audited?",
        a: "The contract uses battle-tested OpenZeppelin libraries and follows Solidity best practices including custom errors, reentrancy protection, and access control. The source code is fully open-source for community review.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <AnimatedSection className="text-center mb-16">
        <span className="text-sm font-medium text-indigo-400 uppercase tracking-wider mb-3 block">Support</span>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Frequently Asked <span className="gradient-text">Questions</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Everything you need to know about creating, funding, and managing campaigns on FundChain.
        </p>
      </AnimatedSection>

      <div className="flex flex-col gap-12">
        {FAQ_DATA.map((section) => (
          <AnimatedSection key={section.category}>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-sm text-indigo-400 font-bold">
                {section.category[0]}
              </span>
              {section.category}
            </h2>
            <div className="flex flex-col gap-3">
              {section.questions.map((item) => (
                <FAQItem key={item.q} question={item.q} answer={item.a} />
              ))}
            </div>
          </AnimatedSection>
        ))}
      </div>

      {/* CTA */}
      <AnimatedSection className="mt-16">
        <div className="glass-card rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Still have questions?</h3>
          <p className="text-gray-400 text-sm mb-6">Check out the About page or dive into the source code.</p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/about" className="btn-primary text-sm">About FundChain</Link>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="btn-secondary text-sm">View Source</a>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left group"
      >
        <span className="text-sm font-medium text-white group-hover:text-indigo-300 transition-colors pr-4">{question}</span>
        <motion.svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-gray-500 flex-shrink-0"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0">
              <div className="h-px bg-white/[0.06] mb-4" />
              <p className="text-sm text-gray-400 leading-relaxed">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
