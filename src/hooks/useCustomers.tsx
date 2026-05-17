import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Customer } from "../types";

export function useCustomers(businessId: string) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🎯 YOUR TASK: write the useEffect here

  useEffect(() => {
    const fetchingCustomer = async () => {
      try {
        const { data, error } = await supabase
          .from("customers")
          .select("*")
          .eq("business_id", businessId);

        if (error) {
          setError(error.message);
        } else {
          setCustomers(data ?? []);
        }
      } catch (err) {
        setError("App crashed" + err);
      } finally {
        setLoading(false);
      }
    };
    fetchingCustomer();
  }, [businessId]);

  // 1. Call supabase.from('customers').select('*').eq('business_id', businessId)
  // 2. If error → setError(error.message)
  // 3. If data → setCustomers(data)
  // 4. Always → setLoading(false)

  return { customers, loading, error };
}
