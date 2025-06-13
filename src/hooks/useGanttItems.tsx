
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GanttItem {
  id: string;
  title: string;
  type: 'milestone' | 'task' | 'subtask';
  parent_id?: string;
  assignee: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Not Started' | 'In Progress' | 'Completed' | 'On Hold';
  start_date: string;
  end_date: string;
  progress: number;
  resources: string[];
  dependencies: string[];
  description?: string;
  created_at: string;
  updated_at: string;
}

export const useGanttItems = () => {
  const [items, setItems] = useState<GanttItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('gantt_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching gantt items:', error);
      toast({
        title: "Error",
        description: "Failed to load gantt items",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (item: Omit<GanttItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('gantt_items')
        .insert([item])
        .select()
        .single();

      if (error) throw error;
      setItems(prev => [data, ...prev]);
      toast({
        title: "Gantt Item Created",
        description: "Gantt item has been created successfully"
      });
      return data;
    } catch (error) {
      console.error('Error creating gantt item:', error);
      toast({
        title: "Error",
        description: "Failed to create gantt item",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateItem = async (id: string, updates: Partial<GanttItem>) => {
    try {
      const { data, error } = await supabase
        .from('gantt_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setItems(prev => prev.map(item => 
        item.id === id ? data : item
      ));
      toast({
        title: "Gantt Item Updated",
        description: "Gantt item has been updated successfully"
      });
      return data;
    } catch (error) {
      console.error('Error updating gantt item:', error);
      toast({
        title: "Error",
        description: "Failed to update gantt item",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('gantt_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setItems(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Gantt Item Deleted",
        description: "Gantt item has been deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting gantt item:', error);
      toast({
        title: "Error",
        description: "Failed to delete gantt item",
        variant: "destructive"
      });
      throw error;
    }
  };

  const bulkUpdateStatus = async (ids: string[], status: string) => {
    try {
      const { error } = await supabase
        .from('gantt_items')
        .update({ status })
        .in('id', ids);

      if (error) throw error;
      
      setItems(prev => prev.map(item => 
        ids.includes(item.id) ? { ...item, status: status as any } : item
      ));
      
      toast({
        title: "Status Updated",
        description: `Updated status for ${ids.length} items`
      });
    } catch (error) {
      console.error('Error bulk updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive"
      });
      throw error;
    }
  };

  const bulkUpdateAssignee = async (ids: string[], assignee: string) => {
    try {
      const { error } = await supabase
        .from('gantt_items')
        .update({ assignee })
        .in('id', ids);

      if (error) throw error;
      
      setItems(prev => prev.map(item => 
        ids.includes(item.id) ? { ...item, assignee } : item
      ));
      
      toast({
        title: "Assignee Updated",
        description: `Reassigned ${ids.length} items`
      });
    } catch (error) {
      console.error('Error bulk updating assignee:', error);
      toast({
        title: "Error",
        description: "Failed to update assignee",
        variant: "destructive"
      });
      throw error;
    }
  };

  const bulkDelete = async (ids: string[]) => {
    try {
      const { error } = await supabase
        .from('gantt_items')
        .delete()
        .in('id', ids);

      if (error) throw error;
      
      setItems(prev => prev.filter(item => !ids.includes(item.id)));
      
      toast({
        title: "Items Deleted",
        description: `Deleted ${ids.length} items`
      });
    } catch (error) {
      console.error('Error bulk deleting items:', error);
      toast({
        title: "Error",
        description: "Failed to delete items",
        variant: "destructive"
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
    bulkUpdateStatus,
    bulkUpdateAssignee,
    bulkDelete,
    refetch: fetchItems
  };
};
