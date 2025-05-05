import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md flex items-start">
      <AlertCircle className="text-red-500 mr-3 flex-shrink-0 mt-0.5" size={20} />
      <div>
        <h3 className="text-red-800 font-medium">An error occurred</h3>
        <p className="text-red-700 mt-1">{message}</p>
      </div>
    </div>
  );
};

export default ErrorDisplay;