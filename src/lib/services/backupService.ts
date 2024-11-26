import { Item, Company, Customer, Tag } from '../types';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { items } from './itemService';
import { companies } from './companyService';
import { customers } from './customerService';
import { wipeItems, wipeCompanies, wipeCustomers } from './index';

const tagSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
});

const itemSchema = z.object({
  id: z.string(),
  code: z.string(),
  company: z.string(),
  customer: z.string(),
  description: z.string().optional(),
  length: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  status: z.enum(['waiting', 'in_stock', 'in_transit', 'delivered']),
  tags: z.array(tagSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
  deleted: z.boolean(),
});

const companySchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  deleted: z.boolean(),
});

const customerSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  tags: z.array(tagSchema),
  deleted: z.boolean(),
});

export const backupAll = async () => {
  const allData = {
    items,
    companies,
    customers
  };
  
  const csvContent = JSON.stringify(allData);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `backup_${new Date().toISOString()}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const importAll = async (file: File) => {
  const text = await file.text();
  const data = JSON.parse(text);

  if (data.items) {
    const parsedItems = data.items.map((item: any) => ({
      id: item.id || uuidv4(),
      code: item.code || '',
      quantity: item.quantity || 0,
      company: item.company || '',
      customer: item.customer || '',
      description: item.description || '',
      length: item.length,
      width: item.width,
      height: item.height,
      tags: item.tags || [],
      createdAt: new Date(item.createdAt || Date.now()),
      updatedAt: new Date(item.updatedAt || Date.now()),
      deleted: false
    } as Item));
    
    const validatedItems = itemSchema.array().parse(parsedItems);
    items.push(...validatedItems);
  }

  if (data.companies) {
    const parsedCompanies = data.companies.map((company: any) => ({
      id: company.id || uuidv4(),
      name: company.name || '',
      deleted: false
    } as Company));
    
    const validatedCompanies = companySchema.array().parse(parsedCompanies);
    companies.push(...validatedCompanies);
  }

  if (data.customers) {
    const parsedCustomers = data.customers.map((customer: any) => ({
      id: customer.id || uuidv4(),
      name: customer.name || '',
      tags: customer.tags || [],
      deleted: false
    } as Customer));
    
    const validatedCustomers = customerSchema.array().parse(parsedCustomers);
    customers.push(...validatedCustomers);
  }
};

export const wipeAll = async () => {
  try {
    await Promise.all([
      wipeItems(),
      wipeCompanies(),
      wipeCustomers()
    ]);
    console.log('All data wiped successfully');
  } catch (error) {
    console.error('Error wiping data:', error);
    throw error;
  }
};

export const backupInventory = async (items: Item[]) => {
  const csvContent = JSON.stringify(items);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `inventory_${new Date().toISOString()}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const backupCompanies = async (companies: Company[]) => {
  const csvContent = JSON.stringify(companies);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `companies_${new Date().toISOString()}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const backupCustomers = async (customers: Customer[]) => {
  const csvContent = JSON.stringify(customers);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `customers_${new Date().toISOString()}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
};

export const importInventory = async (file: File) => {
  const text = await file.text();
  const data = JSON.parse(text);
  const parsedItems = data.map((item: any) => ({
    id: item.id || uuidv4(),
    code: item.code || '',
    company: item.company || '',
    customer: item.customer || '',
    description: item.description || '',
    length: item.length,
    width: item.width,
    height: item.height,
    status: item.status || 'waiting',
    tags: item.tags || [],
    createdAt: new Date(item.createdAt || Date.now()),
    updatedAt: new Date(item.updatedAt || Date.now()),
    deleted: false
  } as Item));
  
  const validatedItems = itemSchema.array().parse(parsedItems);
  items.push(...validatedItems);
};

export const importCompanies = async (file: File) => {
  const text = await file.text();
  const data = JSON.parse(text);
  const parsedCompanies = data.map((company: any) => ({
    id: company.id || uuidv4(),
    name: company.name || '',
    deleted: false
  } as Company));
  
  const validatedCompanies = companySchema.array().parse(parsedCompanies);
  companies.push(...validatedCompanies);
};

export const importCustomers = async (file: File) => {
  const text = await file.text();
  const data = JSON.parse(text);
  const parsedCustomers = data.map((customer: any) => ({
    id: customer.id || uuidv4(),
    name: customer.name || '',
    tags: customer.tags || [],
    deleted: false
  } as Customer));
  
  const validatedCustomers = customerSchema.array().parse(parsedCustomers);
  customers.push(...validatedCustomers);
};
