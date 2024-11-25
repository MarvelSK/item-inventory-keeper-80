import { v4 as uuidv4 } from 'uuid';
import { addCustomer, addItem } from './index';

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
  let currentDescription = '';
  let currentDimensions = { length: 0, width: 0, height: 0 };
  let currentPackage = '';

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip empty lines and headers
    if (!trimmedLine || trimmedLine.includes('Číslo zakázky') || trimmedLine.includes('Počet balíků')) {
      continue;
    }

    // Check if this is an order number line (24ZA...)
    if (trimmedLine.includes('24ZA')) {
      currentOrder = trimmedLine;
      console.log('Found order:', currentOrder);
      continue;
    }

    // Description line
    if (currentOrder && !currentDescription && !trimmedLine.startsWith('24P')) {
      currentDescription = trimmedLine;
      console.log('Found description:', currentDescription);
      continue;
    }

    // Parse dimensions
    const numbers = trimmedLine.match(/\d+/g);
    if (numbers && numbers.length >= 3 && currentDescription) {
      currentDimensions = {
        length: parseInt(numbers[0]),
        width: parseInt(numbers[1]),
        height: parseInt(numbers[2])
      };
      console.log('Found dimensions:', currentDimensions);
      continue;
    }

    // Package number (24P...)
    if (trimmedLine.startsWith('24P')) {
      currentPackage = trimmedLine;
      console.log('Found package number:', currentPackage);
      
      // When we have all the data, create an item
      if (currentOrder && currentDescription && currentPackage) {
        const parsedItem = {
          orderNumber: currentOrder,
          brand: currentOrder, // Using the full order number as brand/customer name
          description: currentDescription,
          length: currentDimensions.length,
          width: currentDimensions.width,
          height: currentDimensions.height,
          packageNumber: currentPackage
        };
        console.log('Created parsed item:', parsedItem);
        items.push(parsedItem);
        
        // Reset for next item
        currentDescription = '';
        currentDimensions = { length: 0, width: 0, height: 0 };
        currentPackage = '';
      }
    }
  }

  console.log('Total parsed items:', items.length);
  return items;
};

export const importMassItems = async (data: string) => {
  console.log('Starting mass import of items');
  const parsedItems = parseItems(data);
  
  // Get unique order numbers to create customers
  const uniqueOrders = [...new Set(parsedItems.map(item => item.orderNumber))];
  console.log('Unique orders found:', uniqueOrders);
  
  // Create customers for each order
  const customerMap = new Map();
  for (const order of uniqueOrders) {
    if (order) {
      console.log(`Creating customer for order: ${order}`);
      const customer = await addCustomer(order, "1"); // Using default company ID
      console.log('Created customer:', customer);
      customerMap.set(order, customer.id);
    }
  }

  // Create items
  const createdItems = [];
  for (const item of parsedItems) {
    console.log(`Creating item for package: ${item.packageNumber}`);
    const customerId = customerMap.get(item.orderNumber);
    
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