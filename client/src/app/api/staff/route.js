import { NextResponse } from "next/server";
import * as ctrl from "@/core/controllers/staff.controller";

export async function GET(){
    try{
        // call contrller function that fetches staff data
        const staff = await ctrl.getStaffById();

        // Return successful JSON response
        return NextResponse.json({
            ok: true, // indicate success
            data: staff,  // send staff data back to frontend
        })
    } catch(err){
        return NextResponse.json(
            {
                ok: false, 
                error: err.message,
            },
            {status: 500}
        )
    }
}