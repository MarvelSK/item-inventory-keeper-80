import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllItems, addItem, updateItem, deleteItem } from '../lib/services/itemService';
import { toast } from 'sonner';
import { Item } from '../lib/types';
import { v4 as uuidv4 } from 'uuid';

export const useItems = () => {
  const queryClient = useQueryClient();

  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ['items'],
    queryFn: getAllItems,
    retry: false
  });

  const addMutation = useMutation({
    mutationFn: (newItem: Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'deleted'>) => {
      const fullItem: Item = {
        ...newItem,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
        deleted: false
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
    mutationFn: updateItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast.success('Položka bola upravená');
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

  if (error) {
    console.error('Error fetching items:', error);
    toast.error('Failed to load items');
  }

  return {
    items,
    isLoading,
    error,
    addItem: addMutation.mutateAsync,
    updateItem: updateMutation.mutateAsync,
    deleteItem: deleteMutation.mutateAsync,
  };
};