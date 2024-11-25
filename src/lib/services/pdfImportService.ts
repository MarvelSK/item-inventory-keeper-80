import PDFParser from 'pdf-parse';
import { addItem } from './itemService';
import { toast } from 'sonner';
import { Item } from '../types';

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
    
    const lines = text.split('\n').filter(line => line.trim());
    
    const items = lines.map(line => {
      const parts = line.split(/\s+/);
      
      const item: PDFData = {
        orderNumber: parts[0] || '',
        description: parts[1] || '',
        length: parseFloat(parts[2]) || 0,
        width: parseFloat(parts[3]) || 0,
        height: parseFloat(parts[4]) || 0,
        code: parts[5] || '',
      };
      
      return item;
    }).filter(item => item.code && item.orderNumber);

    for (const item of items) {
      const newItem: Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'deleted'> = {
        code: item.code,
        quantity: 1,
        company: 'default',
        customer: item.orderNumber,
        dimensions: {
          length: item.length,
          width: item.width,
          height: item.height
        }
      };
      
      await addItem(newItem);
    }

    toast.success(`Successfully imported ${items.length} items from PDF`);
  } catch (error) {
    console.error('Error parsing PDF:', error);
    toast.error('Failed to parse PDF file');
    throw error;
  }
};