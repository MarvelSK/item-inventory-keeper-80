import pdfParse from 'pdf-parse';
import { addItem } from './itemService';
import { toast } from 'sonner';
import { Item } from '../types';

interface PDFData {
  orderNumber: string;
  description: string;
  length: number;
  width: number;
  height: number;
  code: string;
}

export const parsePDFData = async (file: File): Promise<void> => {
  try {
    const buffer = await file.arrayBuffer();
    const data = await pdfParse(buffer);
    const lines = data.text.split('\n').filter(line => line.trim());
    const items: PDFData[] = [];

    lines.forEach(line => {
      const parts = line.split(/\s+/);
      if (parts.length >= 6) {
        const item: PDFData = {
          orderNumber: parts[0] || '',
          description: parts[1] || '',
          length: parseFloat(parts[2]) || 0,
          width: parseFloat(parts[3]) || 0,
          height: parseFloat(parts[4]) || 0,
          code: parts[5] || '',
        };
        
        if (item.code && item.orderNumber) {
          items.push(item);
        }
      }
    });

    for (const item of items) {
      const newItem: Item = {
        id: Math.random().toString(36).substr(2, 9),
        code: item.code,
        quantity: 1,
        company: 'default',
        customer: item.orderNumber,
        createdAt: new Date(),
        updatedAt: new Date(),
        deleted: false
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