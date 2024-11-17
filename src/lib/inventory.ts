import { Item } from './types';

// Mock data for companies and customers
export const companies = [
  { id: '1', name: 'Tech Corp' },
  { id: '2', name: 'Global Industries' },
  { id: '3', name: 'Local Supplies' },
];

export const customers = [
  { id: '1', name: 'John Smith' },
  { id: '2', name: 'Alice Johnson' },
  { id: '3', name: 'Bob Williams' },
];

// In-memory storage for items (replace with proper backend later)
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