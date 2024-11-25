import * as pdfjsLib from 'pdfjs-dist';
import { addItem } from './itemService';
import { toast } from 'sonner';
import { Item } from '../types';

// Use a fake worker to avoid CORS issues with CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = false;

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
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const items: PDFData[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const text = textContent.items.map((item: any) => item.str).join(' ');
      
      const lines = text.split('\n').filter(line => line.trim());
      
      lines.forEach(line => {
        const parts = line.split(/\s+/);
        
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
      });
    }

    for (const item of items) {
      const newItem: Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'deleted'> = {
        code: item.code,
        quantity: 1,
        company: 'default',
        customer: item.orderNumber
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