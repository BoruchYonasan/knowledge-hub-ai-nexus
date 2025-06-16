
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface RoadmapItem {
  id: string;
  title: string;
  description?: string;
  quarter: string;
  status: string;
  completion: number;
  created_at: string;
  updated_at: string;
}

export const useRoadmapItems = () => {
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('roadmap_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching roadmap items:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch roadmap items',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (itemData: Omit<RoadmapItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('roadmap_items')
        .insert(itemData)
        .select()
        .single();

      if (error) throw error;
      
      setItems(prev => [data, ...prev]);
      toast({
        title: 'Success',
        description: 'Roadmap item created successfully',
      });
      return data;
    } catch (error) {
      console.error('Error creating roadmap item:', error);
      toast({
        title: 'Error',
        description: 'Failed to create roadmap item',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateItem = async (id: string, updates: Partial<RoadmapItem>) => {
    try {
      const { data, error } = await supabase
        .from('roadmap_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setItems(prev => prev.map(item => item.id === id ? data : item));
      toast({
        title: 'Success',
        description: 'Roadmap item updated successfully',
      });
      return data;
    } catch (error) {
      console.error('Error updating roadmap item:', error);
      toast({
        title: 'Error',
        description: 'Failed to update roadmap item',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('roadmap_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setItems(prev => prev.filter(item => item.id !== id));
      toast({
        title: 'Success',
        description: 'Roadmap item deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting roadmap item:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete roadmap item',
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    loading,
    createItem,
    updateItem,
    deleteItem,
    refetch: fetchItems,
  };
};
