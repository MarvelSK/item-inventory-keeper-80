import PDFParser from 'pdf-parse';
import { addItem } from './itemService';
import { toast } from 'sonner';

interface PDFData {
  orderNumber: string;    // Číslo zakázky
  description: string;    // Popis
  length: number;        // Délka
  width: number;         // Šířka
  height: number;        // Výška
  code: string;          // Č. balení
}

export const parsePDFData = async (file: File): Promise<void> => {
  try {
    const buffer = await file.arrayBuffer();
    const data = await PDFParser(buffer);
    const text = data.text;
    
    // Split text into lines
    const lines = text.split('\n').filter(line => line.trim());
    
    // Process each line
    const items = lines.map(line => {
      const parts = line.split(/\s+/);
      
      // Try to extract data based on column positions or labels
      const item: PDFData = {
        orderNumber: parts[0] || '',
        description: parts[1] || '',
        length: parseFloat(parts[2]) || 0,
        width: parseFloat(parts[3]) || 0,
        height: parseFloat(parts[4]) || 0,
        code: parts[5] || '',
      };
      
      return item;
    }).filter(item => item.code && item.orderNumber); // Only keep items with required fields

    // Add each item to inventory
    for (const item of items) {
      await addItem({
        code: item.code,
        quantity: 1,
        company: 'default', // You might want to map this differently
        customer: item.orderNumber,
        description: item.description,
        dimensions: {
          length: item.length,
          width: item.width,
          height: item.height
        }
      });
    }

    toast.success(`Successfully imported ${items.length} items from PDF`);
  } catch (error) {
    console.error('Error parsing PDF:', error);
    toast.error('Failed to parse PDF file');
    throw error;
  }
};