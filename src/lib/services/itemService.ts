import { Item } from '../models/types';
import { cache } from '../cache';

let items: Item[] = [];

const areItemsEqual = (item1: Item, item2: Item) => {
  return (
    item1.code === item2.code &&
    item1.company === item2.company &&
    item1.customer === item2.customer &&
    item1.description === item2.description &&
    item1.length === item2.length &&
    item1.width === item2.width &&
    item1.height === item2.height
  );
};

export const addItem = async (item: Item) => {
  console.log('Adding new item:', item);
  
  // Check for existing item with same attributes
  const existingItem = items.find(i => !i.deleted && areItemsEqual(i, item));
  
  if (existingItem) {
    console.log('Found existing item, updating quantity:', existingItem);
    existingItem.quantity += item.quantity;
    existingItem.updatedAt = new Date();
    cache.set('items', items);
    return existingItem;
  }

  items.push(item);
  cache.set('items', items);
  console.log('Current items count after adding:', items.length);
  console.log('Item added successfully:', item);
  return item;
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
    console.log('Active cached items:', cachedItems.filter(item => !item.deleted).length);
    return cachedItems.filter(item => !item.deleted);
  }
  
  const activeItems = items.filter(item => !item.deleted);
  console.log('No cached items found, returning from memory:', activeItems.length);
  cache.set('items', activeItems);
  return activeItems;
};

export const wipeItems = async () => {
  console.log('Wiping all items');
  items = [];
  cache.set('items', items);
  console.log('Items wiped successfully');
};
