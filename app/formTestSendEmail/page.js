"use client"

import { useState } from 'react';

export default function EmailForm() {
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);
        console.log(email, subject, message);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sendEmail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, subject, message })
            });

            if (response.ok) {
                setStatus('Email sent successfully!');
            } else {
                setStatus('Failed to send email.');
            }
        } catch (error) {
            setStatus('An error occurred while sending the email.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Send Email</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="subject">Subject:</label>
                    <input
                        type="text"
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="message">Message:</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Email'}
                </button>
            </form>
            {status && <p>{status}</p>}
        </div>
    );
}
