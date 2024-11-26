import { v4 as uuidv4 } from 'uuid';
import { addCustomer } from './customerService';
import { addItem } from './itemService';
import { toast } from 'sonner';

const VALID_DESCRIPTIONS = ['Příslušenství', 'Plechy', 'Žaluzie', 'Vodící profily'];

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
  let currentCustomerName = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines and headers
    if (!line || line.includes('Číslo zakázky - Značka Popis') || line.includes('Počet balíků:')) {
      continue;
    }

    // Check if this is an order number line (24ZA...)
    if (line.includes('24ZA')) {
      // Find the index of the first valid description
      const descriptionIndex = line.split(' ').findIndex(part => VALID_DESCRIPTIONS.includes(part));
      if (descriptionIndex === -1) continue;

      // Everything before the description is the customer name
      const orderParts = line.split(' ').slice(0, descriptionIndex);
      const orderInfo = orderParts.join(' ');
      
      // Extract order number and brand
      const dashIndex = orderInfo.indexOf(' - ');
      if (dashIndex !== -1) {
        currentOrder = orderInfo.substring(0, dashIndex).trim();
        currentCustomerName = orderInfo;
        currentBrand = orderInfo.substring(dashIndex + 3).trim();
      }
      
      // Parse the rest of the line for item details
      const itemParts = line.split(' ').slice(descriptionIndex);
      const description = VALID_DESCRIPTIONS.find(desc => itemParts.includes(desc)) || '';
      const remainingParts = itemParts.slice(itemParts.indexOf(description) + 1);
      const [length, width, height] = remainingParts.slice(0, 3).map(Number);
      const packageNumber = remainingParts[3] || '';
      
      console.log('Parsed order line:', {
        orderNumber: currentOrder,
        customerName: currentCustomerName,
        description,
        dimensions: { length, width, height },
        packageNumber
      });
      
      if (packageNumber) {
        items.push({
          orderNumber: currentCustomerName,
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
      const description = parts.slice(0, -3)
        .find(part => VALID_DESCRIPTIONS.includes(part)) || '';
      
      console.log('Parsed continuation line:', {
        orderNumber: currentOrder,
        customerName: currentCustomerName,
        description,
        dimensions: { length, width, height },
        packageNumber
      });
      
      if (packageNumber) {
        items.push({
          orderNumber: currentCustomerName,
          brand: currentBrand,
          description,
          length,
          width,
          height,
          packageNumber
        });
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
      const customer = await addCustomer(order);
      console.log('Created customer:', customer);
      customerMap.set(order, customer.id);
    }
  }

  // Create items
  const createdItems = [];
  const duplicates = [];
  
  for (const item of parsedItems) {
    console.log(`Creating item for package: ${item.packageNumber}`);
    const customerId = customerMap.get(item.orderNumber);
    
    if (customerId) {
      try {
        const newItem = await addItem({
          id: uuidv4(),
          code: item.packageNumber,
          company: "1",
          customer: customerId,
          description: item.description,
          length: item.length,
          width: item.width,
          height: item.height,
          status: 'waiting', // Always set status to 'waiting' (Čaká na dovoz)
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          deleted: false
        });
        console.log('Created item:', newItem);
        createdItems.push(newItem);
      } catch (error) {
        if (error instanceof Error && error.message === 'Item with this code already exists') {
          duplicates.push(item.packageNumber);
        } else {
          throw error;
        }
      }
    }
  }

  console.log('Mass import completed. Total items created:', createdItems.length);
  
  if (duplicates.length > 0) {
    toast.warning(`${duplicates.length} položiek nebolo importovaných (duplicitné kódy)`);
  }
  
  if (createdItems.length > 0) {
    toast.success(`Úspešne importovaných ${createdItems.length} položiek`);
  }
  
  return createdItems;
};
