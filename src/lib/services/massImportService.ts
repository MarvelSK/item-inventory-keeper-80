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
      continue;
    }

    // Parse item data
    const parts = line.trim().split(/\s+/);
    if (parts.length >= 6) {
      const [description, length, width, height, , packageNumber] = parts;
      
      if (packageNumber && packageNumber.startsWith('24P')) {
        items.push({
          orderNumber: currentOrder,
          brand: currentBrand,
          description,
          length: Number(length),
          width: Number(width),
          height: Number(height),
          packageNumber
        });
      }
    }
  }

  return items;
};

export const importMassItems = async (data: string) => {
  console.log('Starting mass import of items');
  const parsedItems = parseItems(data);
  
  // Get unique brands to create customers
  const uniqueBrands = [...new Set(parsedItems.map(item => item.brand))];
  
  // Create customers for each brand
  const customerMap = new Map();
  for (const brand of uniqueBrands) {
    if (brand) {
      console.log(`Creating customer for brand: ${brand}`);
      const customer = await addCustomer(brand, "1"); // Using default company ID "1"
      customerMap.set(brand, customer.id);
    }
  }

  // Create items
  for (const item of parsedItems) {
    console.log(`Creating item for package: ${item.packageNumber}`);
    const customerId = customerMap.get(item.brand);
    
    if (customerId) {
      await addItem({
        code: item.packageNumber,
        quantity: 1,
        company: "1", // Using default company ID
        customer: customerId,
      });
    }
  }

  console.log('Mass import completed');
};