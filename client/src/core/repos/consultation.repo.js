import { supabase } from "@/lib/supabaseServer";

export async function createConsultation({enquiry_id, mode}){
    console.log(enquiry_id);
    console.log(mode);
    const { data, error } = await supabase
      .from("consultations")
      .insert([{enquiry_id, mode}])
      .select()
      .single();
    
      if (error) throw error;
      return data;
}