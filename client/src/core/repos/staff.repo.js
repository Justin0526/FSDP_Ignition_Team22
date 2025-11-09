import { supabase } from "@/lib/supabaseServer";

export async function getStaffById(staffId){
    const {data, error} = await supabase
      .from("staff")
      .select("*")
      .eq("staff_id", staffId) // equal to
      .single();  // returns an object, not a list that contains object

      if (error) throw error;

      return data;
}