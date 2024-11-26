import { supabase } from "@/integrations/supabase/client";
import { Customer, Tag } from "../types";
import { Json } from "@/integrations/supabase/types";

const isValidTag = (item: unknown): item is { id: string; name: string; color: string } => {
  if (typeof item !== 'object' || item === null) return false;
  
  const tag = item as Record<string, unknown>;
  return (
    typeof tag.id === 'string' &&
    typeof tag.name === 'string' &&
    typeof tag.color === 'string'
  );
};

const convertJsonToTags = (json: Json | null): Tag[] => {
  if (!Array.isArray(json)) return [];
  return json.filter(isValidTag).map(tag => ({
    id: tag.id,
    name: tag.name,
    color: tag.color
  }));
};

const convertTagsToJson = (tags: Tag[]): Json => {
  return tags.map(tag => ({
    id: tag.id,
    name: tag.name,
    color: tag.color
  }));
};

export const getActiveCustomers = async (): Promise<Customer[]> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('deleted', false)
      .order('name');

    if (error) throw error;
    
    if (!data) return [];

    return data.map(customer => ({
      ...customer,
      tags: convertJsonToTags(customer.tags),
    }));
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

export const addCustomer = async (name: string): Promise<Customer> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .insert([{ 
        name, 
        tags: [] 
      }])
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned from insert');

    return {
      ...data,
      tags: convertJsonToTags(data.tags),
    };
  } catch (error) {
    console.error('Error adding customer:', error);
    throw error;
  }
};

export const updateCustomer = async (customer: Customer): Promise<Customer> => {
  try {
    const { data, error } = await supabase
      .from('customers')
      .update({
        name: customer.name,
        tags: convertTagsToJson(customer.tags || []),
        updated_at: new Date().toISOString(),
      })
      .eq('id', customer.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No data returned from update');

    return {
      ...data,
      tags: convertJsonToTags(data.tags),
    };
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
};

export const deleteCustomer = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('customers')
      .update({ deleted: true })
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};