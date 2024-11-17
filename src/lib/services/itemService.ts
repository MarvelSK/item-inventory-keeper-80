import { Item } from '../models/types';
import { cache } from '../cache';

let items: Item[] = [];

export const addItem = async (item: Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'deleted'>) => {
  console.log('Adding new item:', item);
  const newItem = {
    ...item,
    id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date(),
    updatedAt: new Date(),
    deleted: false,
  };
  items.push(newItem);
  cache.set('items', items);
  console.log('Item added successfully:', newItem);
  return newItem;
};

export const updateItem = async (updatedItem: Item) => {
  console.log('Updating item:', updatedItem);
  const index = items.findIndex((item) => item.id === updatedItem.id);
  if (index !== -1) {
    items[index] = {
      ...updatedItem,
      updatedAt: new Date(),
    };
    cache.set('items', items);
    console.log('Item updated successfully:', items[index]);
    return items[index];
  }
  console.log('Item not found for update:', updatedItem.id);
  return null;
};

export const updateItemQuantity = async (id: string, quantity: number) => {
  console.log('Updating item quantity:', { id, quantity });
  const item = items.find(item => item.id === id);
  if (item) {
    item.quantity = quantity;
    item.updatedAt = new Date();
    cache.set('items', items);
    console.log('Item quantity updated successfully:', item);
    return item;
  }
  console.log('Item not found for quantity update:', id);
  return null;
};

export const findItemByCode = async (code: string) => {
  console.log('Finding item by code:', code);
  const item = items.find((i) => i.code === code && !i.deleted);
  console.log('Item found:', item);
  return item;
};

export const deleteItem = async (id: string) => {
  console.log('Deleting item:', id);
  const item = items.find(item => item.id === id);
  if (item) {
    item.deleted = true;
    item.updatedAt = new Date();
    cache.set('items', items);
    console.log('Item marked as deleted:', item);
  }
};

export const getAllItems = async () => {
  console.log('Fetching all items');
  const cachedItems = cache.get<Item[]>('items');
  if (cachedItems) {
    console.log('Returning cached items:', cachedItems.length);
    return cachedItems.filter(item => !item.deleted);
  }
  
  const activeItems = items.filter(item => !item.deleted);
  cache.set('items', activeItems);
  console.log('Returning fresh items:', activeItems.length);
  return activeItems;
};

export const wipeItems = async () => {
  console.log('Wiping all items');
  items = [];
  cache.set('items', items);
  console.log('Items wiped successfully');
};