// TicketPoolDisplay.tsx
import React from 'react';


interface TicketPoolDisplayProps {
    available: number;
    sold: number;
    total: number;
}

const TicketPoolDisplay: React.FC<TicketPoolDisplayProps> = ({ available, sold, total }) => {
    const soldPercentage = (sold / total) * 100;
    const availablePercentage = (available / total) * 100;

    return (
        <div className="ticket-pool-display">
            <h2>Ticket Pool Status</h2>
            <div className="status-grid">
                <div className="status-item">
                    <h3>Available Tickets</h3>
                    <div className="status-value">
                        <span className="number">{available}</span>
                        <div className="progress-bar">
                            <div 
                                className="progress-fill available" 
                                style={{ width: `${availablePercentage}%` }}
                            />
                        </div>
                    </div>
                </div>
                <div className="status-item">
                    <h3>Sold Tickets</h3>
                    <div className="status-value">
                        <span className="number">{sold}</span>
                        <div className="progress-bar">
                            <div 
                                className="progress-fill sold" 
                                style={{ width: `${soldPercentage}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="total-tickets">
                Total Tickets: {total}
            </div>
        </div>
    );
};

export default TicketPoolDisplay;