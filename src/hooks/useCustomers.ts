import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getActiveCustomers, addCustomer, updateCustomer, deleteCustomer } from '../lib/services/customerService';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useCustomers = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('customers_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'customers' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['customers'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: getActiveCustomers,
  });

  const addMutation = useMutation({
    mutationFn: addCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Zákazník bol pridaný');
    },
    onError: () => {
      toast.error('Chyba pri pridávaní zákazníka');
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Zákazník bol upravený');
    },
    onError: () => {
      toast.error('Chyba pri úprave zákazníka');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Zákazník bol vymazaný');
    },
    onError: () => {
      toast.error('Chyba pri vymazaní zákazníka');
    },
  });

  return {
    customers,
    isLoading,
    addCustomer: addMutation.mutate,
    updateCustomer: updateMutation.mutate,
    deleteCustomer: deleteMutation.mutate,
  };
};