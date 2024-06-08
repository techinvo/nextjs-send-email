// pages/api/sendEmail.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { scheduleJob } from "node-schedule";
import axios from 'axios';

export async function POST(req) {
    try {
        const { id, email, subject, message, sendAt } = await req.json();
        const sendTime = new Date(sendAt);

        // if (isNaN(sendTime)) {
        //     return NextResponse.json({ error: 'Invalid date format for sendAt' });
        // }

        scheduleJob(sendTime, async function() {
            try {
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.NEXT_PUBLIC_EMAIL_USER,
                        pass: process.env.NEXT_PUBLIC_EMAIL_PASSWOED,
                    },
                });

                const mailOptions = {
                    from: process.env.NEXT_PUBLIC_EMAIL_USER,
                    to: email,
                    subject,
                    text: message,
                };

                await transporter.sendMail(mailOptions);
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/email/upstatus`, {
                    id,
                    status: 'complete',
                });
                console.log(`Email sent successfully to ${email}`);
            } catch (error) {
                console.error(`Failed to send email to ${email}:`, error);
                await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/email/upstatus`, {
                    id,
                    status: 'failed',
                });
            }
        });

        return NextResponse.json({ success: true, message: `Email scheduled to be sent at ${sendAt}` });
    } catch (error) {
        console.error('Failed to schedule email:', error);
        return NextResponse.json({ error: 'Failed to schedule email: ' + error.message });
    }
}
