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
  startDate: string; // Changed from start_date to match component expectations
  endDate: string;   // Changed from end_date to match component expectations
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
      
      // Transform database format to component format
      const transformedItems = (data || []).map(item => ({
        ...item,
        startDate: item.start_date,
        endDate: item.end_date,
        resources: item.resources || [],
        dependencies: item.dependencies || []
      }));
      
      setItems(transformedItems);
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
      // Transform component format to database format
      const dbItem = {
        title: item.title,
        type: item.type,
        parent_id: item.parent_id,
        assignee: item.assignee,
        priority: item.priority,
        status: item.status,
        start_date: item.startDate,
        end_date: item.endDate,
        progress: item.progress,
        resources: item.resources,
        dependencies: item.dependencies,
        description: item.description
      };
      
      const { data, error } = await supabase
        .from('gantt_items')
        .insert([dbItem])
        .select()
        .single();

      if (error) throw error;
      
      // Transform back to component format
      const transformedItem = {
        ...data,
        startDate: data.start_date,
        endDate: data.end_date,
        resources: data.resources || [],
        dependencies: data.dependencies || []
      };
      
      setItems(prev => [transformedItem, ...prev]);
      toast({
        title: "Gantt Item Created",
        description: "Gantt item has been created successfully"
      });
      return transformedItem;
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
      // Transform component format to database format
      const dbUpdates: any = { ...updates };
      if (updates.startDate) {
        dbUpdates.start_date = updates.startDate;
        delete dbUpdates.startDate;
      }
      if (updates.endDate) {
        dbUpdates.end_date = updates.endDate;
        delete dbUpdates.endDate;
      }
      
      const { data, error } = await supabase
        .from('gantt_items')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      // Transform back to component format
      const transformedItem = {
        ...data,
        startDate: data.start_date,
        endDate: data.end_date,
        resources: data.resources || [],
        dependencies: data.dependencies || []
      };
      
      setItems(prev => prev.map(item => 
        item.id === id ? transformedItem : item
      ));
      toast({
        title: "Gantt Item Updated",
        description: "Gantt item has been updated successfully"
      });
      return transformedItem;
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

  const bulkUpdateStatus = async (ids: string[], status: 'Not Started' | 'In Progress' | 'Completed' | 'On Hold') => {
    try {
      const { error } = await supabase
        .from('gantt_items')
        .update({ status })
        .in('id', ids);

      if (error) throw error;
      
      setItems(prev => prev.map(item => 
        ids.includes(item.id) ? { ...item, status } : item
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
