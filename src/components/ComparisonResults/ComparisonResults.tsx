import React, { useState, useEffect } from 'react';
import { useComparison } from '../../contexts/ComparisonContext';
import TextComparison from './TextComparison';
import VisualComparison from './VisualComparison';
import Button from '../common/Button';
import { compareTexts } from '../../services/comparisonService';
import { Layers, FileText, RefreshCw } from 'lucide-react';

const ComparisonResults: React.FC = () => {
  const {
    originalDocument,
    newDocument,
    resetComparison,
    setIsProcessing,
    setTextComparisonResult,
    textComparisonResult,
    setError,
    setTotalPages
  } = useComparison();

  const [activeTab, setActiveTab] = useState<'text' | 'visual'>('text');

  useEffect(() => {
    const runTextComparison = async () => {
      if (originalDocument && newDocument && !textComparisonResult) {
        setIsProcessing(true);
        try {
          const result = await compareTexts(originalDocument.text, newDocument.text);
          setTextComparisonResult(result);
          
          // Set the total number of pages (use the max of both documents)
          const maxPages = Math.max(
            originalDocument.images.length, 
            newDocument.images.length
          );
          setTotalPages(maxPages);
        } catch (error) {
          setError(`Failed to compare documents: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
          setIsProcessing(false);
        }
      }
    };

    runTextComparison();
  }, [originalDocument, newDocument, textComparisonResult, setIsProcessing, setTextComparisonResult, setError, setTotalPages]);

  const handleReset = () => {
    resetComparison();
  };

  if (!originalDocument || !newDocument) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-900">Comparison Results</h2>
        <Button 
          onClick={handleReset} 
          variant="outline"
          className="flex items-center space-x-1"
        >
          <RefreshCw size={16} />
          <span>New Comparison</span>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b">
          <button
            className={`px-4 py-3 font-medium text-sm flex items-center space-x-2 flex-1 justify-center
              ${activeTab === 'text' 
                ? 'text-blue-800 border-b-2 border-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('text')}
          >
            <FileText size={18} />
            <span>Textual Comparison</span>
          </button>
          <button
            className={`px-4 py-3 font-medium text-sm flex items-center space-x-2 flex-1 justify-center
              ${activeTab === 'visual' 
                ? 'text-blue-800 border-b-2 border-blue-600 bg-blue-50' 
                : 'text-gray-600 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('visual')}
          >
            <Layers size={18} />
            <span>Visual Comparison</span>
          </button>
        </div>
        
        <div className="p-6">
          {activeTab === 'text' && <TextComparison />}
          {activeTab === 'visual' && <VisualComparison />}
        </div>
      </div>
    </div>
  );
};

export default ComparisonResults;