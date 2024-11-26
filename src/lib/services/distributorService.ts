import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const fetchDistributors = async (region: 'slovakia' | 'hungary' | 'romania') => {
  try {
    const { data, error } = await supabase
      .from('distributors')
      .select('*')
      .eq('region', region)
      .eq('deleted', false)
      .order('name');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching distributors:', error);
    toast.error('Failed to fetch distributors');
    return [];
  }
};

export const addDistributor = async (distributor: {
  name: string;
  email?: string;
  phone?: string;
  sales_rep_email?: string;
  region: 'slovakia' | 'hungary' | 'romania';
}) => {
  try {
    const { data, error } = await supabase
      .from('distributors')
      .insert([distributor])
      .select()
      .single();

    if (error) throw error;
    toast.success('Distributor added successfully');
    return data;
  } catch (error) {
    console.error('Error adding distributor:', error);
    toast.error('Failed to add distributor');
    return null;
  }
};

export const updateDistributor = async (id: string, updates: {
  name?: string;
  email?: string;
  phone?: string;
  sales_rep_email?: string;
}) => {
  try {
    const { data, error } = await supabase
      .from('distributors')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    toast.success('Distributor updated successfully');
    return data;
  } catch (error) {
    console.error('Error updating distributor:', error);
    toast.error('Failed to update distributor');
    return null;
  }
};

export const deleteDistributor = async (id: string) => {
  try {
    const { error } = await supabase
      .from('distributors')
      .update({ deleted: true })
      .eq('id', id);

    if (error) throw error;
    toast.success('Distributor deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting distributor:', error);
    toast.error('Failed to delete distributor');
    return false;
  }
};