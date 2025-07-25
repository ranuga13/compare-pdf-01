import React, { useState } from 'react';
import { ComparisonProvider } from './contexts/ComparisonContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header/Header';
import MainContent from './components/MainContent/MainContent';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <ThemeProvider>
      <ComparisonProvider>
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
          <Header />
          <MainContent />
          <Footer />
        </div>
      </ComparisonProvider>
    </ThemeProvider>
  );
}

export default App;