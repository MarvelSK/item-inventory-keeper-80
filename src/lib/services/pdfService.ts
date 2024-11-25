import { PDFDocument } from 'pdf-lib';
import { Parser } from 'html-to-react';
import * as pdfjsLib from 'pdfjs-dist';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const convertPdfToHtml = async (file: File): Promise<string> => {
  try {
    // Load the PDF file
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    
    // Load the PDF with PDF.js for text extraction
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let htmlContent = '<div class="pdf-content space-y-4">';
    
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const { width, height } = page.getSize();
      
      // Extract text content using PDF.js
      const pdfJsPage = await pdf.getPage(i + 1);
      const textContent = await pdfJsPage.getTextContent();
      const textItems = textContent.items
        .map((item: any) => item.str)
        .filter((text: string) => text.trim().length > 0);
      
      htmlContent += `
        <div class="pdf-page bg-white shadow-md rounded-lg p-6" style="min-height: ${height}px;">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold">Page ${i + 1}</h2>
            <span class="text-sm text-gray-500">Size: ${Math.round(width)}x${Math.round(height)}</span>
          </div>
          <div class="pdf-content-text text-gray-800 whitespace-pre-wrap">
            ${textItems.join(' ')}
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