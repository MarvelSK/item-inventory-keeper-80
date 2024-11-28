import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllItems, addItem, updateItem, deleteItem } from '../lib/services/itemService';
import { toast } from 'sonner';
import { Item } from '../lib/types';

export const useItems = () => {
  const queryClient = useQueryClient();

  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ['items'],
    queryFn: getAllItems,
    retry: false
  });

  const addMutation = useMutation({
    mutationFn: (newItem: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => {
      const fullItem: Item = {
        ...newItem,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return addItem(fullItem);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('Položka bola pridaná');
    },
    onError: (error: Error) => {
      console.error('Error adding item:', error);
      toast.error('Chyba pri pridávaní položky');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (params: { item: Item, showToast?: boolean }) => {
      return updateItem(params.item);
    },
    onSuccess: (_, { showToast = true }) => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      if (showToast) {
        toast.success('Položka bola upravená');
      }
    },
    onError: (error: Error) => {
      console.error('Error updating item:', error);
      toast.error('Chyba pri úprave položky');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('Položka bola vymazaná');
    },
    onError: (error: Error) => {
      console.error('Error deleting item:', error);
      toast.error('Chyba pri vymazaní položky');
    },
  });

  return {
    items,
    isLoading,
    error,
    addItem: addMutation.mutateAsync,
    updateItem: (item: Item, showToast: boolean = true) => 
      updateMutation.mutateAsync({ item, showToast }),
    deleteItem: deleteMutation.mutateAsync,
  };
};