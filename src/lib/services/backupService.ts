import { Item, Company, Customer } from '../types';
import { addItem, wipeItems } from './itemService';
import { addCompany, wipeCompanies } from './companyService';
import { addCustomer, wipeCustomers } from './customerService';
import { v4 as uuidv4 } from 'uuid';

export const exportData = () => {
  const items = localStorage.getItem('items');
  const companies = localStorage.getItem('companies');
  const customers = localStorage.getItem('customers');

  const data = {
    items: items ? JSON.parse(items) : [],
    companies: companies ? JSON.parse(companies) : [],
    customers: customers ? JSON.parse(customers) : [],
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `backup-${new Date().toISOString()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importData = async (jsonData: string) => {
  try {
    const data = JSON.parse(jsonData);
    
    // Validate data structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data format');
    }

    // Process items
    if (Array.isArray(data.items)) {
      await wipeItems();
      for (const item of data.items) {
        const newItem: Item = {
          id: item.id || uuidv4(),
          code: item.code || '',
          company: item.company || '',
          customer: item.customer || '',
          description: item.description || '',
          length: item.length || undefined,
          width: item.width || undefined,
          height: item.height || undefined,
          status: item.status || 'waiting',
          tags: Array.isArray(item.tags) ? item.tags : [],
          createdAt: new Date(item.createdAt || Date.now()),
          updatedAt: new Date(item.updatedAt || Date.now()),
          deleted: item.deleted || false
        };
        await addItem(newItem);
      }
    }

    // Process companies
    if (Array.isArray(data.companies)) {
      await wipeCompanies();
      for (const company of data.companies) {
        const newCompany: Company = {
          id: company.id || uuidv4(),
          name: company.name || '',
          deleted: company.deleted || false
        };
        await addCompany(newCompany);
      }
    }

    // Process customers
    if (Array.isArray(data.customers)) {
      await wipeCustomers();
      for (const customer of data.customers) {
        const newCustomer: Customer = {
          id: customer.id || uuidv4(),
          name: customer.name || '',
          tags: Array.isArray(customer.tags) ? customer.tags.map((tag: any) => ({
            id: tag.id || uuidv4(),
            name: tag.name || '',
            color: tag.color || '#000000'
          })) : [],
          deleted: customer.deleted || false
        };
        await addCustomer(newCustomer);
      }
    }

    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    throw error;
  }
};

export const importLegacyData = async (jsonData: string) => {
  try {
    const data = JSON.parse(jsonData);
    
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data format');
    }

    // Process items
    if (Array.isArray(data.items)) {
      await wipeItems();
      for (const item of data.items) {
        const newItem: Item = {
          id: item.id || uuidv4(),
          code: item.code || '',
          company: item.company || '',
          customer: item.customer || '',
          description: item.description || '',
          length: item.length || undefined,
          width: item.width || undefined,
          height: item.height || undefined,
          status: 'waiting',
          tags: Array.isArray(item.tags) ? item.tags : [],
          createdAt: new Date(item.createdAt || Date.now()),
          updatedAt: new Date(item.updatedAt || Date.now()),
          deleted: item.deleted || false
        };
        await addItem(newItem);
      }
    }

    // Process companies
    if (Array.isArray(data.companies)) {
      await wipeCompanies();
      for (const company of data.companies) {
        const newCompany: Company = {
          id: company.id || uuidv4(),
          name: company.name || '',
          deleted: company.deleted || false
        };
        await addCompany(newCompany);
      }
    }

    // Process customers
    if (Array.isArray(data.customers)) {
      await wipeCustomers();
      for (const customer of data.customers) {
        const newCustomer: Customer = {
          id: customer.id || uuidv4(),
          name: customer.name || '',
          tags: Array.isArray(customer.tags) ? customer.tags.map((tag: any) => ({
            id: tag.id || uuidv4(),
            name: tag.name || '',
            color: tag.color || '#000000'
          })) : [],
          deleted: customer.deleted || false
        };
        await addCustomer(newCustomer);
      }
    }

    return true;
  } catch (error) {
    console.error('Error importing legacy data:', error);
    throw error;
  }
};