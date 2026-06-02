import { supabase } from "../lib/supabase";
import type { NewSubscription } from "../types";

export async function addSubscription(data: NewSubscription) {
  const today = new Date();
  const endDate =
    data.plan === "monthly"
      ? new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
      : null;

  const { error } = await supabase.from("subscriptions").insert([
    {
      customer_id: data.customer_id,
      business_id: data.business_id,
      plan: data.plan,
      status: "active",
      washes_used: 0,
      washes_limit: data.washes_limit,
      start_date: today.toISOString(),
      end_date: endDate ? endDate.toISOString() : null,
    },
  ]);

  if (error) throw new Error(error.message);
}
