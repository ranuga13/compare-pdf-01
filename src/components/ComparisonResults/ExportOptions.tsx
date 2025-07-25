import React, { useState } from 'react';
import { X, Download, Loader2 } from 'lucide-react';
import Button from '../common/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { useComparison } from '../../contexts/ComparisonContext';
import { exportComparisonToPDF } from '../../services/pdfExportService';

interface ExportConfig {
  includeTextComparison: boolean;
  includeVisualComparison: boolean;
}

interface ExportOptionsProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (options: ExportConfig) => void;
  isExporting: boolean;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({
  isOpen,
  onClose,
  onExport,
  isExporting
}) => {
  const { theme } = useTheme();
  const [includeTextComparison, setIncludeTextComparison] = React.useState(true);
  const [includeVisualComparison, setIncludeVisualComparison] = React.useState(true);

  if (!isOpen) return null;

  const handleExport = () => {
    onExport({
      includeTextComparison,
      includeVisualComparison
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      } rounded-lg p-6 w-full max-w-md mx-4 shadow-xl`}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Export Options</h3>
          <button
            onClick={onClose}
            className={`p-1 rounded-full hover:${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
            } transition-colors`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">Include in Report</h4>
            <div className="space-y-2">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={includeTextComparison}
                  onChange={(e) => setIncludeTextComparison(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span>Text Comparison</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={includeVisualComparison}
                  onChange={(e) => setIncludeVisualComparison(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span>Visual Comparison</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleExport}
            disabled={isExporting || (!includeTextComparison && !includeVisualComparison)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Main modal wrapper component
const ExportOptionsModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { originalDocument, newDocument, textComparisonResult } = useComparison();

  const handleExport = async (options: ExportConfig) => {
    if (!originalDocument || !newDocument || !textComparisonResult) {
      return;
    }

    setIsExporting(true);
    try {
      // Get overlay images from sessionStorage if available
      let overlayImages: string[] = [];
      try {
        const storedImages = sessionStorage.getItem('overlayImages');
        if (storedImages) {
          overlayImages = JSON.parse(storedImages);
        }
      } catch (error) {
        console.warn('Could not retrieve overlay images');
      }

      await exportComparisonToPDF(
        originalDocument,
        newDocument,
        textComparisonResult,
        overlayImages,
        {
          includeTextComparison: options.includeTextComparison,
          includeVisualComparison: options.includeVisualComparison,
          format: 'A4'
        }
      );
      
      setIsOpen(false);
    } catch (error) {
      console.error('Export failed:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        variant="primary"
        className="flex items-center space-x-1"
      >
        <Download size={16} />
        <span>Export Report</span>
      </Button>
      
      <ExportOptions
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onExport={handleExport}
        isExporting={isExporting}
      />
    </>
  );
};

export default ExportOptionsModal;