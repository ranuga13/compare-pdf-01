import React from 'react';

interface SideBySideViewProps {
  comparison: {
    original: string;
    new: string;
    diff: string;
  };
  pageNumber: number;
}

const SideBySideView: React.FC<SideBySideViewProps> = ({ comparison, pageNumber }) => {
  const { original, new: newImage, diff } = comparison;
  
  // If we don't have processed diff image, we'll just show the original and new side by side
  const displayDiff = diff || newImage;
  
  if (!original && !newImage) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-200 rounded">
        <p className="text-gray-500">No images available for page {pageNumber}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-3 text-sm text-gray-600">
        <span className="font-medium">Side-by-Side View:</span> Red highlights for removed content, magenta for added content
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <div className="border border-gray-300 rounded shadow-sm overflow-hidden bg-white">
          <div className="bg-gray-100 py-1 px-3 border-b border-gray-300 text-sm font-medium text-gray-700">
            Original Document
          </div>
          {original ? (
            <img 
              src={original} 
              alt={`Page ${pageNumber} of original document`}
              className="max-w-full h-auto"
            />
          ) : (
            <div className="h-48 flex items-center justify-center bg-gray-50">
              <p className="text-gray-400 text-sm">No image available</p>
            </div>
          )}
        </div>
        <div className="border border-gray-300 rounded shadow-sm overflow-hidden">
          <div className="bg-gray-100 py-1 px-3 border-b border-gray-300 text-sm font-medium text-gray-700">
            New Document (with highlights)
          </div>
          {displayDiff ? (
            <img 
              src={displayDiff} 
              alt={`Page ${pageNumber} of new document with changes highlighted`}
              className="max-w-full h-auto"
            />
          ) : (
            <div className="h-48 flex items-center justify-center bg-gray-50">
              <p className="text-gray-400 text-sm">No image available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBySideView;