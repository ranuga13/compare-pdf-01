import React from 'react';
import { FileSearch } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileSearch size={32} className="text-blue-800" />
          <h1 className="text-2xl font-bold text-blue-900">PDF Compare</h1>
        </div>
        <div className="text-sm text-gray-600">
          Compare Documents With Precision
        </div>
      </div>
    </header>
  );
};

export default Header;