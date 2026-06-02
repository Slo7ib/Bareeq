import { useEffect, useState } from "react";
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

  useEffect(() => {
    async function fetchStats() {
      const today = new Date().toISOString().split("T")[0];

      const [
        { count: totalCustomers },
        { count: activeSubs },
        { count: todayWashes },
      ] = await Promise.all([
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
          .gte("washed_at", today),
      ]);

      setStats({
        totalCustomers: totalCustomers ?? 0,
        activeSubs: activeSubs ?? 0,
        todayWashes: todayWashes ?? 0,
      });
      setLoading(false);
    }
    fetchStats();
  }, [businessId]);

  return { stats, loading };
}
