import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 p-4 mb-6 rounded-md flex items-start transition-colors duration-300">
      <AlertCircle className="text-red-500 dark:text-red-400 mr-3 flex-shrink-0 mt-0.5" size={20} />
      <div>
        <h3 className="text-red-800 dark:text-red-200 font-medium">An error occurred</h3>
        <p className="text-red-700 dark:text-red-300 mt-1">{message}</p>
      </div>
    </div>
  );
};

export default ErrorDisplay;