const CATEGORIES = [
  { name: "Startup", color: "from-emerald-400 to-teal-500", bg: "bg-emerald-50", text: "text-emerald-700" },
  { name: "SaaS", color: "from-cyan-400 to-blue-500", bg: "bg-cyan-50", text: "text-cyan-700" },
  { name: "AI & ML", color: "from-purple-400 to-pink-500", bg: "bg-purple-50", text: "text-purple-700" },
  { name: "Fintech", color: "from-amber-400 to-orange-500", bg: "bg-amber-50", text: "text-amber-700" },
  { name: "Web3", color: "from-violet-400 to-fuchsia-500", bg: "bg-violet-50", text: "text-violet-700" },
  { name: "DeFi", color: "from-blue-400 to-indigo-500", bg: "bg-blue-50", text: "text-blue-700" },
  { name: "Gaming", color: "from-rose-400 to-pink-500", bg: "bg-rose-50", text: "text-rose-700" },
  { name: "Social", color: "from-sky-400 to-cyan-500", bg: "bg-sky-50", text: "text-sky-700" },
  { name: "Infrastructure", color: "from-slate-400 to-gray-500", bg: "bg-slate-50", text: "text-slate-700" },
  { name: "DAO", color: "from-purple-400 to-violet-500", bg: "bg-purple-50", text: "text-purple-700" },
];

const PROJECT_NAMES = [
  "Nova Protocol", "ChainVault", "MetaSync", "DeFi Shield", "Quantum Labs",
  "NexGen Finance", "BlockBridge", "CryptoForge", "Stellar Pay", "Orbit DAO",
  "Flux Network", "Prism Analytics", "Zenith Cloud", "Echo Protocol", "Apex Ventures",
  "Pulse Finance", "Vertex AI", "Cipher Systems", "Nimbus Platform", "Helix Protocol",
];

const DESCRIPTIONS = [
  "Building the future of decentralized infrastructure with cutting-edge technology.",
  "Revolutionizing how teams collaborate and manage digital assets on-chain.",
  "An innovative platform connecting global investors with emerging opportunities.",
  "Next-generation financial tools powered by smart contracts and AI.",
  "Creating seamless bridges between traditional finance and the blockchain ecosystem.",
  "Empowering creators and builders with transparent, trustless funding mechanisms.",
  "A scalable solution for enterprise-grade decentralized applications.",
  "Transforming supply chain management through blockchain transparency.",
  "Building accessible DeFi tools for the next billion users.",
  "Pioneering new models for community governance and collective decision-making.",
];

export function getCampaignCategory(id) {
  return CATEGORIES[id % CATEGORIES.length];
}

export function getCampaignName(id) {
  return PROJECT_NAMES[id % PROJECT_NAMES.length];
}

export function getCampaignDescription(id) {
  return DESCRIPTIONS[id % DESCRIPTIONS.length];
}

export function getCreatorAvatar(address) {
  if (!address) return "";
  const hash = address.slice(2, 10);
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${hash}&backgroundColor=6366f1,8b5cf6,06b6d4,10b981&shape=circle`;
}

export function getCreatorName(address) {
  if (!address) return "Anonymous";
  const names = [
    "Alex Chen", "Sarah Kim", "Marcus Wright", "Elena Popov", "James O'Brien",
    "Yuki Tanaka", "Priya Sharma", "David Costa", "Aisha Ibrahim", "Luca Romano",
    "Maya Patel", "Oscar Nguyen", "Zara Mohammed", "Felix Wagner", "Ana Silva",
    "Kai Eriksson", "Nina Volkov", "Ravi Krishnan", "Eva Lindström", "Omar Hassan",
  ];
  const idx = parseInt(address.slice(2, 6), 16) % names.length;
  return names[idx];
}
