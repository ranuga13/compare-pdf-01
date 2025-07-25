import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 dark:bg-gray-950 text-white py-4 mt-auto transition-colors duration-300">
      <div className="container mx-auto px-4 text-center text-sm">
        <p>PDF Comparison Tool &copy; {new Date().getFullYear()}</p>
        <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
          Powered by advanced document analysis technology
        </p>
      </div>
    </footer>
  );
};

export default Footer;