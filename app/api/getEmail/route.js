import { NextResponse } from "next/server";

export async function GET(request) {
    return NextResponse.json({email:'test@.com',subject:'testsubject',message:'testMessage'})
}