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
    
    // Process text and images concurrently for better performance
    const [textContent, pageImages] = await Promise.all([
      extractText(pdf, numPages),
      renderPages(pdf, numPages)
    ]);
    
    // Create document object
    const documentFile: DocumentFile = {
      file,
      text: textContent.fullText.trim(),
      pages: textContent.textPages,
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

async function extractText(pdf: pdfjsLib.PDFDocumentProxy, numPages: number) {
  const textPages: string[] = [];
  let fullText = '';
  
  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item: any) => item.str)
      .join(' ');
    
    fullText += pageText + ' ';
    textPages.push(pageText);
  }
  
  return { fullText, textPages };
}

async function renderPages(pdf: pdfjsLib.PDFDocumentProxy, numPages: number) {
  const pageImages: string[] = [];
  
  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    // Reduced scale factor for better performance
    const viewport = page.getViewport({ scale: 1.2 });
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', {
      alpha: false, // Disable alpha for better performance
      willReadFrequently: true // Optimize for pixel manipulation
    });
    
    if (!context) {
      throw new Error('Unable to create canvas context');
    }
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    // Use lower quality but faster rendering
    context.imageSmoothingQuality = 'medium';
    
    await page.render({
      canvasContext: context,
      viewport: viewport,
      background: 'white' // Set white background to avoid transparency
    }).promise;
    
    // Convert to JPEG instead of PNG for smaller size and faster processing
    const imageUrl = canvas.toDataURL('image/jpeg', 0.8);
    pageImages.push(imageUrl);
    
    // Clean up
    canvas.width = 0;
    canvas.height = 0;
  }
  
  return pageImages;
}