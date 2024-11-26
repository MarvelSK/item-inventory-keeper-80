import { Item } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const findItemByCode = async (code: string) => {
  const { data: items, error } = await supabase
    .from('items')
    .select('*')
    .eq('code', code.trim())
    .eq('deleted', false)
    .single();

  if (error) {
    console.error('Error finding item:', error);
    return null;
  }

  return items;
};

export const addItem = async (item: Item) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const existingItem = await findItemByCode(item.code);
  if (existingItem) {
    throw new Error('Item with this code already exists');
  }

  const { data, error } = await supabase
    .from('items')
    .insert({
      ...item,
      created_by: user.id,
      updated_by: user.id,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding item:', error);
    throw error;
  }

  return data;
};

export const updateItem = async (updatedItem: Item) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('items')
    .update({
      ...updatedItem,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', updatedItem.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating item:', error);
    throw error;
  }

  return data;
};

export const deleteItem = async (id: string) => {
  const { error } = await supabase
    .from('items')
    .update({ deleted: true })
    .eq('id', id);

  if (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};

export const getAllItems = async () => {
  const { data: items, error } = await supabase
    .from('items')
    .select('*')
    .eq('deleted', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching items:', error);
    throw error;
  }

  return items;
};