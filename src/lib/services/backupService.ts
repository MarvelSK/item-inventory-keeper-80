import { Item, Company, Customer } from '../models/types';

const downloadCsv = (content: string, type: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${type}_backup_${new Date().toISOString()}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
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
  const text = await file.text();
  const lines = text.split('\n');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return {
      id: Math.random().toString(36).substr(2, 9),
      code: values[0],
      quantity: parseInt(values[1]),
      company: values[2],
      customer: values[3],
      createdAt: new Date(values[4]),
      updatedAt: new Date(values[5]),
      deleted: false,
    };
  });
};

export const importCompanies = async (file: File): Promise<Company[]> => {
  const text = await file.text();
  const lines = text.split('\n');
  
  return lines.slice(1).map(line => {
    const [id, name] = line.split(',');
    return {
      id,
      name,
      deleted: false,
    };
  });
};

export const importCustomers = async (file: File): Promise<Customer[]> => {
  const text = await file.text();
  const lines = text.split('\n');
  
  return lines.slice(1).map(line => {
    const [id, name, companyId] = line.split(',');
    return {
      id,
      name,
      companyId,
      deleted: false,
    };
  });
};