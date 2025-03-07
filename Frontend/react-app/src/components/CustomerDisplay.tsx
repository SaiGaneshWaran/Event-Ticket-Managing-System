import React from 'react';
import { CustomerStats } from '../types';

interface CustomerDisplayProps {
  customers: CustomerStats[];
}

const CustomerDisplay: React.FC<CustomerDisplayProps> = ({ customers }) => {
  return (
    <div>
      <h2>Customers</h2>
      <ul>
        {customers.map(customer => (
          <li key={customer.customerId}>
            {customer.customerId}: {customer.ticketsBought} tickets bought
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerDisplay;