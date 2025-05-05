import { VisualDifference } from '../types';

export const generateVisualComparison = async (
  originalImages: string[],
  newImages: string[]
): Promise<{
  overlayImages: string[];
  sideBySideImages: Array<{
    original: string;
    new: string;
    diff: string;
  }>;
}> => {
  console.log('Generating visual comparison...');
  
  // For demonstration purposes, we'll simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const totalPages = Math.max(originalImages.length, newImages.length);
  const overlayImages: string[] = [];
  const sideBySideImages: Array<{
    original: string;
    new: string;
    diff: string;
  }> = [];
  
  for (let i = 0; i < totalPages; i++) {
    const originalImage = originalImages[i] || '';
    const newImage = newImages[i] || '';
    
    if (originalImage && newImage) {
      // Generate magenta overlay
      const overlayImage = await generateMagentaOverlay(originalImage, newImage);
      overlayImages.push(overlayImage);
      
      // Generate side-by-side comparison with highlights
      const diffImage = await generateDiffHighlight(originalImage, newImage);
      sideBySideImages.push({
        original: originalImage,
        new: newImage,
        diff: diffImage
      });
    } else {
      // If one of the images is missing, just use what we have
      overlayImages.push(newImage || originalImage);
      sideBySideImages.push({
        original: originalImage,
        new: newImage,
        diff: ''
      });
    }
  }
  
  return {
    overlayImages,
    sideBySideImages
  };
};

// Generate a magenta overlay highlighting differences
const generateMagentaOverlay = async (originalImage: string, newImage: string): Promise<string> => {
  return new Promise((resolve) => {
    const img1 = new Image();
    const img2 = new Image();
    
    img1.onload = () => {
      img2.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          resolve(newImage); // Fallback if canvas context is unavailable
          return;
        }
        
        // Set canvas size to match images
        canvas.width = Math.max(img1.width, img2.width);
        canvas.height = Math.max(img1.height, img2.height);
        
        // Draw the new image
        ctx.drawImage(img2, 0, 0);
        
        // Apply composite operation
        ctx.globalCompositeOperation = 'difference';
        
        // Draw the original image using the difference blend mode
        ctx.drawImage(img1, 0, 0);
        
        // Get the image data to modify
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Convert differences to magenta
        for (let i = 0; i < data.length; i += 4) {
          if (data[i] > 20 || data[i+1] > 20 || data[i+2] > 20) {
            // If there's a difference, make it magenta
            data[i] = 255; // R
            data[i+1] = 0;  // G
            data[i+2] = 255; // B
            data[i+3] = 255; // A
          }
        }
        
        // Put the modified data back
        ctx.putImageData(imageData, 0, 0);
        
        // Reset composite operation
        ctx.globalCompositeOperation = 'source-over';
        
        // Draw the new image at reduced opacity
        ctx.globalAlpha = 0.8;
        ctx.drawImage(img2, 0, 0);
        
        resolve(canvas.toDataURL('image/png'));
      };
      
      img2.src = newImage;
    };
    
    img1.src = originalImage;
  });
};

// Generate side-by-side view with highlighted differences
const generateDiffHighlight = async (originalImage: string, newImage: string): Promise<string> => {
  return new Promise((resolve) => {
    const img1 = new Image();
    const img2 = new Image();
    
    img1.onload = () => {
      img2.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          resolve(newImage); // Fallback if canvas context is unavailable
          return;
        }
        
        // Set canvas size to new image dimensions
        canvas.width = img2.width;
        canvas.height = img2.height;
        
        // Draw the new image
        ctx.drawImage(img2, 0, 0);
        
        // Create temporary canvases for difference detection
        const tempCanvas1 = document.createElement('canvas');
        const tempCtx1 = tempCanvas1.getContext('2d');
        tempCanvas1.width = canvas.width;
        tempCanvas1.height = canvas.height;
        tempCtx1?.drawImage(img1, 0, 0, tempCanvas1.width, tempCanvas1.height);
        
        const tempCanvas2 = document.createElement('canvas');
        const tempCtx2 = tempCanvas2.getContext('2d');
        tempCanvas2.width = canvas.width;
        tempCanvas2.height = canvas.height;
        tempCtx2?.drawImage(img2, 0, 0);
        
        if (!tempCtx1 || !tempCtx2) {
          resolve(newImage);
          return;
        }
        
        // Get image data from both images
        const imageData1 = tempCtx1.getImageData(0, 0, tempCanvas1.width, tempCanvas1.height);
        const imageData2 = tempCtx2.getImageData(0, 0, tempCanvas2.width, tempCanvas2.height);
        const data1 = imageData1.data;
        const data2 = imageData2.data;
        
        // Create new image data for highlighted differences
        const diffData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const diffPixels = diffData.data;
        
        // Compare pixels and highlight differences
        for (let i = 0; i < diffPixels.length; i += 4) {
          // Check if the pixel has changed significantly
          const isDifferent = Math.abs(data1[i] - data2[i]) > 30 || 
                             Math.abs(data1[i+1] - data2[i+1]) > 30 || 
                             Math.abs(data1[i+2] - data2[i+2]) > 30;
                             
          if (isDifferent) {
            // Make added/changed content magenta
            diffPixels[i] = 255; // R
            diffPixels[i+1] = 0; // G
            diffPixels[i+2] = 255; // B
            diffPixels[i+3] = 255; // A (full opacity)
          }
        }
        
        // Put the modified data back
        ctx.putImageData(diffData, 0, 0);
        
        // Reset composite operation
        ctx.globalCompositeOperation = 'source-over';
        
        // Make the highlight semi-transparent
        ctx.globalAlpha = 0.6;
        ctx.drawImage(img2, 0, 0);
        
        resolve(canvas.toDataURL('image/png'));
      };
      
      img2.src = newImage;
    };
    
    img1.src = originalImage;
  });
};