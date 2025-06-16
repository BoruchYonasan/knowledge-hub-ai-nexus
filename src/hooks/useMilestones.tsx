
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Milestone {
  id: string;
  title: string;
  due_date: string;
  status: string;
  assignee: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export const useMilestones = () => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMilestones = async () => {
    try {
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) throw error;
      setMilestones(data || []);
    } catch (error) {
      console.error('Error fetching milestones:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch milestones',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createMilestone = async (milestoneData: Omit<Milestone, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('milestones')
        .insert(milestoneData)
        .select()
        .single();

      if (error) throw error;
      
      setMilestones(prev => [...prev, data]);
      toast({
        title: 'Success',
        description: 'Milestone created successfully',
      });
      return data;
    } catch (error) {
      console.error('Error creating milestone:', error);
      toast({
        title: 'Error',
        description: 'Failed to create milestone',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateMilestone = async (id: string, updates: Partial<Milestone>) => {
    try {
      const { data, error } = await supabase
        .from('milestones')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setMilestones(prev => prev.map(milestone => milestone.id === id ? data : milestone));
      toast({
        title: 'Success',
        description: 'Milestone updated successfully',
      });
      return data;
    } catch (error) {
      console.error('Error updating milestone:', error);
      toast({
        title: 'Error',
        description: 'Failed to update milestone',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteMilestone = async (id: string) => {
    try {
      const { error } = await supabase
        .from('milestones')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMilestones(prev => prev.filter(milestone => milestone.id !== id));
      toast({
        title: 'Success',
        description: 'Milestone deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting milestone:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete milestone',
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, []);

  return {
    milestones,
    loading,
    createMilestone,
    updateMilestone,
    deleteMilestone,
    refetch: fetchMilestones,
  };
};
