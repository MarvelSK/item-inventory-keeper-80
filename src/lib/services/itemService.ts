import { Item, DbItem, Tag, Json } from '../types';
import { supabase } from '@/integrations/supabase/client';

const mapDbItemToItem = (dbItem: DbItem): Item => ({
  id: dbItem.id,
  code: dbItem.code,
  company: dbItem.company,
  customer: dbItem.customer,
  description: dbItem.description,
  length: dbItem.length,
  width: dbItem.width,
  height: dbItem.height,
  status: dbItem.status as Item['status'],
  tags: Array.isArray(dbItem.tags) 
    ? (dbItem.tags as unknown as Tag[]).map(tag => ({
        id: String(tag.id),
        name: String(tag.name),
        color: String(tag.color)
      }))
    : [],
  createdAt: new Date(dbItem.created_at),
  updatedAt: new Date(dbItem.updated_at),
  deleted: dbItem.deleted,
  postponed: dbItem.postponed,
  postponeReason: dbItem.postpone_reason,
  created_by: dbItem.created_by,
  updated_by: dbItem.updated_by
});

const mapItemToDb = (item: Item): Omit<DbItem, 'id' | 'created_at' | 'updated_at'> => ({
  code: item.code,
  company: item.company,
  customer: item.customer,
  description: item.description,
  length: item.length,
  width: item.width,
  height: item.height,
  status: item.status,
  tags: item.tags as unknown as Json,
  deleted: item.deleted,
  postponed: item.postponed,
  postpone_reason: item.postponeReason,
  created_by: item.created_by,
  updated_by: item.updated_by
});

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

  return items ? mapDbItemToItem(items as DbItem) : null;
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
    .insert(mapItemToDb({
      ...item,
      created_by: user.id,
      updated_by: user.id,
    }))
    .select()
    .single();

  if (error) {
    console.error('Error adding item:', error);
    throw error;
  }

  return mapDbItemToItem(data as DbItem);
};

export const updateItem = async (updatedItem: Item) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('items')
    .update(mapItemToDb({
      ...updatedItem,
      updated_by: user.id,
    }))
    .eq('id', updatedItem.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating item:', error);
    throw error;
  }

  return mapDbItemToItem(data as DbItem);
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

  return (items as DbItem[]).map(mapDbItemToItem);
};