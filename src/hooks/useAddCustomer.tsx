// This function will make the form submit to Supabase
import { supabase } from "../lib/supabase";
import type { Customer } from "../types";

type NewCustomer = Omit<Customer, "id" | "created_at" >;

export async function addCustomer(data: NewCustomer) {
  const { error } = await supabase.from("customers").insert([data]);
  if (error) throw new Error(error.message);

  return true;
}
