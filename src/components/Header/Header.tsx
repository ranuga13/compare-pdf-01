import React from 'react';
import { FileSearch } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileSearch size={32} className="text-blue-800 dark:text-blue-400" />
          <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-100">PDF Compare</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Compare documents with precision
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;