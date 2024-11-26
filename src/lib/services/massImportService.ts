import { v4 as uuidv4 } from 'uuid';
import { addCustomer } from './customerService';
import { addItem } from './itemService';
import { toast } from 'sonner';

const VALID_DESCRIPTIONS = ['Příslušenství', 'Plechy', 'Žaluzie', 'Vodící profily'];

interface ParsedItem {
  code: string;
  description: string;
  length: number;
  width: number;
  height: number;
  orderInfo: string;
}

interface ParsedData {
  items: ParsedItem[];
  tags: Array<{
    tag: string;
    orderInfo: string;
  }>;
}

const parseItems = (data: string): ParsedData => {
  console.log('Starting to parse items from data');
  const lines = data.split('\n');
  const items: ParsedItem[] = [];
  const tags: Array<{tag: string; orderInfo: string}> = [];
  
  let currentOrderInfo = '';
  let parsingTags = false;
  let lastOrderInfo = '';
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // Start collecting tags after seeing BALÍCÍ LIST
    if (trimmedLine.includes('BALÍCÍ LIST')) {
      parsingTags = true;
      continue;
    }

    // If we're in tags section and line matches tag pattern (no numbers), collect it
    if (parsingTags && !trimmedLine.match(/\d/) && !trimmedLine.includes('NEVA')) {
      // Find the corresponding order info for this tag
      const orderInfos = items.reduce((acc: string[], item) => {
        if (!acc.includes(item.orderInfo)) {
          acc.push(item.orderInfo);
        }
        return acc;
      }, []);
      
      if (orderInfos[tags.length]) {
        tags.push({
          tag: trimmedLine,
          orderInfo: orderInfos[tags.length]
        });
      }
      continue;
    }

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
        lastOrderInfo = currentOrderInfo;
        
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
  console.log('Parsed tags:', tags);
  return { items, tags };
};

export const importMassItems = async (data: string) => {
  console.log('Starting mass import of items');
  const { items: parsedItems, tags } = parseItems(data);
  
  if (parsedItems.length === 0) {
    toast.error('Neboli nájdené žiadne položky na import');
    return [];
  }

  const createdItems = [];
  const duplicates = [];
  const orderGroups = new Map<string, ParsedItem[]>();

  // Group items by order
  parsedItems.forEach(item => {
    const items = orderGroups.get(item.orderInfo) || [];
    items.push(item);
    orderGroups.set(item.orderInfo, items);
  });

  // Process each order
  for (const [orderInfo, items] of orderGroups) {
    console.log(`Processing order: ${orderInfo} with ${items.length} items`);
    
    try {
      // First create the customer with just the name
      const customer = await addCustomer(orderInfo);
      console.log('Created customer:', customer);

      // Find matching tag for this order
      const matchingTag = tags.find(t => t.orderInfo === orderInfo);
      if (matchingTag) {
        customer.tags = [{
          id: uuidv4(),
          name: matchingTag.tag,
          color: `#${Math.floor(Math.random()*16777215).toString(16)}`
        }];
      }

      // Create items for the order
      for (const item of items) {
        try {
          const newItem = await addItem({
            id: uuidv4(),
            code: item.code,
            company: "1",
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
          });
          console.log('Created item:', newItem);
          createdItems.push(newItem);
        } catch (error) {
          if (error instanceof Error && error.message === 'Item with this code already exists') {
            duplicates.push(item.code);
          } else {
            console.error('Error creating item:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error processing order:', error);
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