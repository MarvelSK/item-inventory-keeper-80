import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getActiveCompanies, addCompany, deleteCompany } from '../lib/services';
import { toast } from 'sonner';

export const useCompanies = () => {
  const queryClient = useQueryClient();

  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: getActiveCompanies,
  });

  const addMutation = useMutation({
    mutationFn: addCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Spoločnosť bola pridaná');
    },
    onError: () => {
      toast.error('Chyba pri pridávaní spoločnosti');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      toast.success('Spoločnosť bola vymazaná');
    },
    onError: () => {
      toast.error('Chyba pri vymazaní spoločnosti');
    },
  });

  return {
    companies,
    isLoading,
    addCompany: addMutation.mutate,
    deleteCompany: deleteMutation.mutate,
  };
};