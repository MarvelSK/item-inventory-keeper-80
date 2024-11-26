import { Item, DbItem, Tag } from '../types';
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
  tags: (dbItem.tags as Tag[]) || [],
  createdAt: new Date(dbItem.created_at),
  updatedAt: new Date(dbItem.updated_at),
  deleted: dbItem.deleted,
  postponed: dbItem.postponed,
  postponeReason: dbItem.postpone_reason,
  created_by: dbItem.created_by,
  updated_by: dbItem.updated_by
});

const mapItemToDb = (item: Partial<Item>) => {
  const dbItem: Partial<DbItem> = {
    ...item,
    tags: item.tags as unknown as Json,
    created_at: item.createdAt?.toISOString(),
    updated_at: item.updatedAt?.toISOString(),
    postpone_reason: item.postponeReason
  };

  // Remove frontend-specific fields
  delete (dbItem as any).createdAt;
  delete (dbItem as any).updatedAt;
  delete (dbItem as any).postponeReason;

  return dbItem;
};

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
      updatedAt: new Date(),
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