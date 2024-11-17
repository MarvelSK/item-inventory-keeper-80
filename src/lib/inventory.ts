import { Item, Company, Customer } from './types';
import { cache } from './cache';

// Mock data for companies and customers
export let companies: Company[] = [
  { id: '1', name: 'Tech Corp', deleted: false },
  { id: '2', name: 'Global Industries', deleted: false },
  { id: '3', name: 'Local Supplies', deleted: false },
];

export let customers: Customer[] = [
  { id: '1', name: 'John Smith', companyId: '1', deleted: false },
  { id: '2', name: 'Alice Johnson', companyId: '2', deleted: false },
  { id: '3', name: 'Bob Williams', companyId: '3', deleted: false },
];

let items: Item[] = [];

export const addItem = (item: Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'deleted'>) => {
  const newItem = {
    ...item,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date(),
    updatedAt: new Date(),
    deleted: false,
  };
  items.push(newItem);
  cache.set('items', items);
  return newItem;
};

export const updateItem = (updatedItem: Item) => {
  const index = items.findIndex((item) => item.id === updatedItem.id);
  if (index !== -1) {
    items[index] = {
      ...updatedItem,
      updatedAt: new Date(),
    };
    cache.set('items', items);
    return items[index];
  }
  return null;
};

export const updateItemQuantity = (id: string, quantity: number) => {
  const item = items.find(item => item.id === id);
  if (item) {
    item.quantity = quantity;
    item.updatedAt = new Date();
    cache.set('items', items);
    return item;
  }
  return null;
};

export const findItemByCode = (code: string) => {
  return items.find((i) => i.code === code && !i.deleted);
};

export const deleteItem = (id: string) => {
  const item = items.find(item => item.id === id);
  if (item) {
    item.deleted = true;
    item.updatedAt = new Date();
    cache.set('items', items);
  }
};

export const deleteCompany = (id: string) => {
  const company = companies.find(company => company.id === id);
  if (company) {
    company.deleted = true;
  }
};

export const deleteCustomer = (id: string) => {
  const customer = customers.find(customer => customer.id === id);
  if (customer) {
    customer.deleted = true;
  }
};

export const wipeInventory = (hardDelete: boolean = false) => {
  if (hardDelete) {
    items = [];
  } else {
    items.forEach(item => {
      item.deleted = true;
      item.updatedAt = new Date();
    });
  }
  cache.set('items', items);
};

export const wipeCompanies = () => {
  companies.forEach(company => {
    company.deleted = true;
  });
};

export const wipeCustomers = () => {
  customers.forEach(customer => {
    customer.deleted = true;
  });
};

// Update getter functions to filter out deleted items
export const getAllItems = () => {
  const cachedItems = cache.get<Item[]>('items');
  if (cachedItems) {
    return cachedItems.filter(item => !item.deleted);
  }
  
  const items = items.filter(item => !item.deleted);
  cache.set('items', items);
  return items;
};

export const getActiveCompanies = () => {
  const cachedCompanies = cache.get<Company[]>('companies');
  if (cachedCompanies) {
    return cachedCompanies.filter(company => !company.deleted);
  }
  
  cache.set('companies', companies);
  return companies.filter(company => !company.deleted);
};

export const getActiveCustomers = () => {
  const cachedCustomers = cache.get<Customer[]>('customers');
  if (cachedCustomers) {
    return cachedCustomers.filter(customer => !customer.deleted);
  }
  
  cache.set('customers', customers);
  return customers.filter(customer => !customer.deleted);
};

export const backupInventory = () => {
  const csvContent = items.map(item => 
    `${item.code},${item.quantity},${item.company},${item.customer},${item.createdAt.toISOString()},${item.updatedAt.toISOString()}`
  ).join('\n');
  
  const blob = new Blob([`code,quantity,company,customer,createdAt,updatedAt\n${csvContent}`], 
    { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `inventory_backup_${new Date().toISOString()}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const importInventory = async (file: File) => {
  const text = await file.text();
  const lines = text.split('\n');
  const headers = lines[0].split(',');
  
  items = lines.slice(1).map(line => {
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
  
  return items;
};

// Company management
export const addCompany = (name: string): Company => {
  const newCompany = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    deleted: false,
  };
  companies.push(newCompany);
  return newCompany;
};

// Customer management
export const addCustomer = (name: string, companyId: string): Customer => {
  const newCustomer = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    companyId,
    deleted: false,
  };
  customers.push(newCustomer);
  return newCustomer;
};
