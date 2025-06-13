
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProjectTask {
  id: string;
  project_id: string;
  name: string;
  completed: boolean;
  in_progress: boolean;
  sort_order: number;
  created_at: string;
}

interface Project {
  id: string;
  title: string;
  description?: string;
  lead: string;
  team?: string;
  status: 'Planning' | 'In Progress' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
  progress: number;
  start_date?: string;
  due_date?: string;
  attachments: string[];
  created_at: string;
  updated_at: string;
  tasks?: ProjectTask[];
}

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_tasks (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (project: Omit<Project, 'id' | 'created_at' | 'updated_at' | 'tasks'>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select()
        .single();

      if (error) throw error;
      setProjects(prev => [{ ...data, tasks: [] }, ...prev]);
      toast({
        title: "Project Created",
        description: "Project has been created successfully"
      });
      return data;
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setProjects(prev => prev.map(project => 
        project.id === id ? { ...project, ...data } : project
      ));
      toast({
        title: "Project Updated",
        description: "Project has been updated successfully"
      });
      return data;
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProjects(prev => prev.filter(project => project.id !== id));
      toast({
        title: "Project Deleted",
        description: "Project has been deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive"
      });
      throw error;
    }
  };

  const createTask = async (projectId: string, taskName: string) => {
    try {
      const { data, error } = await supabase
        .from('project_tasks')
        .insert([{ project_id: projectId, name: taskName }])
        .select()
        .single();

      if (error) throw error;
      
      setProjects(prev => prev.map(project => 
        project.id === projectId 
          ? { ...project, tasks: [...(project.tasks || []), data] }
          : project
      ));
      
      toast({
        title: "Task Created",
        description: "Task has been added to the project"
      });
      return data;
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive"
      });
      throw error;
    }
  };

  const toggleTask = async (taskId: string, completed: boolean) => {
    try {
      const { data, error } = await supabase
        .from('project_tasks')
        .update({ completed, in_progress: !completed })
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;
      
      setProjects(prev => prev.map(project => ({
        ...project,
        tasks: project.tasks?.map(task => 
          task.id === taskId ? data : task
        )
      })));
    } catch (error) {
      console.error('Error toggling task:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    createProject,
    updateProject,
    deleteProject,
    createTask,
    toggleTask,
    refetch: fetchProjects
  };
};
