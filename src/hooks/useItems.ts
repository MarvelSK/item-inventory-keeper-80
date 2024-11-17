import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllItems, addItem, updateItem, deleteItem } from '../lib/services';
import { toast } from 'sonner';

export const useItems = () => {
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['items'],
    queryFn: getAllItems,
  });

  const addMutation = useMutation({
    mutationFn: addItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('Položka bola pridaná');
    },
    onError: () => {
      toast.error('Chyba pri pridávaní položky');
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('Položka bola upravená');
    },
    onError: () => {
      toast.error('Chyba pri úprave položky');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('Položka bola vymazaná');
    },
    onError: () => {
      toast.error('Chyba pri vymazaní položky');
    },
  });

  return {
    items,
    isLoading,
    addItem: addMutation.mutate,
    updateItem: updateMutation.mutate,
    deleteItem: deleteMutation.mutate,
  };
};