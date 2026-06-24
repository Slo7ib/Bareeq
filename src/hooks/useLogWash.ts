import { supabase } from "../lib/supabase";
import type { Subscription } from "../types";

export async function logWash(subscription: Subscription, businessId: string) {
  // 1 wash per day rule — check before doing anything
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { data: todayWashes, error: checkError } = await supabase
    .from("wash_logs")
    .select("id")
    .eq("customer_id", subscription.customer_id)
    .gte("washed_at", todayStart.toISOString())
    .limit(1);

  if (checkError) throw new Error(checkError.message);

  if (todayWashes && todayWashes.length > 0) {
    throw new Error("ALREADY_WASHED_TODAY");
  }

  // Proceed normally if no wash found today
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