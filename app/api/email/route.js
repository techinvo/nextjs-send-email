import { readEmail,createEmail, deleteEmail } from '@/utils/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const result = await readEmail();
        return NextResponse.json(result);
    } catch (err) {
        return NextResponse.json({ err: true, data: err });
    }
}

export async function POST(req, res) {
    try {
        const { email, subject, message, sendAt, status, repeat } = await req.json();
        const result = await createEmail({ email, subject, message, sendAt, status, repeat })
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({error});
    }
}

export async function DELETE(req, res) {
    try {
        const { id } = await req.json();
        const result = await deleteEmail({id})
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({error});
    }
}