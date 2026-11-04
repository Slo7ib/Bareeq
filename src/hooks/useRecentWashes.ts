import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import type { Customer } from "../types";

export type RecentWash = {
  id: string;
  washed_at: string;
  customer_name: string;
  plate: string;
  plan: "monthly" | "per_wash" | null;
};

type CustomerSummary = Pick<Customer, "id" | "name" | "plate" | "subscription_type">;

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
        // Two plain queries instead of an embedded join: wash_logs has no
        // foreign key to customers, so PostgREST can't resolve customers(...)
        const { data: logs, error: logsError } = await supabase
          .from("wash_logs")
          .select("id, washed_at, customer_id")
          .eq("business_id", businessId)
          .order("washed_at", { ascending: false })
          .limit(5);

        if (logsError) throw new Error(logsError.message);
        if (!logs || logs.length === 0) {
          setWashes([]);
          return;
        }

        const customerIds = [...new Set(logs.map((log) => log.customer_id))];
        const { data: customers, error: customersError } = await supabase
          .from("customers")
          .select("id, name, plate, subscription_type")
          .in("id", customerIds);

        if (customersError) throw new Error(customersError.message);

        const customersById = new Map<string, CustomerSummary>(
          (customers ?? []).map((c: CustomerSummary) => [c.id, c]),
        );

        setWashes(
          logs.map((log) => {
            const customer = customersById.get(log.customer_id);
            return {
              id: log.id,
              washed_at: log.washed_at,
              customer_name: customer?.name || "Unknown",
              plate: customer?.plate || "Unknown",
              plan: customer?.subscription_type ?? null,
            };
          }),
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch recent washes",
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [businessId],
  );

  useEffect(() => {
    fetchRecentWashes();

    // Realtime payloads only contain the wash_logs row, so refetch to get customer details
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
