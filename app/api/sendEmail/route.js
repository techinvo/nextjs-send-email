// pages/api/sendEmail.js
import { NextResponse } from "next/server"
import nodemailer from 'nodemailer';

export async function POST(req, res) {
    try {
        const { email, subject, message } = await req.json();
        console.log({email, subject, message} )
        // Configure the nodemailer transporter to use Gmail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.NEXT_PUBLIC_EMAIL_USER,
                pass: process.env.NEXT_PUBLIC_EMAIL_PASSWOED
            }
        });

        const mailOptions = {
            from: process.env.NEXT_PUBLIC_EMAIL_USER,
            to: email, // Use the email from the form
            subject,
            text: message
        };

        await transporter.sendMail(mailOptions);
        return NextResponse.json({ success: true });
    } catch (error) {
        //console.error(error);
        return NextResponse.json({ error: 'Failed to send email'+error });
    }
}
