import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getActiveCustomers, addCustomer, deleteCustomer } from '../lib/services';
import { toast } from 'sonner';

export const useCustomers = () => {
  const queryClient = useQueryClient();

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: getActiveCustomers,
  });

  const addMutation = useMutation({
    mutationFn: ({ name, companyId }: { name: string; companyId: string }) => 
      addCustomer(name, companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast.success('Zákazník bol pridaný');
    },
    onError: () => {
      toast.error('Chyba pri pridávaní zákazníka');
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
    deleteCustomer: deleteMutation.mutate,
  };
};