import { DocumentFile } from '../types';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url';

// Set worker path to local worker file
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const processPdfFile = async (file: File): Promise<DocumentFile> => {
  // Create a URL for the file
  const fileUrl = URL.createObjectURL(file);
  
  try {
    // Load the PDF document
    const pdf = await pdfjsLib.getDocument(fileUrl).promise;
    const numPages = pdf.numPages;
    
    // Extract text from all pages
    let fullText = '';
    const textPages: string[] = [];
    
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => item.str)
        .join(' ');
      
      fullText += pageText + ' ';
      textPages.push(pageText);
    }
    
    // Render pages as images
    const pageImages: string[] = [];
    
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        throw new Error('Unable to create canvas context');
      }
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      
      // Convert canvas to image URL
      const imageUrl = canvas.toDataURL('image/png');
      pageImages.push(imageUrl);
    }
    
    // Create document object
    const documentFile: DocumentFile = {
      file,
      text: fullText.trim(),
      pages: textPages,
      images: pageImages
    };
    
    return documentFile;
  } catch (error) {
    console.error('Error processing PDF:', error);
    throw new Error('Failed to process PDF file');
  } finally {
    // Clean up the object URL
    URL.revokeObjectURL(fileUrl);
  }
};