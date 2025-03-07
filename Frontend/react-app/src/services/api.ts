import { Configuration, TicketPoolStatus, SimulationStatus } from '../types/types';

const API_BASE_URL = 'http://localhost:8081/api';
interface DetailedStatsResponse {
  totalSold: number;
  availableTickets: number;
  vendors: Array<{ vendorId: string; ticketsReleased: number }>;
  customers: Array<{ customerId: string; ticketsBought: number }>;
  recentTransactions: Array<{
      ticketId: string;
      customerId: string;
      vendorId: string;
      timestamp: string;
  }>;
  logs?: string[];
}
export async function startSimulation(config: Configuration): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/simulation/start`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
    });
    
    if (!response.ok) {
        throw new Error(`Failed to start simulation: ${response.statusText}`);
    }
}

export async function stopSimulation(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/simulation/stop`, {
        method: 'POST',
    });
    
    if (!response.ok) {
        throw new Error(`Failed to stop simulation: ${response.statusText}`);
    }
}

export async function resetSimulation(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/simulation/reset`, {
        method: 'POST',
    });
    
    if (!response.ok) {
        throw new Error(`Failed to reset simulation: ${response.statusText}`);
    }
}

export async function fetchSimulationStatus(): Promise<SimulationStatus> {
    const response = await fetch(`${API_BASE_URL}/simulation/status`);
    if (!response.ok) {
        throw new Error(`Failed to fetch simulation status: ${response.statusText}`);
    }
    const data = await response.json();
    return data.status.toLowerCase() as SimulationStatus;
}

export async function fetchTicketPoolStatus(): Promise<TicketPoolStatus> {
    const response = await fetch(`${API_BASE_URL}/tickets/status`);
    if (!response.ok) {
        throw new Error(`Failed to fetch ticket pool status: ${response.statusText}`);
    }
    const data = await response.json();
    return {
        available: parseInt(data.available) || 0,
        sold: parseInt(data.sold) || 0
    };
}

export async function getDetailedStats(): Promise<DetailedStatsResponse> {
  try {
      const response = await fetch(`${API_BASE_URL}/simulation/detailed-stats`);
      if (!response.ok) {
          throw new Error('Failed to fetch detailed stats');
      }
      const data = await response.json();
      return {
          totalSold: data.totalSold || 0,
          availableTickets: data.availableTickets || 0,
          vendors: data.vendors || [],
          customers: data.customers || [],
          recentTransactions: data.recentTransactions || [],
          logs: data.logs || []
      };
  } catch (error) {
      console.error('Error fetching detailed stats:', error);
      throw error;
  }
}