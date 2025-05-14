import { ReactNode } from 'react';

export type StatusType = 'spo2' | 'heart' | 'success' | 'warning' | 'danger' | 'info';

interface StatusIndicatorProps {
  status: string;
  className?: string;
}

export default function StatusIndicator({ status, className = '' }: StatusIndicatorProps) {
  let statusClass = '';
  let statusText = '';
  
  switch (status) {
    case 'available':
      statusClass = 'bg-green-900/50 text-green-400 border border-green-700/50';
      statusText = 'Available';
      break;
    case 'low-stock':
      statusClass = 'bg-yellow-900/50 text-yellow-400 border border-yellow-700/50';
      statusText = 'Low Stock';
      break;
    case 'sold-out':
      statusClass = 'bg-red-900/50 text-red-400 border border-red-700/50';
      statusText = 'Sold Out';
      break;
    case 'archived':
      statusClass = 'bg-gray-900/50 text-gray-400 border border-gray-700/50';
      statusText = 'Archived';
      break;
    default:
      statusClass = 'bg-dark-800 text-gray-400 border border-gray-700/50';
      statusText = status || 'Unknown';
  }
  
  return (
    <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass} ${className}`}>
      {statusText}
    </div>
  );
} 