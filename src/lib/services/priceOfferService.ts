import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const fetchPriceOffers = async (region: 'slovakia' | 'hungary' | 'romania') => {
  try {
    const { data, error } = await supabase
      .from('price_offers')
      .select(`
        *,
        distributors (
          id,
          name,
          email,
          phone,
          sales_rep_email
        )
      `)
      .eq('deleted', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching price offers:', error);
    toast.error('Failed to fetch price offers');
    return [];
  }
};

export const updatePriceOffer = async (id: number, updates: any) => {
  try {
    const { data, error } = await supabase
      .from('price_offers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    toast.success('Price offer updated successfully');
    return data;
  } catch (error) {
    console.error('Error updating price offer:', error);
    toast.error('Failed to update price offer');
    return null;
  }
};

export const deletePriceOffer = async (id: number) => {
  try {
    const { error } = await supabase
      .from('price_offers')
      .update({ deleted: true })
      .eq('id', id);

    if (error) throw error;
    toast.success('Price offer deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting price offer:', error);
    toast.error('Failed to delete price offer');
    return false;
  }
};