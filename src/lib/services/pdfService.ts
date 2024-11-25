import { PDFDocument } from 'pdf-lib';
import { Parser } from 'html-to-react';

export const convertPdfToHtml = async (file: File): Promise<string> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    
    let htmlContent = '<div class="pdf-content">';
    
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const { width, height } = page.getSize();
      
      // Since pdf-lib doesn't provide direct text extraction,
      // we'll create a placeholder for the page content
      htmlContent += `
        <div class="pdf-page" style="width: ${width}px; height: ${height}px; position: relative;">
          <p>Page ${i + 1} content</p>
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