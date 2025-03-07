import React from 'react';

interface StatusLogProps {
  logs: string[];
}

const StatusLog: React.FC<StatusLogProps> = ({ logs }) => {
  return (
    <div>
      <h2>System Log</h2>
      <ul>
        {logs.map((log, index) => (
          <li key={index}>{log}</li>
        ))}
      </ul>
    </div>
  );
};

export default StatusLog;