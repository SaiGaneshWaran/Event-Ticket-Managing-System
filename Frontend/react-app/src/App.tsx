import React, { useState, useEffect, useCallback } from 'react';
import ConfigurationForm from './components/ConfigurationForm';
import SimulationControls from './components/SimulationControls';
import TicketPoolDisplay from './components/TicketPoolDisplay';
import { Configuration, SimulationStatus } from './types/types';
import * as api from './services/api';
import './App.css';

interface VendorStat {
    vendorId: string;
    ticketsReleased: number;
}

interface CustomerStat {
    customerId: string;
    ticketsBought: number;
}

interface Transaction {
    ticketId: string;
    customerId: string;
    vendorId: string;
    timestamp: string;
}

interface DetailedStats {
    totalSold: number;
    vendors: VendorStat[];
    customers: CustomerStat[];
    recentTransactions: Transaction[];
}

const App: React.FC = () => {
    const [config, setConfig] = useState<Configuration | null>(null);
    const [simulationStatus, setSimulationStatus] = useState<SimulationStatus>('idle');
    const [ticketPool, setTicketPool] = useState({ available: 0, sold: 0, total: 0 });
    const [detailedStats, setDetailedStats] = useState<DetailedStats>({
        totalSold: 0,
        vendors: [],
        customers: [],
        recentTransactions: []
    });
    const [logs, setLogs] = useState<string[]>([]);

    const fetchSimulationData = useCallback(async () => {
        if (!config) return;
        
        try {
            const [poolStatus, stats] = await Promise.all([
                api.fetchTicketPoolStatus(),
                api.getDetailedStats()
            ]);

            setTicketPool({
                available: poolStatus.available,
                sold: poolStatus.sold,
                total: config.totalTickets
            });

            // Create a Map to track the latest transaction for each ticket
            const uniqueTransactions = new Map();
            
            // Only keep the latest transaction for each ticket
            stats.recentTransactions.forEach(tx => {
                const ticketId = tx.ticketId.split('-').pop() || tx.ticketId;
                uniqueTransactions.set(ticketId, {
                    ticketId: ticketId,
                    customerId: tx.customerId.split('-').pop() || tx.customerId,
                    vendorId: tx.vendorId.replace(/^Vendor/, ''),
                    timestamp: tx.timestamp
                });
            });

            setDetailedStats({
                totalSold: stats.totalSold,
                vendors: stats.vendors.map(vendor => ({
                    vendorId: vendor.vendorId.replace(/^Vendor/, ''),
                    ticketsReleased: vendor.ticketsReleased
                })),
                customers: stats.customers,
                recentTransactions: Array.from(uniqueTransactions.values())
            });

            const timestamp = new Date().toLocaleTimeString();
            setLogs(prev => [...prev, `[${timestamp}] Status updated`]);
        } catch (error) {
            console.error('Error fetching simulation data:', error);
            const timestamp = new Date().toLocaleTimeString();
            setLogs(prev => [...prev, `[${timestamp}] Error: ${error instanceof Error ? error.message : String(error)}`]);
        }
    }, [config]);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        
        if (simulationStatus === 'running') {
            fetchSimulationData();
            intervalId = setInterval(fetchSimulationData, 1000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [simulationStatus, fetchSimulationData]);

    // Rest of the handler functions remain the same
    const handleConfigSubmit = async (newConfig: Configuration) => {
        try {
            await api.startSimulation(newConfig);
            setConfig(newConfig);
            setSimulationStatus('running');
            setLogs(['Simulation configured and started']);
        } catch (error) {
            console.error('Error starting simulation:', error);
            setLogs([`Error: ${error instanceof Error ? error.message : String(error)}`]);
        }
    };

    const handleSimulationStart = async () => {
        if (config) {
            try {
                await api.startSimulation(config);
                setSimulationStatus('running');
                setLogs(prev => [...prev, 'Simulation restarted']);
            } catch (error) {
                console.error('Error starting simulation:', error);
                setLogs(prev => [...prev, `Error: ${error instanceof Error ? error.message : String(error)}`]);
            }
        }
    };

    const handleSimulationStop = async () => {
        try {
            await api.stopSimulation();
            setSimulationStatus('stopped');
            setLogs(prev => [...prev, 'Simulation stopped']);
        } catch (error) {
            console.error('Error stopping simulation:', error);
            setLogs(prev => [...prev, `Error: ${error instanceof Error ? error.message : String(error)}`]);
        }
    };

    const handleSimulationReset = async () => {
        try {
            await api.resetSimulation();
            setConfig(null);
            setSimulationStatus('idle');
            setTicketPool({ available: 0, sold: 0, total: 0 });
            setDetailedStats({
                totalSold: 0,
                vendors: [],
                customers: [],
                recentTransactions: []
            });
            setLogs(['System reset']);
        } catch (error) {
            console.error('Error resetting simulation:', error);
            setLogs([`Error: ${error instanceof Error ? error.message : String(error)}`]);
        }
    };

    return (
        <div className="app-container">
            <header>
                <h1>Real-Time Event Ticketing System</h1>
            </header>
            <main>
                {!config ? (
                    <ConfigurationForm onSubmit={handleConfigSubmit} />
                ) : (
                    <>
                        <div className="simulation-panel">
                            <SimulationControls
                                onStart={handleSimulationStart}
                                onStop={handleSimulationStop}
                                onReset={handleSimulationReset}
                                status={simulationStatus}
                            />
                            <TicketPoolDisplay {...ticketPool} />
                        </div>

                        <div className="stats-grid">
                            <div className="stats-panel">
                                <h2>Vendor Activities</h2>
                                {detailedStats.vendors.map(vendor => (
                                    <div key={vendor.vendorId} className="stat-item">
                                        <span>Vendor {vendor.vendorId}</span>
                                        <span>{vendor.ticketsReleased} tickets released</span>
                                    </div>
                                ))}
                            </div>

                            <div className="stats-panel">
                                <h2>Customer Activities</h2>
                                {detailedStats.customers.map(customer => (
                                    <div key={customer.customerId} className="stat-item">
                                        <span>Customer {customer.customerId.split('-').pop()}</span>
                                        <span>{customer.ticketsBought} tickets bought</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="transaction-log">
                            <h2>Recent Transactions</h2>
                            <div className="transaction-list">
                                {detailedStats.recentTransactions.map(tx => (
                                    <div key={tx.ticketId} className="transaction-item">
                                        Ticket {tx.ticketId} sold to Customer {tx.customerId} 
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="system-log">
                            <h2>System Log</h2>
                            <div className="log-list">
                                {logs.map((log, index) => (
                                    <div key={index} className="log-item">
                                        {log}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default App;