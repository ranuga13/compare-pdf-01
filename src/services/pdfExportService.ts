import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ComparisonResult, DocumentFile } from '../types';

export interface ExportOptions {
  includeVisualComparison: boolean;
  includeTextComparison: boolean;
  pageRange?: { start: number; end: number };
  format: 'A4' | 'Letter';
}

export const exportComparisonToPDF = async (
  originalDocument: DocumentFile,
  newDocument: DocumentFile,
  textComparison: ComparisonResult,
  overlayImages: string[],
  options: ExportOptions = {
    includeVisualComparison: true,
    includeTextComparison: true,
    format: 'A4'
  }
): Promise<void> => {
  // If no overlay images provided, try to get them from sessionStorage
  if (overlayImages.length === 0) {
    try {
      const storedImages = sessionStorage.getItem('overlayImages');
      if (storedImages) {
        overlayImages = JSON.parse(storedImages);
      }
    } catch (error) {
      console.warn('Could not retrieve overlay images from storage');
    }
  }

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: options.format.toLowerCase(),
    putOnlyUsedFonts: true,
    compress: true
  });

  // Set default font for consistency
  pdf.setFont('helvetica', 'normal');

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  let yPosition = margin;

  // Add title page
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('PDF Comparison Report', margin, yPosition);
  
  yPosition += 15;
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, yPosition);
  
  yPosition += 10;
  // Clean and encode file names properly
  const cleanOriginalName = originalDocument.file.name.replace(/[^\x20-\x7E]/g, '?');
  pdf.text(`Original Document: ${cleanOriginalName}`, margin, yPosition);
  
  yPosition += 7;
  const cleanNewName = newDocument.file.name.replace(/[^\x20-\x7E]/g, '?');
  pdf.text(`New Document: ${cleanNewName}`, margin, yPosition);
  
  yPosition += 20;

  // Add text comparison if enabled
  if (options.includeTextComparison && textComparison) {
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Document Changes', margin, yPosition);
    yPosition += 15;

    // Parse and add text changes
    const changes = textComparison.summary.split('\n').filter(line => line.trim());
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    for (const change of changes) {
      const trimmedChange = change.trim();
      if (!trimmedChange) continue;

      // Check if we need a new page
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = margin;
      }

      // Clean text to handle special characters
      const cleanText = (text: string) => {
        return text
          .replace(/[""]/g, '"')     // Replace smart quotes with regular quotes
          .replace(/['']/g, "'")     // Replace smart apostrophes with regular apostrophes
          .replace(/[–—]/g, '-')     // Replace em/en dashes with hyphens
          .replace(/…/g, '...')      // Replace ellipsis with three dots
          .replace(/!'/g, '→')       // Replace !' with arrow symbol
          .replace(/!' as/g, '→')    // Replace !' as with arrow symbol
          .replace(/→ as/g, '→')     // Clean up any remaining "as" after arrow
          .replace(/\s*→\s*/g, ' → '); // Ensure proper spacing around arrows
          // Remove the aggressive character replacement that was causing issues
      };

      // Handle headers
      if (trimmedChange.includes('**') || trimmedChange.endsWith(':')) {
        pdf.setFont('helvetica', 'bold');
        const headerText = cleanText(trimmedChange.replace(/\*\*/g, '').replace(/^[•-]\s*/, ''));
        const lines = pdf.splitTextToSize(headerText, contentWidth);
        pdf.text(lines, margin, yPosition);
        yPosition += lines.length * 7 + 5;
        pdf.setFont('helvetica', 'normal');
      } else {
        // Regular content
        const contentText = cleanText(trimmedChange.replace(/^[•-]\s*/, '• '));
        const lines = pdf.splitTextToSize(contentText, contentWidth - 5);
        pdf.text(lines, margin + 5, yPosition);
        yPosition += lines.length * 6 + 4;
      }
    }
  }

  // Add visual comparison if enabled
  if (options.includeVisualComparison && overlayImages.length > 0) {
    const startPage = options.pageRange?.start || 1;
    const endPage = options.pageRange?.end || overlayImages.length;
    
    for (let i = startPage - 1; i < Math.min(endPage, overlayImages.length); i++) {
      const overlayImage = overlayImages[i];
      if (!overlayImage) continue;

      pdf.addPage();
      yPosition = margin;

      // Add page header
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Visual Comparison - Page ${i + 1}`, margin, yPosition);
      yPosition += 15;

      try {
        // Add the overlay image
        // Create a temporary image to get actual dimensions
        const tempImg = new Image();
        await new Promise((resolve, reject) => {
          tempImg.onload = resolve;
          tempImg.onerror = reject;
          tempImg.src = overlayImage;
        });
        
        // Calculate proper dimensions maintaining aspect ratio
        const originalAspectRatio = tempImg.width / tempImg.height;
        let imgWidth = contentWidth;
        let imgHeight = imgWidth / originalAspectRatio;
        
        // If image is too tall, scale it down to fit the page
        const maxHeight = pageHeight - yPosition - margin - 20; // Leave space for legend
        if (imgHeight > maxHeight) {
          imgHeight = maxHeight;
          imgWidth = imgHeight * originalAspectRatio;
        }
        
        // Check if image fits on current page
        if (yPosition + imgHeight > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
          pdf.setFont('helvetica', 'bold');
          pdf.text(`Visual Comparison - Page ${i + 1}`, margin, yPosition);
          yPosition += 15;
        }

        pdf.addImage(overlayImage, 'PNG', margin, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 10;

        // Add legend
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'italic');
        pdf.text('Magenta highlights indicate differences between documents', margin, yPosition);
        
      } catch (error) {
        console.error('Error adding image to PDF:', error);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Error loading visual comparison for page ${i + 1}`, margin, yPosition);
      }
    }
  }

  // Save the PDF
  const fileName = `comparison-report-${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
};

export const exportTextComparisonElement = async (element: HTMLElement): Promise<void> => {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);
    
    const fileName = `text-comparison-${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error('Error exporting text comparison:', error);
    throw new Error('Failed to export text comparison');
  }
};