import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Customer } from "../types";

export function useCustomers(businessId: string) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return { customers, loading, error };
}
