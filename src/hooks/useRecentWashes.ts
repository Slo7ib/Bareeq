import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

export type RecentWash = {
  id: string;
  washed_at: string;
  customer_name: string;
  plate: string;
  plan: "monthly" | "per_wash" | null;
};

export function useRecentWashes(businessId: string) {
  const [washes, setWashes] = useState<RecentWash[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // silent = refetch in the background without showing the loading skeleton
  const fetchRecentWashes = useCallback(
    async (silent = false) => {
      try {
        if (!silent) setLoading(true);
        setError(null);
        const { data, error: fetchError } = await supabase
          .from("wash_logs")
          .select("id, washed_at, customers(name, plate, subscription_type)")
          .eq("business_id", businessId)
          .order("washed_at", { ascending: false })
          .limit(5);

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        if (data) {
          const formatted = data.map((item: any) => {
            const customer = Array.isArray(item.customers)
              ? item.customers[0]
              : item.customers;
            return {
              id: item.id,
              washed_at: item.washed_at,
              customer_name: customer?.name || "Unknown",
              plate: customer?.plate || "Unknown",
              plan: customer?.subscription_type ?? null,
            };
          });
          setWashes(formatted);
        } else {
          setWashes([]);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch recent washes");
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [businessId],
  );

  useEffect(() => {
    fetchRecentWashes();

    // Realtime payloads don't include joined customer data, so refetch on insert
    const channel = supabase
      .channel(`recent-washes-${businessId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "wash_logs",
          filter: `business_id=eq.${businessId}`,
        },
        () => fetchRecentWashes(true),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [businessId, fetchRecentWashes]);

  return { washes, loading, error, refetch: fetchRecentWashes };
}
