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
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
      tags: item.tags || [],
      deleted: false
    }));
    items.push(...itemSchema.array().parse(parsedItems));
  }

  if (data.companies) {
    const parsedCompanies = data.companies.map((company: any) => ({
      ...company,
      id: company.id || uuidv4(),
      deleted: false
    }));
    companies.push(...companySchema.array().parse(parsedCompanies));
  }

  if (data.customers) {
    const parsedCustomers = data.customers.map((customer: any) => ({
      ...customer,
      id: customer.id || uuidv4(),
      tags: customer.tags || [],
      deleted: false
    }));
    customers.push(...customerSchema.array().parse(parsedCustomers));
  }
};

export const wipeAll = async () => {
  await wipeItems();
  await wipeCompanies();
  await wipeCustomers();
};