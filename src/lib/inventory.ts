import { Item, Company, Customer } from './types';

// Mock data for companies and customers
export let companies: Company[] = [
  { id: '1', name: 'Tech Corp' },
  { id: '2', name: 'Global Industries' },
  { id: '3', name: 'Local Supplies' },
];

export let customers: Customer[] = [
  { id: '1', name: 'John Smith', companyId: '1' },
  { id: '2', name: 'Alice Johnson', companyId: '2' },
  { id: '3', name: 'Bob Williams', companyId: '3' },
];

// In-memory storage for items
let items: Item[] = [];

export const addItem = (item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => {
  const newItem = {
    ...item,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  items.push(newItem);
  return newItem;
};

export const updateItemQuantity = (code: string, quantityChange: number) => {
  const item = items.find((i) => i.code === code);
  if (!item) return null;
  
  item.quantity += quantityChange;
  item.updatedAt = new Date();
  return item;
};

export const findItemByCode = (code: string) => {
  return items.find((i) => i.code === code);
};

export const getAllItems = () => {
  return [...items];
};

// Company management
export const addCompany = (name: string): Company => {
  const newCompany = {
    id: Math.random().toString(36).substr(2, 9),
    name,
  };
  companies.push(newCompany);
  return newCompany;
};

export const deleteCompany = (id: string) => {
  companies = companies.filter(company => company.id !== id);
};

// Customer management
export const addCustomer = (name: string, companyId: string): Customer => {
  const newCustomer = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    companyId,
  };
  customers.push(newCustomer);
  return newCustomer;
};

export const deleteCustomer = (id: string) => {
  customers = customers.filter(customer => customer.id !== id);
};