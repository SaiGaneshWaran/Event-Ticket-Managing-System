import React, { useState } from 'react';
import { Configuration } from '../types/types';


interface ConfigurationFormProps {
    onSubmit: (config: Configuration) => void;
}

const ConfigurationForm: React.FC<ConfigurationFormProps> = ({ onSubmit }) => {
    const [config, setConfig] = useState<Configuration>({
        totalTickets: 100,
        numberOfVendors: 5,
        numberOfCustomers: 10,
        maxTicketsPerCustomer: 10,
        ticketReleaseRate: 1000,
        customerRetrievalRate: 1500,
        maxTicketCapacity: 50
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [warnings, setWarnings] = useState<Record<string, string>>({});

    const validateConfig = (): boolean => {
        const newErrors: Record<string, string> = {};
        const newWarnings: Record<string, string> = {};

        // Basic validations
        if (config.totalTickets <= 0) newErrors.totalTickets = 'Total tickets must be positive';
        if (config.numberOfVendors <= 0) newErrors.numberOfVendors = 'Number of vendors must be positive';
        if (config.numberOfCustomers <= 0) newErrors.numberOfCustomers = 'Number of customers must be positive';
        if (config.ticketReleaseRate < 100) newErrors.ticketReleaseRate = 'Release rate must be at least 100ms';
        if (config.customerRetrievalRate < 100) newErrors.customerRetrievalRate = 'Retrieval rate must be at least 100ms';
        
        // Complex validations
        if (config.maxTicketCapacity > config.totalTickets) {
            newErrors.maxTicketCapacity = 'Max capacity cannot exceed total tickets';
        }

        const totalPossiblePurchases = config.maxTicketsPerCustomer * config.numberOfCustomers;
        if (totalPossiblePurchases < config.totalTickets) {
            newWarnings.maxTicketsPerCustomer = 
                `Total possible purchases (${totalPossiblePurchases}) is less than total tickets (${config.totalTickets})`;
        }

        setErrors(newErrors);
        setWarnings(newWarnings);

        if (Object.keys(newErrors).length > 0) return false;
        
        if (Object.keys(newWarnings).length > 0) {
            return window.confirm('There are warnings. Do you want to proceed anyway?');
        }

        return true;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateConfig()) {
            onSubmit(config);
        }
    };

    const handleInputChange = (field: keyof Configuration, value: string) => {
        const numValue = parseInt(value) || 0;
        setConfig(prev => ({ ...prev, [field]: numValue }));
    };

    return (
        <form onSubmit={handleSubmit} className="configuration-form">
            <h2>Ticket Management System Configuration</h2>
            
            {[
                { field: 'totalTickets', label: 'Total Tickets', min: 1 },
                { field: 'numberOfVendors', label: 'Number of Vendors', min: 1 },
                { field: 'numberOfCustomers', label: 'Number of Customers', min: 1 },
                { field: 'maxTicketsPerCustomer', label: 'Max Tickets Per Customer', min: 1 },
                { field: 'ticketReleaseRate', label: 'Ticket Release Rate (ms)', min: 100 },
                { field: 'customerRetrievalRate', label: 'Customer Retrieval Rate (ms)', min: 100 },
                { field: 'maxTicketCapacity', label: 'Max Ticket Capacity', min: 1 }
            ].map(({ field, label, min }) => (
                <div key={field} className="form-group">
                    <label htmlFor={field}>{label}:</label>
                    <input
                        id={field}
                        type="number"
                        value={config[field as keyof Configuration]}
                        onChange={(e) => handleInputChange(field as keyof Configuration, e.target.value)}
                        className={errors[field] ? 'error' : warnings[field] ? 'warning' : ''}
                        min={min}
                        required
                    />
                    {errors[field] && <div className="error-message">{errors[field]}</div>}
                    {warnings[field] && <div className="warning-message">{warnings[field]}</div>}
                </div>
            ))}

            <button type="submit" className="submit-button">Start Simulation</button>
        </form>
    );
};

export default ConfigurationForm;