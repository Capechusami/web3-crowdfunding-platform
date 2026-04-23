import { ethers } from "ethers";

export function formatEth(wei, digits = 4) {
  if (wei === undefined || wei === null) return "0";
  const s = ethers.formatEther(wei);
  const [w, f = ""] = s.split(".");
  return digits > 0 ? `${w}.${f.slice(0, digits).padEnd(digits, "0")}` : w;
}

export function parseEth(value) {
  return ethers.parseEther(String(value));
}

export function shortAddress(addr, chars = 4) {
  if (!addr) return "";
  return `${addr.slice(0, 2 + chars)}...${addr.slice(-chars)}`;
}

export function formatDeadline(deadlineSeconds) {
  const ms = Number(deadlineSeconds) * 1000;
  return new Date(ms).toLocaleString();
}

export function timeLeft(deadlineSeconds) {
  const now = Math.floor(Date.now() / 1000);
  const diff = Number(deadlineSeconds) - now;
  if (diff <= 0) return "Ended";
  const d = Math.floor(diff / 86400);
  const h = Math.floor((diff % 86400) / 3600);
  const m = Math.floor((diff % 3600) / 60);
  if (d > 0) return `${d}d ${h}h left`;
  if (h > 0) return `${h}h ${m}m left`;
  return `${m}m left`;
}

export function progressPercent(raised, goal) {
  if (!goal || goal === 0n) return 0;
  const pct = (Number(raised) / Number(goal)) * 100;
  return Math.min(100, Math.max(0, pct));
}
