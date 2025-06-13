
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LatestUpdate {
  id: string;
  title: string;
  preview: string;
  content: string;
  author: string;
  department?: string;
  priority: 'high' | 'medium' | 'low';
  attachments: string[];
  created_at: string;
  updated_at: string;
}

export const useLatestUpdates = () => {
  const [updates, setUpdates] = useState<LatestUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUpdates = async () => {
    try {
      const { data, error } = await supabase
        .from('latest_updates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUpdates(data || []);
    } catch (error) {
      console.error('Error fetching latest updates:', error);
      toast({
        title: "Error",
        description: "Failed to load latest updates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createUpdate = async (update: Omit<LatestUpdate, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('latest_updates')
        .insert([update])
        .select()
        .single();

      if (error) throw error;
      setUpdates(prev => [data, ...prev]);
      toast({
        title: "Update Created",
        description: "Latest update has been created successfully"
      });
      return data;
    } catch (error) {
      console.error('Error creating update:', error);
      toast({
        title: "Error",
        description: "Failed to create update",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateUpdate = async (id: string, updateData: Partial<LatestUpdate>) => {
    try {
      const { data, error } = await supabase
        .from('latest_updates')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setUpdates(prev => prev.map(update => 
        update.id === id ? data : update
      ));
      toast({
        title: "Update Modified",
        description: "Latest update has been updated successfully"
      });
      return data;
    } catch (error) {
      console.error('Error updating update:', error);
      toast({
        title: "Error",
        description: "Failed to update latest update",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteUpdate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('latest_updates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setUpdates(prev => prev.filter(update => update.id !== id));
      toast({
        title: "Update Deleted",
        description: "Latest update has been deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting update:', error);
      toast({
        title: "Error",
        description: "Failed to delete update",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  return {
    updates,
    loading,
    createUpdate,
    updateUpdate,
    deleteUpdate,
    refetch: fetchUpdates
  };
};
