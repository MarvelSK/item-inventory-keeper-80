import { supabase } from "@/integrations/supabase/client";
import { Customer, Tag } from "../types";
import { Json } from "@/integrations/supabase/types";

export const getActiveCustomers = async (): Promise<Customer[]> => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('deleted', false)
    .order('name');

  if (error) throw error;
  
  return data.map(customer => ({
    ...customer,
    tags: (customer.tags as Json[] || []).map(tag => tag as Tag),
  }));
};

export const addCustomer = async (name: string): Promise<Customer> => {
  const { data, error } = await supabase
    .from('customers')
    .insert([{ name, tags: [] }])
    .select()
    .single();

  if (error) throw error;
  return {
    ...data,
    tags: (data.tags as Json[] || []).map(tag => tag as Tag),
  };
};

export const updateCustomer = async (customer: Customer): Promise<Customer> => {
  const { data, error } = await supabase
    .from('customers')
    .update({
      name: customer.name,
      tags: customer.tags as Json[],
      updated_at: new Date().toISOString(),
    })
    .eq('id', customer.id)
    .select()
    .single();

  if (error) throw error;
  return {
    ...data,
    tags: (data.tags as Json[] || []).map(tag => tag as Tag),
  };
};

export const deleteCustomer = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('customers')
    .update({ deleted: true })
    .eq('id', id);

  if (error) throw error;
};