// This function will make the form submit to Supabase
import { supabase } from "../lib/supabase";
import type { Customer } from "../types";

type NewCustomer = Omit<Customer, "id" | "created_at">;

export async function addCustomer(customer: NewCustomer) {
  const { data, error } = await supabase
    .from("customers")
    .insert([customer])
    .select()
    .single();
  if (error) throw new Error(error.message);

  return data.id;
}
