'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Table from '@/app/components/tableEmail';

export default function EmailForm() {
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [sendAt, setSendAt] = useState('');
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [emails, setEmails] = useState([]);
    const [isFetching, setIsFetching] = useState(true);
    const [shouldPoll, setShouldPoll] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/email`, {
                email,
                subject,
                message,
                sendAt: new Date(sendAt),
                status: 'pending',
                repeat: false,
            });
            if (res.status === 200) {
                setStatus('Email sent successfully');
                fetchEmails();
            } else {
                setStatus('Failed to send email');
            }
        } catch (error) {
            setStatus('Error sending email');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/email`, {
                data: { id },
            });
            if (res.status === 200) {
                setStatus('Email deleted successfully');
                fetchEmails();
            } else {
                setStatus('Failed to delete email');
            }
        } catch (error) {
            console.error('Error deleting email:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEmails = async () => {
        setIsFetching(true);
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/email`);
            setEmails(res.data);
        } catch (error) {
            console.error('Error fetching emails:', error);
        } finally {
            setIsFetching(false);
        }
    };

    const sendEmails = async () => {
        setIsFetching(true);
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/email/upstatus`);
            if (data.length === 0) {
                setShouldPoll(false);
                return;
            }
            for (const email of data) {
                const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/sendEmail`, {
                    id: email.id,
                    email: email.email,
                    subject: email.subject,
                    message: email.message,
                    sendAt: email.sendAt,
                });
                if (res.status === 200 && res.data.success) {
                    console.log(`Email sent successfully to ${email.email}`);
                    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/email/upstatus`, {
                        id: email.id,
                        status: 'waiting',
                    });
                } else {
                    console.log(`Failed to send email to ${email.email}`);
                    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/email/upstatus`, {
                        id: email.id,
                        status: 'failed',
                    });
                }
            }
            fetchEmails();
        } catch (error) {
            console.error('Error fetching or sending emails:', error);
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        fetchEmails();
        const interval = setInterval(() => {
            if (shouldPoll) {
                sendEmails();
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [shouldPoll]);

    return (
        <div className="max-w-3xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Send Email</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject:</label>
                    <input
                        type="text"
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message:</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <div>
                    <label htmlFor="sendAt" className="block text-sm font-medium text-gray-700">Send At:</label>
                    <input
                        type="datetime-local"
                        id="sendAt"
                        value={sendAt}
                        onChange={(e) => setSendAt(e.target.value)}
                        required
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow-sm hover:bg-blue-600"
                >
                    {loading ? 'Sending...' : 'Send Email'}
                </button>
            </form>
            {status && <p className="mt-4 text-sm text-gray-600">{status}</p>}

            <div className="mt-8">
                <h1 className="text-2xl font-bold mb-4">Emails</h1>
                {isFetching ? (
                    <p>Loading...</p>
                ) : emails.length > 0 ? (
                    <Table data={emails} callbackdelete={handleDelete} />
                ) : (
                    <p>No emails found.</p>
                )}
            </div>
        </div>
    );
}
