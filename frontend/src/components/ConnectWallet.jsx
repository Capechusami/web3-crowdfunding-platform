"use client";

import { useState } from "react";
import { useWeb3 } from "@/context/Web3Context";
import { shortAddress } from "@/utils/format";

export default function ConnectWallet() {
  const {
    account,
    chainId,
    isConnected,
    isConnecting,
    isCorrectNetwork,
    hasEthereum,
    connect,
    disconnect,
    switchNetwork,
    error,
  } = useWeb3();

  const [showDropdown, setShowDropdown] = useState(false);

  if (!hasEthereum) {
    return (
      <a
        href="https://metamask.io/download"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-sm font-medium text-white hover:shadow-lg hover:shadow-amber-500/25 transition-all"
      >
        <MetaMaskIcon />
        Install MetaMask
      </a>
    );
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-end gap-1">
        <button
          onClick={connect}
          disabled={isConnecting}
          className="inline-flex items-center gap-2 btn-primary text-sm px-4 py-2 disabled:opacity-50"
        >
          <MetaMaskIcon />
          {isConnecting ? "Connecting…" : "Connect Wallet"}
        </button>
        {error && (
          <p className="text-xs text-red-500 max-w-[220px] text-right">{error}</p>
        )}
      </div>
    );
  }

  if (!isCorrectNetwork) {
    return (
      <div className="flex flex-col items-end gap-1">
        <button
          onClick={switchNetwork}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 px-4 py-2 text-sm font-medium text-white hover:shadow-lg hover:shadow-red-500/25 transition-all"
        >
          <WarnIcon />
          Wrong Network — Switch
        </button>
        {error && (
          <p className="text-xs text-red-400 max-w-[220px] text-right">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:border-emerald-400 hover:bg-emerald-50 transition-all shadow-sm"
      >
        <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
        <span className="font-mono font-medium">{shortAddress(account)}</span>
        <ChevronIcon open={showDropdown} />
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-gray-100 shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Connected</p>
            <p className="font-mono text-xs text-gray-900 break-all mt-1">
              {account}
            </p>
          </div>
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Network</p>
            <p className="text-sm text-gray-900 mt-1">
              Chain ID <span className="font-mono font-medium">{chainId}</span>
            </p>
          </div>
          <button
            onClick={() => {
              disconnect();
              setShowDropdown(false);
            }}
            className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
          >
            Disconnect
          </button>
        </div>
      )}

      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
}

function MetaMaskIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
      <path d="M27.5 4L17.5 11.3L19.4 6.8L27.5 4Z" fill="#E17726" />
      <path d="M4.5 4L14.4 11.4L12.6 6.8L4.5 4Z" fill="#E27625" />
      <path d="M23.9 21.4L21.2 25.5L26.9 27.1L28.6 21.5L23.9 21.4Z" fill="#E27625" />
      <path d="M3.4 21.5L5.1 27.1L10.8 25.5L8.1 21.4L3.4 21.5Z" fill="#E27625" />
      <path d="M10.5 14.2L8.8 16.8L14.4 17L14.2 11L10.5 14.2Z" fill="#E27625" />
      <path d="M21.5 14.2L17.7 10.9L17.6 17L23.2 16.8L21.5 14.2Z" fill="#E27625" />
      <path d="M10.8 25.5L14.1 23.8L11.2 21.5L10.8 25.5Z" fill="#E27625" />
      <path d="M17.9 23.8L21.2 25.5L20.8 21.5L17.9 23.8Z" fill="#E27625" />
    </svg>
  );
}

function WarnIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className={`transition-transform ${open ? "rotate-180" : ""}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
