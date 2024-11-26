import { v4 as uuidv4 } from 'uuid';
import { addCustomer } from './customerService';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';
import { Item } from '../types';

const VALID_DESCRIPTIONS = ['Příslušenství', 'Plechy', 'Žaluzie', 'Vodící profily'];
const BATCH_SIZE = 50; // Process items in batches of 50

interface ParsedItem {
  code: string;
  description: string;
  length: number;
  width: number;
  height: number;
  orderInfo: string;
}

const parseItems = (data: string): ParsedItem[] => {
  console.log('Starting to parse items from data');
  const lines = data.split('\n');
  const items: ParsedItem[] = [];
  
  let currentOrderInfo = '';
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // Skip irrelevant lines
    if (
      trimmedLine.startsWith('NEVA') ||
      trimmedLine.startsWith('BALÍCÍ LIST') ||
      trimmedLine.includes('24DL') ||
      trimmedLine.startsWith('Počet balíků:')
    ) {
      continue;
    }

    // Check if this is an order header line
    if (trimmedLine.includes('24ZA')) {
      const orderMatch = trimmedLine.match(/24ZA\d+\s*-\s*[^]+?(?=\s+(?:Příslušenství|Plechy|Žaluzie|Vodící profily)|$)/);
      if (orderMatch) {
        currentOrderInfo = orderMatch[0].trim();
        
        // Parse the first item if it exists in the header line
        const itemMatch = trimmedLine.match(new RegExp(`(${VALID_DESCRIPTIONS.join('|')})\\s+(\\d+)\\s+(\\d+)\\s+(\\d+)\\s+(24P\\d+)`));
        if (itemMatch) {
          items.push({
            orderInfo: currentOrderInfo,
            description: itemMatch[1],
            length: parseInt(itemMatch[2]),
            width: parseInt(itemMatch[3]),
            height: parseInt(itemMatch[4]),
            code: itemMatch[5]
          });
        }
      }
      continue;
    }

    // Parse regular item lines
    const itemMatch = trimmedLine.match(new RegExp(`(${VALID_DESCRIPTIONS.join('|')})\\s+(\\d+)\\s+(\\d+)\\s+(\\d+)\\s+(24P\\d+)`));
    if (itemMatch && currentOrderInfo) {
      items.push({
        orderInfo: currentOrderInfo,
        description: itemMatch[1],
        length: parseInt(itemMatch[2]),
        width: parseInt(itemMatch[3]),
        height: parseInt(itemMatch[4]),
        code: itemMatch[5]
      });
    }
  }

  console.log('Parsed items:', items);
  return items;
};

const insertItemsBatch = async (items: Item[]) => {
  const { error } = await supabase
    .from('items')
    .insert(items);

  if (error) throw error;
};

export const importMassItems = async (
  data: string, 
  onProgress: (stage: string, progress: number) => void
) => {
  console.log('Starting mass import of items');
  onProgress('Parsing items', 0);
  
  const parsedItems = parseItems(data);
  if (parsedItems.length === 0) {
    toast.error('Neboli nájdené žiadne položky na import');
    return [];
  }

  const createdItems: Item[] = [];
  const duplicates: string[] = [];
  const orderGroups = new Map<string, ParsedItem[]>();

  // Group items by order
  parsedItems.forEach(item => {
    const items = orderGroups.get(item.orderInfo) || [];
    items.push(item);
    orderGroups.set(item.orderInfo, items);
  });

  const totalOrders = orderGroups.size;
  let processedOrders = 0;

  // Process each order
  for (const [orderInfo, items] of orderGroups) {
    try {
      onProgress('Creating customers', (processedOrders / totalOrders) * 100);
      
      // Create customer for the order
      const customer = await addCustomer(orderInfo);
      
      // Prepare items for batch insert
      const itemBatches: Item[][] = [];
      const batchItems: Item[] = [];
      
      for (const item of items) {
        const newItem: Item = {
          id: uuidv4(),
          code: item.code,
          customer: customer.id,
          description: item.description,
          length: item.length,
          width: item.width,
          height: item.height,
          status: 'waiting',
          tags: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          deleted: false
        };
        
        batchItems.push(newItem);
        
        if (batchItems.length === BATCH_SIZE) {
          itemBatches.push([...batchItems]);
          batchItems.length = 0;
        }
      }
      
      if (batchItems.length > 0) {
        itemBatches.push(batchItems);
      }

      // Insert batches
      for (let i = 0; i < itemBatches.length; i++) {
        const progress = ((processedOrders / totalOrders) * 100) + 
          ((i / itemBatches.length) * (100 / totalOrders));
        onProgress('Importing items', progress);
        
        try {
          await insertItemsBatch(itemBatches[i]);
          createdItems.push(...itemBatches[i]);
        } catch (error) {
          console.error('Error in batch insert:', error);
          const failedCodes = itemBatches[i].map(item => item.code);
          duplicates.push(...failedCodes);
        }
      }

    } catch (error) {
      console.error('Error processing order:', error);
    }
    
    processedOrders++;
  }

  onProgress('Completing import', 100);
  
  if (duplicates.length > 0) {
    toast.warning(`${duplicates.length} položiek nebolo importovaných (duplicitné kódy)`);
  }
  
  if (createdItems.length > 0) {
    toast.success(`Úspešne importovaných ${createdItems.length} položiek`);
  }
  
  return createdItems;
};