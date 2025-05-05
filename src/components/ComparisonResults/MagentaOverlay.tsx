import React from 'react';

interface MagentaOverlayProps {
  originalImage: string;
  newImage: string;
  overlayImage: string;
  pageNumber: number;
}

const MagentaOverlay: React.FC<MagentaOverlayProps> = ({ 
  originalImage, 
  newImage, 
  overlayImage,
  pageNumber 
}) => {
  // If we don't have a processed overlay image yet, show the new image
  const displayImage = overlayImage || newImage || originalImage;
  
  if (!displayImage) {
    return (
      <div className="h-64 flex items-center justify-center bg-gray-200 rounded">
        <p className="text-gray-500">No image available for page {pageNumber}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-3 text-sm text-gray-600">
        <span className="font-medium">Magenta Overlay View:</span> Differences highlighted in magenta
      </div>
      <div className="border border-gray-300 rounded shadow-sm overflow-hidden bg-white">
        <img 
          src={displayImage} 
          alt={`Page ${pageNumber} comparison with magenta overlay`}
          className="max-w-full h-auto"
        />
      </div>
    </div>
  );
};

export default MagentaOverlay;