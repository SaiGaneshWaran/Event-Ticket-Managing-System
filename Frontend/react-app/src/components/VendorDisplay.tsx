import React from 'react';
import { VendorStats } from '../types';

interface VendorDisplayProps {
  vendors: VendorStats[];
}

const VendorDisplay: React.FC<VendorDisplayProps> = ({ vendors }) => {
  return (
    <div>
      <h2>Vendors</h2>
      <ul>
        {vendors.map(vendor => (
          <li key={vendor.vendorId}>
            {vendor.vendorId}: {vendor.ticketsReleased} tickets released
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VendorDisplay;