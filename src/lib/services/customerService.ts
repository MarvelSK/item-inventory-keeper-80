import { Customer } from '../models/types';
import { cache } from '../cache';

export let customers: Customer[] = [
  { id: '1', name: 'John Smith', companyId: '1', deleted: false },
  { id: '2', name: 'Alice Johnson', companyId: '2', deleted: false },
  { id: '3', name: 'Bob Williams', companyId: '3', deleted: false },
];

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

export const deleteCustomer = (id: string) => {
  const customer = customers.find(customer => customer.id === id);
  if (customer) {
    customer.deleted = true;
  }
};

export const getActiveCustomers = () => {
  const cachedCustomers = cache.get<Customer[]>('customers');
  if (cachedCustomers) {
    return cachedCustomers.filter(customer => !customer.deleted);
  }
  
  cache.set('customers', customers);
  return customers.filter(customer => !customer.deleted);
};