import { Item } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

export const importItems = async (items: any[]) => {
  const now = new Date().toISOString();
  
  const formattedItems = items.map(item => ({
    ...item,
    createdAt: now,
    updatedAt: now,
    deleted: false,
    tags: item.tags || [],
    postponed: false,
    postponeReason: undefined,
  }));

  // Insert each formatted item into the database
  const { data, error } = await supabase
    .from('items')
    .insert(formattedItems)
    .select();

  if (error) {
    console.error('Error importing items:', error);
    throw error;
  }

  return data;
};
