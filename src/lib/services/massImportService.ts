import { addCustomer, addItem } from './index';
import { v4 as uuidv4 } from 'uuid';

interface ParsedItem {
  orderNumber: string;
  brand: string;
  description: string;
  length: number;
  width: number;
  height: number;
  packageNumber: string;
}

const parseItems = (data: string): ParsedItem[] => {
  console.log('Starting to parse items from data');
  const lines = data.split('\n');
  const items: ParsedItem[] = [];
  let currentOrder = '';
  let currentBrand = '';

  for (const line of lines) {
    // Skip empty lines and header lines
    if (!line.trim() || line.includes('Číslo zakázky') || line.includes('Počet balíků')) {
      continue;
    }

    // Check if this is an order number line
    if (line.includes('24ZA')) {
      const [orderWithBrand] = line.split(' - ');
      const brand = line.split(' - ')[1]?.trim() || '';
      currentOrder = orderWithBrand.trim();
      currentBrand = brand;
      console.log('Found new order:', { currentOrder, currentBrand });
      continue;
    }

    // Parse item data
    const parts = line.trim().split(/\s+/);
    if (parts.length >= 6) {
      const [description, length, width, height, , packageNumber] = parts;
      
      if (packageNumber && packageNumber.startsWith('24P')) {
        const parsedItem = {
          orderNumber: currentOrder,
          brand: currentBrand,
          description,
          length: Number(length),
          width: Number(width),
          height: Number(height),
          packageNumber
        };
        console.log('Parsed item:', parsedItem);
        items.push(parsedItem);
      }
    }
  }

  console.log('Total parsed items:', items.length);
  return items;
};

export const importMassItems = async (data: string) => {
  console.log('Starting mass import of items');
  const parsedItems = parseItems(data);
  
  // Get unique brands to create customers
  const uniqueBrands = [...new Set(parsedItems.map(item => item.brand))];
  console.log('Unique brands found:', uniqueBrands);
  
  // Create customers for each brand
  const customerMap = new Map();
  for (const brand of uniqueBrands) {
    if (brand) {
      console.log(`Creating customer for brand: ${brand}`);
      const customer = await addCustomer({
        id: uuidv4(),
        name: brand,
        companyId: "1", // Using default company ID
        deleted: false
      });
      console.log('Created customer:', customer);
      customerMap.set(brand, customer.id);
    }
  }

  // Create items
  const createdItems = [];
  for (const item of parsedItems) {
    console.log(`Creating item for package: ${item.packageNumber}`);
    const customerId = customerMap.get(item.brand);
    
    if (customerId) {
      const newItem = await addItem({
        id: uuidv4(),
        code: item.packageNumber,
        quantity: 1,
        company: "1", // Using default company ID
        customer: customerId,
        createdAt: new Date(),
        updatedAt: new Date(),
        deleted: false
      });
      console.log('Created item:', newItem);
      createdItems.push(newItem);
    }
  }

  console.log('Mass import completed. Total items created:', createdItems.length);
  return createdItems;
};