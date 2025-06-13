
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useLatestUpdates } from '@/hooks/useLatestUpdates';
import { useProjects } from '@/hooks/useProjects';
import { useGanttItems } from '@/hooks/useGanttItems';

export const useContentManager = () => {
  const { toast } = useToast();
  const { createUpdate, updateUpdate, deleteUpdate } = useLatestUpdates();
  const { createProject, updateProject, deleteProject } = useProjects();
  const { createItem, updateItem, deleteItem } = useGanttItems();

  const createUpdateFromAI = useCallback(async (updateData: any) => {
    console.log('AI-created update:', updateData);
    
    try {
      await createUpdate({
        title: updateData.title || 'Untitled Update',
        preview: updateData.preview || updateData.content?.substring(0, 100) + '...' || '',
        content: updateData.content || '',
        author: updateData.author || 'AI Assistant',
        department: updateData.department || 'General',
        priority: updateData.priority || 'medium',
        attachments: updateData.attachments || []
      });
    } catch (error) {
      console.error('Error creating update from AI:', error);
    }
  }, [createUpdate]);

  const editUpdateFromAI = useCallback(async (updateData: any) => {
    console.log('AI-edited update:', updateData);
    
    try {
      await updateUpdate(updateData.id, updateData);
    } catch (error) {
      console.error('Error editing update from AI:', error);
    }
  }, [updateUpdate]);

  const deleteUpdateFromAI = useCallback(async (updateId: string, title: string) => {
    console.log('AI-deleted update:', updateId);
    
    try {
      await deleteUpdate(updateId);
    } catch (error) {
      console.error('Error deleting update from AI:', error);
    }
  }, [deleteUpdate]);

  const createProjectFromAI = useCallback(async (projectData: any) => {
    console.log('AI-created project:', projectData);
    
    try {
      await createProject({
        title: projectData.title || 'Untitled Project',
        description: projectData.description || '',
        lead: projectData.lead || 'Unassigned',
        team: projectData.team || 'General',
        status: 'Planning',
        priority: projectData.priority || 'Medium',
        progress: 0,
        start_date: projectData.startDate || undefined,
        due_date: projectData.dueDate || undefined,
        attachments: projectData.attachments || []
      });
    } catch (error) {
      console.error('Error creating project from AI:', error);
    }
  }, [createProject]);

  const editProjectFromAI = useCallback(async (projectData: any) => {
    console.log('AI-edited project:', projectData);
    
    try {
      await updateProject(projectData.id, projectData);
    } catch (error) {
      console.error('Error editing project from AI:', error);
    }
  }, [updateProject]);

  const deleteProjectFromAI = useCallback(async (projectId: string, title: string) => {
    console.log('AI-deleted project:', projectId);
    
    try {
      await deleteProject(projectId);
    } catch (error) {
      console.error('Error deleting project from AI:', error);
    }
  }, [deleteProject]);

  const createGanttItemFromAI = useCallback(async (itemData: any) => {
    console.log('AI-created gantt item:', itemData);
    
    try {
      await createItem({
        title: itemData.title || 'Untitled Item',
        type: itemData.type || 'task',
        parent_id: itemData.parentId,
        assignee: itemData.assignee || 'Unassigned',
        priority: itemData.priority || 'Medium',
        status: itemData.status || 'Not Started',
        startDate: itemData.startDate || new Date().toISOString().split('T')[0],
        endDate: itemData.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        progress: itemData.progress || 0,
        resources: itemData.resources || [],
        dependencies: itemData.dependencies || [],
        description: itemData.description || ''
      });
    } catch (error) {
      console.error('Error creating gantt item from AI:', error);
    }
  }, [createItem]);

  const editGanttItemFromAI = useCallback(async (itemData: any) => {
    console.log('AI-edited gantt item:', itemData);
    
    try {
      await updateItem(itemData.id, itemData);
    } catch (error) {
      console.error('Error editing gantt item from AI:', error);
    }
  }, [updateItem]);

  const deleteGanttItemFromAI = useCallback(async (itemId: string, title: string) => {
    console.log('AI-deleted gantt item:', itemId);
    
    try {
      await deleteItem(itemId);
    } catch (error) {
      console.error('Error deleting gantt item from AI:', error);
    }
  }, [deleteItem]);

  return {
    createUpdateFromAI,
    editUpdateFromAI,
    deleteUpdateFromAI,
    createProjectFromAI,
    editProjectFromAI,
    deleteProjectFromAI,
    createGanttItemFromAI,
    editGanttItemFromAI,
    deleteGanttItemFromAI
  };
};
