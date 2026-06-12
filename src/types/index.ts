export type Business = {
  id: string;
  name: string;
  created_at: string;
};

export type Customer = {
  id: string;
  business_id: string;
  name: string;
  phone: string;
  plate: string;
  created_at: string;
  expires_at: string | null;
  subscription_type: "monthly" | "per_wash";
  wash_count: number | null;
};

export type Subscription = {
  id: string;
  customer_id: string;
  business_id: string;
  plan: "monthly" | "per-wash" | "per_wash";
  status: "active" | "expired";
  washes_used: number;
  washes_limit: number | null;
  start_date: string;
  end_date: string | null;
};

export type WashLog = {
  id: string;
  business_id: string;
  customer_id: string;
  subscription_id: string;
  washed_at: string;
};
export type NewSubscription = {
  customer_id: string;
  business_id: string;
  plan: "monthly" | "per_wash";
  washes_limit: number | null;
};
export type FormData = {
  name: string;
  phone: string;
  plate: string;
  subscriptionType: "monthly" | "per_wash" | "";
  washCount: string;
  business_id: string;
};
