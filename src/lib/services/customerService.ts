import { Customer } from '../models/types';
import { cache } from '../cache';

export let customers: Customer[] = [
  { id: '1', name: 'John Smith', labels: [], deleted: false },
  { id: '2', name: 'Alice Johnson', labels: [], deleted: false },
  { id: '3', name: 'Bob Williams', labels: [], deleted: false },
];

export const addCustomer = async (name: string): Promise<Customer> => {
  const newCustomer: Customer = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    labels: [],
    deleted: false,
  };
  customers.push(newCustomer);
  return newCustomer;
};

export const deleteCustomer = async (id: string): Promise<void> => {
  const customer = customers.find(customer => customer.id === id);
  if (customer) {
    customer.deleted = true;
  }
};

export const getActiveCustomers = async (): Promise<Customer[]> => {
  const cachedCustomers = cache.get<Customer[]>('customers');
  if (cachedCustomers) {
    return cachedCustomers.filter(customer => !customer.deleted);
  }
  
  cache.set('customers', customers);
  return customers.filter(customer => !customer.deleted);
};

export const wipeCustomers = async () => {
  customers = [];
  cache.set('customers', customers);
};