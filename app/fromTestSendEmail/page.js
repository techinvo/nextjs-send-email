"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';

export async function getData() {
    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/getEmail`);
        return res.data;
    } catch (error) {
        throw new Error('Failed to fetch data');
    }
}

export default function Page() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!process.env.NEXT_PUBLIC_API_URL) {
            setError('API URL is not set');
            setLoading(false);
            return;
        }

        getData()
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            {/* Render your data here */}
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}
