
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Update {
  id: number;
  title: string;
  date: string;
  author: string;
  department: string;
  priority: 'high' | 'medium' | 'low';
  preview: string;
  content: string;
  attachments: string[];
}

interface Project {
  id: number;
  title: string;
  lead: string;
  team: string;
  status: 'Planning' | 'In Progress' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
  progress: number;
  startDate: string;
  dueDate: string;
  description: string;
  tasks: any[];
  attachments: string[];
}

export const useContentManager = () => {
  const { toast } = useToast();

  const createUpdateFromAI = useCallback((updateData: any) => {
    console.log('AI-created update:', updateData);
    
    const newUpdate: Update = {
      id: Date.now(),
      title: updateData.title || 'Untitled Update',
      date: new Date().toISOString().split('T')[0],
      author: updateData.author || 'AI Assistant',
      department: updateData.department || 'General',
      priority: updateData.priority || 'medium',
      preview: updateData.preview || updateData.content?.substring(0, 100) + '...' || '',
      content: updateData.content || '',
      attachments: updateData.attachments || []
    };

    // Trigger custom event to update LatestUpdates component
    window.dispatchEvent(new CustomEvent('ai-created-update', { 
      detail: newUpdate 
    }));

    toast({
      title: "Update Created",
      description: `"${newUpdate.title}" has been added to Latest Updates.`
    });
  }, [toast]);

  const createProjectFromAI = useCallback((projectData: any) => {
    console.log('AI-created project:', projectData);
    
    const newProject: Project = {
      id: Date.now(),
      title: projectData.title || 'Untitled Project',
      lead: projectData.lead || 'Unassigned',
      team: projectData.team || 'General',
      status: 'Planning',
      priority: projectData.priority || 'Medium',
      progress: 0,
      startDate: projectData.startDate || new Date().toISOString().split('T')[0],
      dueDate: projectData.dueDate || '',
      description: projectData.description || '',
      tasks: [],
      attachments: []
    };

    // Trigger custom event to update WorksInProgress component
    window.dispatchEvent(new CustomEvent('ai-created-project', { 
      detail: newProject 
    }));

    toast({
      title: "Project Created",
      description: `"${newProject.title}" has been added to Works in Progress.`
    });
  }, [toast]);

  return {
    createUpdateFromAI,
    createProjectFromAI
  };
};
