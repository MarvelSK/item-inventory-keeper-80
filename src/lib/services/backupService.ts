import { Item, Company, Customer } from '../types';
import { cache } from '../cache';

const createBackupFile = async (data: any, filename: string) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const backupInventory = async (items: Item[]) => {
  try {
    const activeItems = items.filter(item => !item.archived);
    const archivedItems = items.filter(item => item.archived);
    
    // Backup active items
    await createBackupFile(activeItems, `inventory-active-${new Date().toISOString()}.json`);
    
    // Backup archived items if any exist
    if (archivedItems.length > 0) {
      await createBackupFile(archivedItems, `inventory-archived-${new Date().toISOString()}.json`);
    }
  } catch (error) {
    console.error('Error backing up inventory:', error);
    throw error;
  }
};

export const backupCompanies = async (companies: Company[]) => {
  try {
    await createBackupFile(companies, `companies-${new Date().toISOString()}.json`);
  } catch (error) {
    console.error('Error backing up companies:', error);
    throw error;
  }
};

export const backupCustomers = async (customers: Customer[]) => {
  try {
    await createBackupFile(customers, `customers-${new Date().toISOString()}.json`);
  } catch (error) {
    console.error('Error backing up customers:', error);
    throw error;
  }
};

export const importInventory = async (file: File) => {
  try {
    const text = await file.text();
    const items = JSON.parse(text);
    if (!Array.isArray(items)) throw new Error('Invalid inventory data format');
    
    // Convert dates back to Date objects
    const processedItems = items.map(item => ({
      ...item,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
      archiveDate: item.archiveDate ? new Date(item.archiveDate) : undefined
    }));
    
    cache.set('items', processedItems);
    return processedItems;
  } catch (error) {
    console.error('Error importing inventory:', error);
    throw error;
  }
};

export const importCompanies = async (file: File) => {
  try {
    const text = await file.text();
    const companies = JSON.parse(text);
    if (!Array.isArray(companies)) throw new Error('Invalid companies data format');
    cache.set('companies', companies);
    return companies;
  } catch (error) {
    console.error('Error importing companies:', error);
    throw error;
  }
};

export const importCustomers = async (file: File) => {
  try {
    const text = await file.text();
    const customers = JSON.parse(text);
    if (!Array.isArray(customers)) throw new Error('Invalid customers data format');
    cache.set('customers', customers);
    return customers;
  } catch (error) {
    console.error('Error importing customers:', error);
    throw error;
  }
};

// Combined operations
export const backupAll = async (items: Item[], companies: Company[], customers: Customer[]) => {
  await Promise.all([
    backupInventory(items),
    backupCompanies(companies),
    backupCustomers(customers)
  ]);
};

export const importAll = async (file: File) => {
  const data = JSON.parse(await file.text());
  if (data.items) await importInventory(new File([JSON.stringify(data.items)], 'items.json'));
  if (data.companies) await importCompanies(new File([JSON.stringify(data.companies)], 'companies.json'));
  if (data.customers) await importCustomers(new File([JSON.stringify(data.customers)], 'customers.json'));
};

export const wipeAll = async () => {
  cache.set('items', []);
  cache.set('companies', []);
  cache.set('customers', []);
};