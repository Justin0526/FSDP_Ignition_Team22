// src/repo/customer.repo.js
import { supabase } from "@/lib/supabaseServer";

export async function findCustomerAndCards(phoneDigits, last4) {

  const { data, error } = await supabase
    .from("customers")
    .select(`
      customer_id,
      full_name,
      mobile_number,
      cards!inner (
        card_id,
        card_last4,
        network,
        status
      )
    `)
    .eq("mobile_number", phoneDigits)
    .eq("cards.card_last4", last4)
    .maybeSingle(); 

  if (error) throw new Error("DB_QUERY_FAILED");
  return data || null;
}
