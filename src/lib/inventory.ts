import { Item, Company, Customer } from './types';

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
  return newItem;
};

export const updateItem = (updatedItem: Item) => {
  const index = items.findIndex((item) => item.id === updatedItem.id);
  if (index !== -1) {
    items[index] = {
      ...updatedItem,
      updatedAt: new Date(),
    };
    return items[index];
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

export const wipeInventory = () => {
  items.forEach(item => {
    item.deleted = true;
    item.updatedAt = new Date();
  });
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
  return items.filter(item => !item.deleted);
};

export const getActiveCompanies = () => {
  return companies.filter(company => !company.deleted);
};

export const getActiveCustomers = () => {
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

export const wipeInventory = () => {
  items = [];
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

