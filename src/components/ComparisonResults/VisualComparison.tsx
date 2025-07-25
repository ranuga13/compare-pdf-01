import React, { useState, useEffect } from 'react';
import { useComparison } from '../../contexts/ComparisonContext';
import { ChevronLeft, ChevronRight, Layers, Columns2 } from 'lucide-react';
import Button from '../common/Button';
import MagentaOverlay from './MagentaOverlay';
import SideBySideView from './SideBySideView';
import { generateVisualComparison } from '../../services/visualComparisonService';

const VisualComparison: React.FC = () => {
  const { 
    originalDocument, 
    newDocument, 
    visualComparisonType, 
    setVisualComparisonType,
    currentPage,
    setCurrentPage,
    totalPages,
    setError
  } = useComparison();

  const [overlayImages, setOverlayImages] = useState<string[]>([]);
  const [sideBySideImages, setSideBySideImages] = useState<Array<{
    original: string;
    new: string;
    diff: string;
  }>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Export the overlay images so they can be used by the export service
  useEffect(() => {
    if (overlayImages.length > 0) {
      // Store overlay images in a way that can be accessed by export service
      // For now, we'll store them in sessionStorage as a simple solution
      sessionStorage.setItem('overlayImages', JSON.stringify(overlayImages));
    }
  }, [overlayImages]);

  useEffect(() => {
    const generateComparisons = async () => {
      if (!originalDocument || !newDocument) return;
      
      setLoading(true);
      try {
        // Generate comparisons for all pages
        const result = await generateVisualComparison(
          originalDocument.images,
          newDocument.images
        );
        
        setOverlayImages(result.overlayImages);
        setSideBySideImages(result.sideBySideImages.map((comparison, index) => ({
          original: comparison.original,
          new: comparison.new,
          // Use the same overlay image for the diff view
          diff: result.overlayImages[index] || comparison.new
        })));
      } catch (error) {
        setError(`Failed to generate visual comparison: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    generateComparisons();
  }, [originalDocument, newDocument, setError]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (!originalDocument || !newDocument) {
    return <div className="text-center text-gray-500 py-12">No documents available for comparison</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <Button
            variant={visualComparisonType === 'magenta-overlay' ? 'primary' : 'outline'}
            onClick={() => setVisualComparisonType('magenta-overlay')}
            className="flex items-center space-x-1 text-sm"
          >
            <Layers size={16} />
            <span>Magenta Overlay</span>
          </Button>
          <Button
            variant={visualComparisonType === 'side-by-side' ? 'primary' : 'outline'}
            onClick={() => setVisualComparisonType('side-by-side')}
            className="flex items-center space-x-1 text-sm"
          >
            <Columns2 size={16} />
            <span>Side by Side</span>
          </Button>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            onClick={handlePreviousPage}
            disabled={currentPage <= 1 || loading}
            variant="outline"
            className="p-2"
          >
            <ChevronLeft size={16} />
          </Button>
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Page {currentPage} of {totalPages || 1}
          </span>
          <Button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages || loading}
            variant="outline"
            className="p-2"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-pulse text-blue-500">
            Generating visual comparison...
          </div>
        </div>
      ) : (
        <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 transition-colors duration-300">
          {visualComparisonType === 'magenta-overlay' && (
            <MagentaOverlay 
              originalImage={originalDocument.images[currentPage - 1] || ''}
              newImage={newDocument.images[currentPage - 1] || ''}
              overlayImage={overlayImages[currentPage - 1] || ''}
              pageNumber={currentPage}
            />
          )}
          
          {visualComparisonType === 'side-by-side' && (
            <SideBySideView 
              comparison={sideBySideImages[currentPage - 1] || {
                original: originalDocument.images[currentPage - 1] || '',
                new: newDocument.images[currentPage - 1] || '',
                diff: overlayImages[currentPage - 1] || ''
              }}
              pageNumber={currentPage}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default VisualComparison;