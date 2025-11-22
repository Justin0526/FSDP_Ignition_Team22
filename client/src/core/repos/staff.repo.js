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

// Get active staff by email (for login)
export async function getActiveStaffByEmail(email) {
  const { data, error } = await supabase
    .from("staff")
    .select("*")
    .eq("email", email)
    .eq("is_active", true)
    .single();
  if (error) throw error;
  return data;
}