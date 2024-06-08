// components/Table.js
import React from 'react';
import styles from '@/app/css/Table.module.css';

const Table = ({ data, callbackdelete = () => {} }) => {
    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Send At</th>
                    <th>Status</th>
                    <th>Repeat</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
                {data.map((email) => (
                    <tr key={email.id}>
                        <td>{email.id}</td>
                        <td>{email.email}</td>
                        <td>{email.subject}</td>
                        <td>{email.message}</td>
                        <td>{new Date(email.sendAt).toLocaleString()}</td>
                        <td>{email.status}</td>
                        <td>{email.repeat ? 'Yes' : 'No'}</td>
                        <td><button onClick={() => callbackdelete(email.id)}>ลบ</button></td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Table;
