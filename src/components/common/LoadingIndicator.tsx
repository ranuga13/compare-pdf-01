import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingIndicatorProps {
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  message = 'Processing documents...' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative flex items-center justify-center">
        {/* Primary spinner */}
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        
        {/* Background ring */}
        <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-lg font-medium text-gray-800">{message}</p>
        <p className="mt-2 text-sm text-gray-500">
          This may take a moment depending on document size
        </p>
      </div>
      
      {/* Progress dots */}
      <div className="flex space-x-2 mt-4">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: '200ms' }} />
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: '400ms' }} />
      </div>
    </div>
  );
};

export default LoadingIndicator;