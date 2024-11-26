import { supabase } from "@/integrations/supabase/client";
import { Customer, Tag } from "../types";
import { Json } from "@/integrations/supabase/types";

const isValidTag = (item: Json): item is Tag => {
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
  return json.filter(isValidTag);
};

const convertTagsToJson = (tags: Tag[]): Json => {
  return tags.map(tag => ({
    id: tag.id,
    name: tag.name,
    color: tag.color || '#D2D2D2'
  }));
};

export const getActiveCustomers = async (): Promise<Customer[]> => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('deleted', false)
    .order('name');

  if (error) throw error;
  
  return data.map(customer => ({
    ...customer,
    tags: convertJsonToTags(customer.tags),
  }));
};

export const addCustomer = async (name: string): Promise<Customer> => {
  const { data, error } = await supabase
    .from('customers')
    .insert([{ 
      name, 
      tags: [] 
    }])
    .select()
    .single();

  if (error) throw error;
  return {
    ...data,
    tags: convertJsonToTags(data.tags),
  };
};

export const updateCustomer = async (customer: Customer): Promise<Customer> => {
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
  return {
    ...data,
    tags: convertJsonToTags(data.tags),
  };
};

export const deleteCustomer = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('customers')
    .update({ deleted: true })
    .eq('id', id);

  if (error) throw error;
};