import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import type { Subscription } from "../types";

export function useSubscriptions(businessId: string) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  useEffect(() => {
    const fetchingSubscriptions = async () => {
      try {
        const { data, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("business_id", businessId);
        if (error) throw new Error(error.message);
        setSubscriptions(data ?? []);
      } catch (err) {
        console.error("Failed to get subscriptions" + err);
      }
    };

    fetchingSubscriptions();
  }, [businessId]);

  return subscriptions;
}
