export interface Configuration {
    totalTickets: number;
    numberOfVendors: number;
    numberOfCustomers: number;
    maxTicketsPerCustomer: number;
    ticketReleaseRate: number;
    customerRetrievalRate: number;
    maxTicketCapacity: number;
  }
  
  export interface TicketPoolStatus {
    available: number;
    sold: number;
  }
  
  export interface VendorStats {
    vendorId: string;  // Changed from id to vendorId to match backend
    ticketsReleased: number;
    lastRelease?: Date;
}
  
  export interface CustomerStats {
    customerId: string;  
    ticketsBought: number;
  }
  export * from './types';
  
  export type SimulationStatus = 'idle' | 'running' | 'stopped';