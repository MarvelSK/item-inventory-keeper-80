import { PDFDocument } from 'pdf-lib';
import { Parser } from 'html-to-react';

export const convertPdfToHtml = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    
    let htmlContent = '<div class="pdf-content space-y-4">';
    
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const { width, height } = page.getSize();
      
      // Create a structured placeholder for PDF content
      htmlContent += `
        <div class="pdf-page bg-white shadow-md rounded-lg p-6" style="min-height: ${height}px;">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Page ${i + 1}</h2>
            <span class="text-sm text-gray-500">Size: ${Math.round(width)}x${Math.round(height)}</span>
          </div>
          <div class="pdf-content-placeholder text-gray-600">
            <p>PDF content for page ${i + 1}</p>
            <p class="text-sm text-gray-400 mt-2">Note: Direct text extraction is not available. Please refer to the original PDF for content.</p>
          </div>
        </div>
      `;
    }
    
    htmlContent += '</div>';
    return htmlContent;
  } catch (error) {
    console.error('Error converting PDF to HTML:', error);
    throw new Error('Failed to convert PDF to HTML');
  }
};

export const renderHtmlContent = (htmlContent: string): JSX.Element => {
  const parser = Parser();
  return parser.parse(htmlContent);
};