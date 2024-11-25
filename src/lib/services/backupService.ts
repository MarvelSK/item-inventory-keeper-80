import { Item, Company, Customer } from '../types';
import Papa from 'papaparse';

export const importInventory = async (data: Item[] | File): Promise<Item[]> => {
  if (data instanceof File) {
    return new Promise((resolve, reject) => {
      Papa.parse(data, {
        header: true,
        complete: (results) => {
          const items: Item[] = results.data.map((row: any) => ({
            id: Math.random().toString(36).substr(2, 9),
            code: row.code || '',
            quantity: parseInt(row.quantity || '0'),
            company: row.company || '',
            customer: row.customer || '',
            createdAt: new Date(),
            updatedAt: new Date(),
            deleted: false
          }));
          resolve(items);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }
  return data;
};

export const importCompanies = async (data: Company[] | File): Promise<Company[]> => {
  if (data instanceof File) {
    return new Promise((resolve, reject) => {
      Papa.parse(data, {
        header: true,
        complete: (results) => {
          const companies: Company[] = results.data.map((row: any) => ({
            id: Math.random().toString(36).substr(2, 9),
            name: row.name || '',
            deleted: false
          }));
          resolve(companies);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }
  return data;
};

export const importCustomers = async (data: Customer[] | File): Promise<Customer[]> => {
  if (data instanceof File) {
    return new Promise((resolve, reject) => {
      Papa.parse(data, {
        header: true,
        complete: (results) => {
          const customers: Customer[] = results.data.map((row: any) => ({
            id: Math.random().toString(36).substr(2, 9),
            name: row.name || '',
            companyId: row.companyId || '',
            deleted: false
          }));
          resolve(customers);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }
  return data;
};