import {supabase} from "../lib/supabase.js";

export async function getAllCustomers(){
    try{
        const {data, error} = await supabase
          .from("customers")
          .select("*");

        if (error){
            console.error("Database error: ", error.message);
            throw error;
        }
        return data;
    }catch(error){
        console.error("Unexpected error:", error);
        throw error;
    }
}

