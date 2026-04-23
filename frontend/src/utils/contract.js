import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI, ACTIVE_NETWORK } from "./constants";

function assertConfig() {
  if (!CONTRACT_ADDRESS) {
    throw new Error(
      "Contract address is not configured. Set NEXT_PUBLIC_CONTRACT_ADDRESS or run the deploy script."
    );
  }
  if (!CONTRACT_ABI || CONTRACT_ABI.length === 0) {
    throw new Error(
      "Contract ABI is empty. Run the deploy script to populate frontend/src/abi/Crowdfunding.json."
    );
  }
}

/**
 * Returns a Crowdfunding contract instance connected to a signer or provider.
 * Use this when you already have a signer (write) or provider (read).
 *
 * @param {ethers.Signer|ethers.Provider} signerOrProvider
 * @returns {ethers.Contract}
 */
export function getContract(signerOrProvider) {
  assertConfig();
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
}

/**
 * Returns a read-only contract instance using a JsonRpcProvider
 * built from the active network's RPC URL.
 * Safe to call outside browser / without MetaMask.
 *
 * @returns {ethers.Contract}
 */
export function getReadOnlyContract() {
  assertConfig();
  if (!ACTIVE_NETWORK?.rpcUrls?.[0]) {
    throw new Error("No RPC URL configured for the active network.");
  }
  const provider = new ethers.JsonRpcProvider(ACTIVE_NETWORK.rpcUrls[0]);
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
}
