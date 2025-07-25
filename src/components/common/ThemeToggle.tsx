import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      onClick={toggleTheme}
      className="relative inline-flex h-8 w-14 cursor-pointer items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300 hover:bg-gray-300 dark:hover:bg-gray-600"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      role="switch"
      aria-checked={theme === 'dark'}
    >
      {/* Toggle slider */}
      <div
        className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out ${
          theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
        }`}
      >
        <div className="flex h-full w-full items-center justify-center">
          {theme === 'light' ? (
            <Sun size={12} className="text-yellow-500" />
          ) : (
            <Moon size={12} className="text-blue-600" />
          )}
        </div>
      </div>
      
      {/* Background icons */}
      <div className="absolute inset-0 flex items-center justify-between px-2">
        <Sun size={10} className={`transition-opacity duration-300 ${theme === 'light' ? 'opacity-30' : 'opacity-60'} text-yellow-400`} />
        <Moon size={10} className={`transition-opacity duration-300 ${theme === 'dark' ? 'opacity-30' : 'opacity-60'} text-blue-300`} />
      </div>
    </div>
  );
};

export default ThemeToggle;