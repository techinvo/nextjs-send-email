import { readEmailByPending, updateStatusEmail } from "@/utils/db";
import { NextResponse } from 'next/server';
export async function POST(req, res) {
    try {
        const { id,status} = await req.json();
        const result = await updateStatusEmail({ id, status})
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({error});
    }
}

export async function GET() {
    try {
        const result = await readEmailByPending();
        return NextResponse.json(result);
    } catch (err) {
        return NextResponse.json({ err: true, data: err });
    }
}