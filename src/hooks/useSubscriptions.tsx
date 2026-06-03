import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import type { Subscription } from "../types";

export function useSubscriptions(businessId: string) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscriptions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("business_id", businessId);

      if (fetchError) throw new Error(fetchError.message);

      setSubscriptions(data ?? []);
    } catch (err: any) {
      setError(err.message || "Failed to get subscriptions");
      console.error("Failed to get subscriptions", err);
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  return {
    subscriptions,
    loading,
    error,
    refetchSubscriptions: fetchSubscriptions,
  };
}

