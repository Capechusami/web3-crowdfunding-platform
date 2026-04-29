"use client";

const STORAGE_KEY = "fundchain_campaign_metadata";

function loadAll() {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveAll(data) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function saveCampaignMetadata(id, { title, description, image }) {
  const all = loadAll();
  all[id] = { title, description, image: image || null, createdAt: Date.now() };
  saveAll(all);
}

export function getCampaignMetadata(id) {
  const all = loadAll();
  return all[id] || null;
}
