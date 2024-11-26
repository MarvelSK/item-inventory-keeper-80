import { supabase } from "@/integrations/supabase/client";
import { Customer } from "../types";

export const getActiveCustomers = async (): Promise<Customer[]> => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('deleted', false)
    .order('name');

  if (error) throw error;
  return data.map(customer => ({
    ...customer,
    tags: customer.tags || [],
  }));
};

export const addCustomer = async (name: string): Promise<Customer> => {
  const { data, error } = await supabase
    .from('customers')
    .insert([{ name }])
    .select()
    .single();

  if (error) throw error;
  return { ...data, tags: data.tags || [] };
};

export const updateCustomer = async (customer: Customer): Promise<Customer> => {
  const { data, error } = await supabase
    .from('customers')
    .update({
      name: customer.name,
      tags: customer.tags,
      updated_at: new Date().toISOString(),
    })
    .eq('id', customer.id)
    .select()
    .single();

  if (error) throw error;
  return { ...data, tags: data.tags || [] };
};

export const deleteCustomer = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('customers')
    .update({ deleted: true })
    .eq('id', id);

  if (error) throw error;
};