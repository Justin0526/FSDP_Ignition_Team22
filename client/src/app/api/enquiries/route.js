export const runtime = "nodejs";

import {NextResponse} from "next/server";
import * as ctrl from "@/core/controllers/enquiries.controller";

export async function GET(){
    try{
        const rows = await ctrl.index();
        return NextResponse.json({ok: true, data:rows}, {status:200});
    }catch(error){
        console.error(error);
        return NextResponse.json({ok:false, error: "Server error"}, {status: 500});
    }
}