// SimulationControls.tsx
import React from 'react';
import { SimulationStatus } from '../types/types';


interface SimulationControlsProps {
    onStart: () => void;
    onStop: () => void;
    onReset: () => void;
    status: SimulationStatus;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
    onStart,
    onStop,
    onReset,
    status
}) => {
    return (
        <div className="simulation-controls">
            <button
                onClick={onStart}
                disabled={status === 'running'}
                className={`control-button start ${status === 'running' ? 'disabled' : ''}`}
            >
                Start Simulation
            </button>
            <button
                onClick={onStop}
                disabled={status !== 'running'}
                className={`control-button stop ${status !== 'running' ? 'disabled' : ''}`}
            >
                Stop Simulation
            </button>
            <button
                onClick={onReset}
                className="control-button reset"
            >
                Reset Simulation
            </button>
            <div className="status-indicator">
                Status: {status.charAt(0).toUpperCase() + status.slice(1)}
            </div>
        </div>
    );
};

export default SimulationControls;