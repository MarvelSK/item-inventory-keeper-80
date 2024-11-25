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
  quantity: z.number(),
  company: z.string(),
  customer: z.string(),
  description: z.string().optional(),
  length: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  tags: z.array(tagSchema),
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
      ...item,
      id: item.id || uuidv4(),
      code: item.code || '',
      quantity: item.quantity || 0,
      company: item.company || '',
      customer: item.customer || '',
      tags: item.tags || [],
      createdAt: new Date(item.createdAt || Date.now()),
      updatedAt: new Date(item.updatedAt || Date.now()),
      deleted: false
    }));
    const validatedItems = itemSchema.array().parse(parsedItems);
    items.push(...validatedItems);
  }

  if (data.companies) {
    const parsedCompanies = data.companies.map((company: any) => ({
      ...company,
      id: company.id || uuidv4(),
      name: company.name || '',
      deleted: false
    }));
    const validatedCompanies = companySchema.array().parse(parsedCompanies);
    companies.push(...validatedCompanies);
  }

  if (data.customers) {
    const parsedCustomers = data.customers.map((customer: any) => ({
      ...customer,
      id: customer.id || uuidv4(),
      name: customer.name || '',
      tags: customer.tags || [],
      deleted: false
    }));
    const validatedCustomers = customerSchema.array().parse(parsedCustomers);
    customers.push(...validatedCustomers);
  }
};

export const wipeAll = async () => {
  await wipeItems();
  await wipeCompanies();
  await wipeCustomers();
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
    ...item,
    id: item.id || uuidv4(),
    createdAt: new Date(item.createdAt || Date.now()),
    updatedAt: new Date(item.updatedAt || Date.now()),
    deleted: false
  }));
  const validatedItems = itemSchema.array().parse(parsedItems);
  items.push(...validatedItems);
};

export const importCompanies = async (file: File) => {
  const text = await file.text();
  const data = JSON.parse(text);
  const parsedCompanies = data.map((company: any) => ({
    ...company,
    id: company.id || uuidv4(),
    deleted: false
  }));
  const validatedCompanies = companySchema.array().parse(parsedCompanies);
  companies.push(...validatedCompanies);
};

export const importCustomers = async (file: File) => {
  const text = await file.text();
  const data = JSON.parse(text);
  const parsedCustomers = data.map((customer: any) => ({
    ...customer,
    id: customer.id || uuidv4(),
    tags: customer.tags || [],
    deleted: false
  }));
  const validatedCustomers = customerSchema.array().parse(parsedCustomers);
  customers.push(...validatedCustomers);
};