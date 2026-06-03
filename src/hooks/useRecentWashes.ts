import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

export type RecentWash = {
  id: string;
  washed_at: string;
  customer_name: string;
  plate: string;
};

export function useRecentWashes(businessId: string) {
  const [washes, setWashes] = useState<RecentWash[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentWashes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from("wash_logs")
        .select("id, washed_at, customers(name, plate)")
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
  }, [businessId]);

  useEffect(() => {
    fetchRecentWashes();
  }, [fetchRecentWashes]);

  return { washes, loading, error };
}
