
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface KnowledgeBaseLink {
  id: string;
  title: string;
  type: 'document' | 'image' | 'guide' | 'policy' | 'other';
  url?: string;
}

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
  knowledgeBaseLinks: KnowledgeBaseLink[];
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
  knowledgeBaseLinks: KnowledgeBaseLink[];
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
      attachments: updateData.attachments || [],
      knowledgeBaseLinks: updateData.knowledgeBaseLinks || []
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

  const editUpdateFromAI = useCallback((updateData: any) => {
    console.log('AI-edited update:', updateData);
    
    // Trigger custom event to edit update
    window.dispatchEvent(new CustomEvent('ai-edited-update', { 
      detail: updateData 
    }));

    toast({
      title: "Update Edited",
      description: `"${updateData.title}" has been updated.`
    });
  }, [toast]);

  const deleteUpdateFromAI = useCallback((updateId: number, title: string) => {
    console.log('AI-deleted update:', updateId);
    
    // Trigger custom event to delete update
    window.dispatchEvent(new CustomEvent('ai-deleted-update', { 
      detail: { id: updateId } 
    }));

    toast({
      title: "Update Deleted",
      description: `"${title}" has been removed from Latest Updates.`
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
      attachments: [],
      knowledgeBaseLinks: projectData.knowledgeBaseLinks || []
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

  const editProjectFromAI = useCallback((projectData: any) => {
    console.log('AI-edited project:', projectData);
    
    // Trigger custom event to edit project
    window.dispatchEvent(new CustomEvent('ai-edited-project', { 
      detail: projectData 
    }));

    toast({
      title: "Project Edited",
      description: `"${projectData.title}" has been updated.`
    });
  }, [toast]);

  const deleteProjectFromAI = useCallback((projectId: number, title: string) => {
    console.log('AI-deleted project:', projectId);
    
    // Trigger custom event to delete project
    window.dispatchEvent(new CustomEvent('ai-deleted-project', { 
      detail: { id: projectId } 
    }));

    toast({
      title: "Project Deleted",
      description: `"${title}" has been removed from Works in Progress.`
    });
  }, [toast]);

  return {
    createUpdateFromAI,
    editUpdateFromAI,
    deleteUpdateFromAI,
    createProjectFromAI,
    editProjectFromAI,
    deleteProjectFromAI
  };
};
