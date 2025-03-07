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
  vendorId: string;
  ticketsReleased: number;
  lastRelease: string;
}

export interface CustomerStats {
  customerId: string;
  ticketsBought: number;
  lastPurchase: string;
}

export interface Transaction {
  ticketId: string;
  customerId: string;
  vendorId: string;
  timestamp: string;
}

export type SimulationStatus = 'idle' | 'running' | 'stopped';