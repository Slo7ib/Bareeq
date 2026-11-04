import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Stats = {
  totalCustomers: number;
  activeSubs: number;
  todayWashes: number;
};

export function useDashboardStats(businessId: string) {
  const [stats, setStats] = useState<Stats>({
    totalCustomers: 0,
    activeSubs: 0,
    todayWashes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setError(null);
      // Local midnight, matching the 1-wash-per-day rule in logWash
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const [customersRes, subsRes, washesRes] = await Promise.all([
        supabase
          .from("customers")
          .select("*", { count: "exact", head: true })
          .eq("business_id", businessId),
        supabase
          .from("subscriptions")
          .select("*", { count: "exact", head: true })
          .eq("business_id", businessId)
          .eq("status", "active"),
        supabase
          .from("wash_logs")
          .select("*", { count: "exact", head: true })
          .eq("business_id", businessId)
          .gte("washed_at", todayStart.toISOString()),
      ]);

      const fetchError = customersRes.error || subsRes.error || washesRes.error;
      if (fetchError) throw new Error(fetchError.message);

      setStats({
        totalCustomers: customersRes.count ?? 0,
        activeSubs: subsRes.count ?? 0,
        todayWashes: washesRes.count ?? 0,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load dashboard stats",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    fetchStats();

    // A new wash can also expire a subscription, so refetch all counts
    const channel = supabase
      .channel(`dashboard-stats-${businessId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "wash_logs",
          filter: `business_id=eq.${businessId}`,
        },
        () => fetchStats(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [businessId, fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}
