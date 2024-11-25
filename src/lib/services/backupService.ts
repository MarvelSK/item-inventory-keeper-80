import { Item, Company, Customer } from '../models/types';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const itemSchema = z.object({
  id: z.string(),
  code: z.string(),
  quantity: z.number(),
  company: z.string(),
  customer: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deleted: z.boolean(),
});

const companySchema = z.object({
  id: z.string(),
  name: z.string(),
  deleted: z.boolean(),
});

const customerSchema = z.object({
  id: z.string(),
  name: z.string(),
  companyId: z.string(),
  deleted: z.boolean(),
});

// Data sanitization functions
const sanitizeString = (str: string): string => {
  return (str || '').trim().replace(/[<>]/g, '');
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

const downloadCsv = (content: string, type: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${type}_backup_${new Date().toISOString()}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const importInventory = async (file: File): Promise<Item[]> => {
  console.log('Starting inventory import');
  const text = await file.text();
  const lines = text.split('\n').filter(line => line.trim());
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    const item: Item = {
      id: sanitizeString(values[0]) || uuidv4(),
      code: sanitizeString(values[1]) || '',
      quantity: sanitizeNumber(values[2]),
      company: sanitizeString(values[3]) || '',
      customer: sanitizeString(values[4]) || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      deleted: false
    };

    try {
      return itemSchema.parse(item);
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
    const [rawId, rawName] = line.split(',');
    const company: Company = {
      id: sanitizeString(rawId) || uuidv4(),
      name: sanitizeString(rawName) || '',
      deleted: false
    };

    try {
      return companySchema.parse(company);
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
    const [rawId, rawName, rawCompanyId] = line.split(',');
    const customer: Customer = {
      id: sanitizeString(rawId) || uuidv4(),
      name: sanitizeString(rawName) || '',
      companyId: sanitizeString(rawCompanyId) || '',
      deleted: false
    };

    try {
      return customerSchema.parse(customer);
    } catch (error) {
      console.error('Invalid customer data:', error);
      throw new Error(`Invalid customer data in CSV: ${error.message}`);
    }
  });
};