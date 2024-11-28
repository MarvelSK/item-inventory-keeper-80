import { Item } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

export const importItems = async (items: any[]) => {
  const now = new Date().toISOString();
  
  const formattedItems = items.map(item => ({
    ...item,
    created_at: now,
    updated_at: now,
    deleted: false,
    tags: item.tags || [],
    postponed: false,
    postpone_reason: undefined,
  }));

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