import { Item, Company, Customer } from '../types';
import Papa from 'papaparse';

export const backupInventory = async (items: Item[]): Promise<void> => {
  const csv = Papa.unparse(items);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `inventory-backup-${new Date().toISOString()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const backupCompanies = async (companies: Company[]): Promise<void> => {
  const csv = Papa.unparse(companies);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `companies-backup-${new Date().toISOString()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const backupCustomers = async (customers: Customer[]): Promise<void> => {
  const csv = Papa.unparse(customers);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `customers-backup-${new Date().toISOString()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const importInventory = async (data: Item[] | File): Promise<Item[]> => {
  if (data instanceof File) {
    return new Promise((resolve, reject) => {
      Papa.parse(data, {
        header: true,
        complete: (results) => {
          const items: Item[] = results.data.map((row: any): Item => ({
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
          const companies: Company[] = results.data.map((row: any): Company => ({
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
          const customers: Customer[] = results.data.map((row: any): Customer => ({
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