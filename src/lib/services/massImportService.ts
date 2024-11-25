import { v4 as uuidv4 } from 'uuid';
import { addCustomer } from './customerService';
import { addItem } from './itemService';

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
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines and headers
    if (!line || line.includes('Číslo zakázky - Značka Popis') || line.includes('Počet balíků:')) {
      continue;
    }

    // Check if this is an order number line (24ZA...)
    if (line.includes('24ZA')) {
      const parts = line.split(' ');
      const orderInfo = parts.filter(part => part.includes('24ZA')).join(' ');
      if (orderInfo) {
        const [orderNumber, brand] = orderInfo.split(' - ');
        currentOrder = orderNumber;
        currentBrand = brand;
        
        // Extract item details from the same line
        const description = parts.slice(parts.findIndex(p => p === brand) + 1, -4).join(' ');
        const dimensions = parts.slice(-4);
        const packageNumber = dimensions.pop() || '';
        const [length, width, height] = dimensions.map(Number);
        
        console.log('Parsed order line:', {
          orderNumber: currentOrder,
          brand: currentBrand,
          description,
          dimensions: { length, width, height },
          packageNumber
        });
        
        items.push({
          orderNumber: `${currentOrder} - ${currentBrand}`,
          brand: currentBrand,
          description,
          length,
          width,
          height,
          packageNumber
        });
      }
    } else if (currentOrder && !line.includes('Počet')) {
      // This is a continuation line with additional items
      const parts = line.split(' ');
      const packageNumber = parts.pop() || '';
      const [height, width, length] = parts.slice(-3).map(Number);
      const description = parts.slice(0, -3).join(' ');
      
      console.log('Parsed continuation line:', {
        orderNumber: currentOrder,
        brand: currentBrand,
        description,
        dimensions: { length, width, height },
        packageNumber
      });
      
      items.push({
        orderNumber: `${currentOrder} - ${currentBrand}`,
        brand: currentBrand,
        description,
        length,
        width,
        height,
        packageNumber
      });
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
        company: "1", // Using default company ID "Nezaradené"
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