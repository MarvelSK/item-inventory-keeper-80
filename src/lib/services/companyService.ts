import { Company } from '../models/types';
import { cache } from '../cache';

export let companies: Company[] = [
  { id: '1', name: 'Tech Corp', deleted: false },
  { id: '2', name: 'Global Industries', deleted: false },
  { id: '3', name: 'Local Supplies', deleted: false },
];

export const addCompany = async (name: string): Promise<Company> => {
  const newCompany = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    deleted: false,
  };
  companies.push(newCompany);
  return newCompany;
};

export const deleteCompany = async (id: string): Promise<void> => {
  const company = companies.find(company => company.id === id);
  if (company) {
    company.deleted = true;
  }
};

export const getActiveCompanies = async (): Promise<Company[]> => {
  const cachedCompanies = cache.get<Company[]>('companies');
  if (cachedCompanies) {
    return cachedCompanies.filter(company => !company.deleted);
  }
  
  cache.set('companies', companies);
  return companies.filter(company => !company.deleted);
};

export const wipeCompanies = async () => {
  companies = [];
  cache.set('companies', companies);
};