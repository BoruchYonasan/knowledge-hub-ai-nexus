
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TaskAssignment {
  id: string;
  task: string;
  assignee: string;
  priority: string;
  due_date: string;
  project: string;
  status: string;
  description?: string;
  completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export const useTaskAssignments = () => {
  const [tasks, setTasks] = useState<TaskAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('task_assignments')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching task assignments:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch task assignments',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData: Omit<TaskAssignment, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('task_assignments')
        .insert(taskData)
        .select()
        .single();

      if (error) throw error;
      
      setTasks(prev => [...prev, data]);
      toast({
        title: 'Success',
        description: 'Task assignment created successfully',
      });
      return data;
    } catch (error) {
      console.error('Error creating task assignment:', error);
      toast({
        title: 'Error',
        description: 'Failed to create task assignment',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateTask = async (id: string, updates: Partial<TaskAssignment>) => {
    try {
      const { data, error } = await supabase
        .from('task_assignments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setTasks(prev => prev.map(task => task.id === id ? data : task));
      toast({
        title: 'Success',
        description: 'Task assignment updated successfully',
      });
      return data;
    } catch (error) {
      console.error('Error updating task assignment:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task assignment',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('task_assignments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setTasks(prev => prev.filter(task => task.id !== id));
      toast({
        title: 'Success',
        description: 'Task assignment deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting task assignment:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete task assignment',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const markAsCompleted = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('task_assignments')
        .update({ 
          completed: true, 
          completed_at: new Date().toISOString(),
          status: 'completed'
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setTasks(prev => prev.map(task => task.id === id ? data : task));
      toast({
        title: 'Success',
        description: 'Task marked as completed',
      });
      return data;
    } catch (error) {
      console.error('Error marking task as completed:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark task as completed',
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    completedTasks: tasks.filter(task => task.completed),
    pendingTasks: tasks.filter(task => !task.completed),
    loading,
    createTask,
    updateTask,
    deleteTask,
    markAsCompleted,
    refetch: fetchTasks,
  };
};
