import { Item, Company, Customer } from '../models/types';
import { z } from 'zod';

const downloadCsv = (content: string, type: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${type}_backup_${new Date().toISOString()}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

// Validation schemas
const itemSchema = z.object({
  code: z.string().min(1),
  quantity: z.number().int().min(0),
  company: z.string().min(1),
  customer: z.string().min(1),
  createdAt: z.string().transform((str) => new Date(str)),
  updatedAt: z.string().transform((str) => new Date(str)),
});

const companySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

const customerSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  companyId: z.string().min(1),
});

// Data sanitization functions
const sanitizeString = (str: string): string => {
  return str.trim().replace(/[<>]/g, '');
};

const sanitizeNumber = (num: string): number => {
  const parsed = parseInt(num, 10);
  return isNaN(parsed) ? 0 : parsed;
};

export const backupInventory = async (items: Item[]) => {
  const csvContent = items.map(item => 
    `${item.code},${item.quantity},${item.company},${item.customer},${item.createdAt.toISOString()},${item.updatedAt.toISOString()}`
  ).join('\n');
  
  downloadCsv(csvContent, 'inventory');
};

export const backupCompanies = async (companies: Company[]) => {
  const csvContent = companies.map(company => 
    `${company.id},${company.name}`
  ).join('\n');
  
  downloadCsv(csvContent, 'companies');
};

export const backupCustomers = async (customers: Customer[]) => {
  const csvContent = customers.map(customer => 
    `${customer.id},${customer.name},${customer.companyId}`
  ).join('\n');
  
  downloadCsv(csvContent, 'customers');
};

export const importInventory = async (file: File): Promise<Item[]> => {
  console.log('Starting inventory import');
  const text = await file.text();
  const lines = text.split('\n').filter(line => line.trim());
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const rawData = {
      code: sanitizeString(values[0]),
      quantity: sanitizeNumber(values[1]),
      company: sanitizeString(values[2]),
      customer: sanitizeString(values[3]),
      createdAt: values[4],
      updatedAt: values[5],
    };

    try {
      const validated = itemSchema.parse(rawData);
      return {
        id: Math.random().toString(36).substr(2, 9),
        ...validated,
        deleted: false,
      };
    } catch (error) {
      console.error('Invalid item data:', error);
      throw new Error(`Invalid item data in CSV: ${error.message}`);
    }
  });
};

export const importCompanies = async (file: File): Promise<Company[]> => {
  console.log('Starting companies import');
  const text = await file.text();
  const lines = text.split('\n').filter(line => line.trim());
  
  return lines.slice(1).map(line => {
    const [id, name] = line.split(',');
    const rawData = {
      id: sanitizeString(id),
      name: sanitizeString(name),
    };

    try {
      const validated = companySchema.parse(rawData);
      return {
        ...validated,
        deleted: false,
      };
    } catch (error) {
      console.error('Invalid company data:', error);
      throw new Error(`Invalid company data in CSV: ${error.message}`);
    }
  });
};

export const importCustomers = async (file: File): Promise<Customer[]> => {
  console.log('Starting customers import');
  const text = await file.text();
  const lines = text.split('\n').filter(line => line.trim());
  
  return lines.slice(1).map(line => {
    const [id, name, companyId] = line.split(',');
    const rawData = {
      id: sanitizeString(id),
      name: sanitizeString(name),
      companyId: sanitizeString(companyId),
    };

    try {
      const validated = customerSchema.parse(rawData);
      return {
        ...validated,
        deleted: false,
      };
    } catch (error) {
      console.error('Invalid customer data:', error);
      throw new Error(`Invalid customer data in CSV: ${error.message}`);
    }
  });
};