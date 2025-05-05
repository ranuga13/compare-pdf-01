import React, { useState } from 'react';
import { ComparisonProvider } from './contexts/ComparisonContext';
import Header from './components/Header/Header';
import MainContent from './components/MainContent/MainContent';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <ComparisonProvider>
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
        <Header />
        <MainContent />
        <Footer />
      </div>
    </ComparisonProvider>
  );
}

export default App;