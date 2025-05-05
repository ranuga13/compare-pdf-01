import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-auto">
      <div className="container mx-auto px-4 text-center text-sm">
        <p>PDF Comparison Tool &copy; {new Date().getFullYear()}</p>
        <p className="text-gray-400 text-xs mt-1">
          Powered by AI
        </p>
      </div>
    </footer>
  );
};

export default Footer;