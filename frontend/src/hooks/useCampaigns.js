"use client";

import { useCallback, useEffect, useState } from "react";
import { useContract } from "./useContract";
import { getCampaignMetadata } from "@/utils/campaignStorage";

/**
 * Fetches all campaigns from the contract.
 * Returns { campaigns, loading, error, refetch }
 */
export function useCampaigns(refreshKey) {
  const contract = useContract();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!contract) return;
    setLoading(true);
    setError(null);
    try {
      const count = await contract.campaignCount();
      const total = Number(count);
      const results = await Promise.all(
        Array.from({ length: total }, (_, i) => contract.getCampaign(i))
      );
      setCampaigns(
        results.map((c, i) => {
          const meta = getCampaignMetadata(i) || {};
          return {
            id: i,
            creator: c.creator,
            goal: c.goal,
            deadline: c.deadline,
            totalRaised: c.totalRaised,
            withdrawn: c.withdrawn,
            title: meta.title || null,
            description: meta.description || null,
            image: meta.image || null,
          };
        })
      );
    } catch (e) {
      setError(e?.message || "Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  }, [contract]);

  useEffect(() => {
    fetch();
  }, [fetch, refreshKey]);

  return { campaigns, loading, error, refetch: fetch };
}

/**
 * Fetches a single campaign by id.
 * Returns { campaign, loading, error, refetch }
 */
export function useCampaign(id) {
  const contract = useContract();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!contract || id === undefined || id === null) return;
    setLoading(true);
    setError(null);
    try {
      const c = await contract.getCampaign(id);
      const meta = getCampaignMetadata(Number(id)) || {};
      setCampaign({
        id: Number(id),
        creator: c.creator,
        goal: c.goal,
        deadline: c.deadline,
        totalRaised: c.totalRaised,
        withdrawn: c.withdrawn,
        title: meta.title || null,
        description: meta.description || null,
        image: meta.image || null,
      });
    } catch (e) {
      setError(e?.message || "Campaign not found");
    } finally {
      setLoading(false);
    }
  }, [contract, id]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { campaign, loading, error, refetch: fetch };
}

/**
 * Returns a contributor's contribution to a specific campaign.
 * Returns { contribution, loading, error, refetch }
 */
export function useContribution(campaignId, address) {
  const contract = useContract();
  const [contribution, setContribution] = useState(0n);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!contract || campaignId === undefined || !address) return;
    setLoading(true);
    setError(null);
    try {
      const amount = await contract.getContribution(campaignId, address);
      setContribution(amount);
    } catch (e) {
      setError(e?.message || "Failed to load contribution");
    } finally {
      setLoading(false);
    }
  }, [contract, campaignId, address]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { contribution, loading, error, refetch: fetch };
}
