import { supabase } from "../lib/supabase";
import type { Subscription } from "../types";

export async function logWash(subscription: Subscription, businessId: string) {
  const { error } = await supabase.from("wash_logs").insert([
    {
      customer_id: subscription.customer_id,
      business_id: businessId,
      subscription_id: subscription.id,
    },
  ]);

  if (error) throw new Error(error.message);

  const newCount = subscription.washes_used + 1;
  const isExpired =
    subscription.washes_limit != null && newCount >= subscription.washes_limit;

  const { error: subError } = await supabase
    .from("subscriptions")
    .update({
      washes_used: newCount,
      ...(isExpired && { status: "expired" }),
    })
    .eq("id", subscription.id);

  if (subError) throw new Error(subError.message);

  if (isExpired) {
    const { error: thirdError } = await supabase
      .from("customers")
      .update({
        expires_at: new Date().toISOString(),
      })
      .eq("id", subscription.customer_id);
    if (thirdError) throw new Error(thirdError.message);
  }
}
