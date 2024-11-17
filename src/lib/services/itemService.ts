import { Item } from '../models/types';
import { cache } from '../cache';

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
  cache.set('items', items);
  return newItem;
};

export const updateItem = (updatedItem: Item) => {
  const index = items.findIndex((item) => item.id === updatedItem.id);
  if (index !== -1) {
    items[index] = {
      ...updatedItem,
      updatedAt: new Date(),
    };
    cache.set('items', items);
    return items[index];
  }
  return null;
};

export const updateItemQuantity = (id: string, quantity: number) => {
  const item = items.find(item => item.id === id);
  if (item) {
    item.quantity = quantity;
    item.updatedAt = new Date();
    cache.set('items', items);
    return item;
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
    cache.set('items', items);
  }
};

export const getAllItems = () => {
  const cachedItems = cache.get<Item[]>('items');
  if (cachedItems) {
    return cachedItems.filter(item => !item.deleted);
  }
  
  const activeItems = items.filter(item => !item.deleted);
  cache.set('items', activeItems);
  return activeItems;
};