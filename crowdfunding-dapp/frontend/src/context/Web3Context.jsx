"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ethers } from "ethers";
import { ACTIVE_NETWORK, CHAIN_ID } from "@/utils/constants";

const Web3Context = createContext(null);

export function Web3Provider({ children }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  const hasEthereum =
    typeof window !== "undefined" && typeof window.ethereum !== "undefined";

  const refreshSigner = useCallback(async (eth) => {
    const browserProvider = new ethers.BrowserProvider(eth);
    const accounts = await browserProvider.listAccounts();
    const network = await browserProvider.getNetwork();
    setProvider(browserProvider);
    setChainId(Number(network.chainId));
    if (accounts.length > 0) {
      const s = await browserProvider.getSigner();
      setSigner(s);
      setAccount(await s.getAddress());
    } else {
      setSigner(null);
      setAccount(null);
    }
  }, []);

  const connect = useCallback(async () => {
    setError(null);
    if (!hasEthereum) {
      setError("MetaMask not detected. Please install MetaMask.");
      return;
    }
    try {
      setIsConnecting(true);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      await refreshSigner(window.ethereum);
    } catch (e) {
      setError(e?.message || "Failed to connect");
    } finally {
      setIsConnecting(false);
    }
  }, [hasEthereum, refreshSigner]);

  const disconnect = useCallback(() => {
    setSigner(null);
    setAccount(null);
  }, []);

  const switchNetwork = useCallback(async () => {
    if (!hasEthereum || !ACTIVE_NETWORK) return;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: ACTIVE_NETWORK.chainId }],
      });
    } catch (e) {
      if (e?.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [ACTIVE_NETWORK],
        });
      } else {
        setError(e?.message || "Failed to switch network");
      }
    }
  }, [hasEthereum]);

  useEffect(() => {
    if (!hasEthereum) return;
    const eth = window.ethereum;

    refreshSigner(eth).catch(() => {});

    const onAccountsChanged = () => refreshSigner(eth).catch(() => {});
    const onChainChanged = () => refreshSigner(eth).catch(() => {});

    eth.on?.("accountsChanged", onAccountsChanged);
    eth.on?.("chainChanged", onChainChanged);

    return () => {
      eth.removeListener?.("accountsChanged", onAccountsChanged);
      eth.removeListener?.("chainChanged", onChainChanged);
    };
  }, [hasEthereum, refreshSigner]);

  const value = useMemo(
    () => ({
      provider,
      signer,
      account,
      chainId,
      isConnected: Boolean(account),
      isCorrectNetwork: chainId === CHAIN_ID,
      isConnecting,
      error,
      hasEthereum,
      connect,
      disconnect,
      switchNetwork,
    }),
    [
      provider,
      signer,
      account,
      chainId,
      isConnecting,
      error,
      hasEthereum,
      connect,
      disconnect,
      switchNetwork,
    ]
  );

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

export function useWeb3() {
  const ctx = useContext(Web3Context);
  if (!ctx) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return ctx;
}
