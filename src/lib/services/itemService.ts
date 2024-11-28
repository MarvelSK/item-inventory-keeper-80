import { Item, DbItem, Tag, Json } from '../types';
import { supabase } from '@/integrations/supabase/client';

const mapDbItemToItem = (dbItem: DbItem): Item => ({
  id: dbItem.id,
  code: dbItem.code,
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
  createdAt: dbItem.created_at,
  updatedAt: dbItem.updated_at,
  deleted: dbItem.deleted,
  postponed: dbItem.postponed || false,
  postponeReason: dbItem.postpone_reason,
  created_by: dbItem.created_by,
  updated_by: dbItem.updated_by
});

const mapItemToDb = (item: Item): Omit<DbItem, 'id' | 'created_at' | 'updated_at'> => ({
  code: item.code,
  customer: item.customer || '',
  description: item.description,
  length: item.length,
  width: item.width,
  height: item.height,
  status: item.status,
  tags: item.tags as unknown as Json,
  deleted: item.deleted || false,
  postponed: item.postponed,
  postpone_reason: item.postponeReason,
  created_by: item.created_by,
  updated_by: item.updated_by
});

export const findItemByCode = async (code: string) => {
  try {
    const { data: items, error } = await supabase
      .from('items')
      .select()
      .eq('code', code.trim())
      .eq('deleted', false)
      .maybeSingle();

    if (error) {
      console.error('Error finding item:', error);
      return null;
    }

    return items ? mapDbItemToItem(items as DbItem) : null;
  } catch (error) {
    console.error('Error in findItemByCode:', error);
    return null;
  }
};

export const addItem = async (item: Item) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const existingItem = await findItemByCode(item.code);
  if (existingItem) {
    throw new Error('Item with this code already exists');
  }

  const dbItem = {
    ...mapItemToDb(item),
    created_by: user.id,
    updated_by: user.id,
    customer: item.customer || ''  // Ensure customer is never undefined
  };

  const { data, error } = await supabase
    .from('items')
    .insert(dbItem)
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
    .update({
      ...mapItemToDb(updatedItem),
      updated_by: user.id,
    })
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
  try {
    const { error } = await supabase
      .from('items')
      .update({ deleted: true })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting item:', error);
    throw error;
  }
};

export const getAllItems = async () => {
  try {
    const { data: items, error } = await supabase
      .from('items')
      .select()
      .eq('deleted', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching items:', error);
      throw error;
    }

    if (!items) return [];

    return (items as DbItem[]).map(mapDbItemToItem);
  } catch (error) {
    console.error('Error in getAllItems:', error);
    throw error;
  }
};
