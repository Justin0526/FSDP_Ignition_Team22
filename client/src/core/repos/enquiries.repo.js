import { supabase } from "@/lib/supabaseServer";

export async function list(){
    const {data, error} = await supabase
      .from("enquiries")
      .select("*")
    
    if (error) throw error;

    return data;
}