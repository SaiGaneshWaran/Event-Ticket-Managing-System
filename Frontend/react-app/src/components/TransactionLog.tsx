// TransactionLog.tsx
import React, { useEffect, useRef } from 'react';


interface Transaction {
    ticketId: string;
    customerId: string;
    vendorId: string;
    timestamp: string;
}

interface TransactionLogProps {
    transactions: Transaction[];
}

const TransactionLog: React.FC<TransactionLogProps> = ({ transactions }) => {
    const logRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [transactions]);

    return (
        <div className="transaction-log">
            <h2>Recent Transactions</h2>
            <div className="log-content" ref={logRef}>
                {transactions.map((tx, index) => (
                    <div 
                        key={`${tx.ticketId}-${tx.timestamp}-${index}`} 
                        className="transaction-item"
                    >
                        <span className="timestamp">
                            {new Date(tx.timestamp).toLocaleTimeString()}
                        </span>
                        <span className="ticket-info">
                            Ticket {tx.ticketId} 
                        </span>
                        <span className="transaction-details">
                            sold to Customer {tx.customerId} by Vendor {tx.vendorId}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TransactionLog;