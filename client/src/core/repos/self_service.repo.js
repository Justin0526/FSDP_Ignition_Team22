import { supabase } from "@/lib/supabaseServer";

export async function getSelfServiceByCategory(categoryId){
    const {data, error} = await supabase
        .from("self_service_options")
        .select("*")
        .eq("category_id", categoryId)

        if (error) throw error;

        return data;
}