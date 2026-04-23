import contractData from "@/abi/Crowdfunding.json";

export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || contractData.address || "";

export const CONTRACT_ABI = contractData.abi;

export const CHAIN_ID = Number(process.env.NEXT_PUBLIC_CHAIN_ID || 31337);

export const NETWORKS = {
  31337: {
    chainId: "0x7a69",
    chainName: "Hardhat Localhost",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["http://127.0.0.1:8545"],
    blockExplorerUrls: [],
  },
  11155111: {
    chainId: "0xaa36a7",
    chainName: "Sepolia",
    nativeCurrency: { name: "Sepolia ETH", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://rpc.sepolia.org"],
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
  },
};

export const ACTIVE_NETWORK = NETWORKS[CHAIN_ID];
