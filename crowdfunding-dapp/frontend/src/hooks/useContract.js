"use client";

import { useMemo } from "react";
import { useWeb3 } from "@/context/Web3Context";
import { getContract, getReadOnlyContract } from "@/utils/contract";

/**
 * Returns a Crowdfunding contract instance connected to:
 *  - the signer            (write + read, wallet connected)
 *  - the browser provider  (read-only, wallet connected but no signer yet)
 *  - JsonRpcProvider       (read-only fallback, no wallet at all)
 *  - null                  (ABI / address not yet configured)
 */
export function useContract() {
  const { signer, provider } = useWeb3();

  return useMemo(() => {
    try {
      if (signer) return getContract(signer);
      if (provider) return getContract(provider);
      return getReadOnlyContract();
    } catch {
      return null;
    }
  }, [signer, provider]);
}
