// ============================================
// enquiries.repo.js
// --------------------------------------------
// The repository (repo) layer interacts directly with the database.
//
// Its main responsibilities:
// - Execute Supabase queries (select, insert, update, delete)
// - Throw errors if database operations fail
// - Return raw database results (no business logic)
//
// If you ever change your database (Supabase → PostgreSQL, MongoDB, etc.),
// only this layer needs to be updated.
// ============================================
import { supabase } from "@/lib/supabaseServer";

export async function list(){
    const {data, error} = await supabase
      .from("enquiries")
      .select("*")
    
    if (error) throw error;

    return data;
}

export async function getAllCategories(){
    const {data, error} = await supabase
      .from("enquiry_categories")
      .select("*")

    if (error) throw error;
    return data;
}

export async function createEnquiry({ customer_id, category_id, description }) {
  const { data, error } = await supabase
    .from("enquiries")
    .insert([{ customer_id, category_id, description }])
    .select()
    .single();

  if (error) throw error; // This bubbles to controller where it’s wrapped
  return data;
}