
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AIConversation {
  id: string;
  user_id: string;
  title: string | null;
  context_type: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  summary: string | null;
}

interface AIMessage {
  id: string;
  conversation_id: string | null;
  content: string;
  sender: 'user' | 'ai';
  model_used: string | null;
  files_context: any;
  created_at: string;
  token_count: number | null;
}

interface AITask {
  id: string;
  conversation_id: string | null;
  task_type: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  description: string | null;
  context: any;
  created_at: string;
  updated_at: string;
}

interface UserAIPreferences {
  id: string;
  user_id: string;
  preferred_model: string;
  max_context_messages: number;
  enable_conversation_summary: boolean;
  created_at: string;
  updated_at: string;
}

export const useAIConversations = () => {
  const [currentConversation, setCurrentConversation] = useState<AIConversation | null>(null);
  const [conversationHistory, setConversationHistory] = useState<AIMessage[]>([]);
  const [userPreferences, setUserPreferences] = useState<UserAIPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Generate a simple user ID for demo purposes (in real app, this would come from auth)
  const getCurrentUserId = () => {
    let userId = localStorage.getItem('demo_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('demo_user_id', userId);
    }
    return userId;
  };

  const createOrGetActiveConversation = async (contextType: string = 'general') => {
    try {
      const userId = getCurrentUserId();
      
      // Set user context for RLS
      await supabase.rpc('set_config', {
        parameter: 'app.current_user_id',
        value: userId
      });

      // Try to get active conversation
      let { data: activeConversation, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .eq('context_type', contextType)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      // Create new conversation if none exists
      if (!activeConversation) {
        const { data: newConversation, error: createError } = await supabase
          .from('ai_conversations')
          .insert([{
            user_id: userId,
            context_type: contextType,
            title: `${contextType} conversation`
          }])
          .select()
          .single();

        if (createError) throw createError;
        activeConversation = newConversation;
      }

      setCurrentConversation(activeConversation);
      return activeConversation;
    } catch (error) {
      console.error('Error creating/getting conversation:', error);
      toast({
        title: "Error",
        description: "Failed to initialize conversation",
        variant: "destructive"
      });
      return null;
    }
  };

  const loadConversationHistory = async (conversationId: string, limit: number = 15) => {
    try {
      const { data: messages, error } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(limit);

      if (error) throw error;
      setConversationHistory(messages || []);
      return messages || [];
    } catch (error) {
      console.error('Error loading conversation history:', error);
      return [];
    }
  };

  const saveMessage = async (
    conversationId: string,
    content: string,
    sender: 'user' | 'ai',
    modelUsed?: string,
    filesContext?: any
  ) => {
    try {
      const { data: message, error } = await supabase
        .from('ai_messages')
        .insert([{
          conversation_id: conversationId,
          content,
          sender,
          model_used: modelUsed,
          files_context: filesContext
        }])
        .select()
        .single();

      if (error) throw error;
      
      setConversationHistory(prev => [...prev, message]);
      return message;
    } catch (error) {
      console.error('Error saving message:', error);
      return null;
    }
  };

  const getUserPreferences = async () => {
    try {
      const userId = getCurrentUserId();
      
      let { data: preferences, error } = await supabase
        .from('user_ai_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      // Create default preferences if none exist
      if (!preferences) {
        const { data: newPreferences, error: createError } = await supabase
          .from('user_ai_preferences')
          .insert([{
            user_id: userId,
            preferred_model: 'gemini-2.0-flash-exp',
            max_context_messages: 15,
            enable_conversation_summary: true
          }])
          .select()
          .single();

        if (createError) throw createError;
        preferences = newPreferences;
      }

      setUserPreferences(preferences);
      return preferences;
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return null;
    }
  };

  const updateConversationTitle = async (conversationId: string, title: string) => {
    try {
      const { error } = await supabase
        .from('ai_conversations')
        .update({ title })
        .eq('id', conversationId);

      if (error) throw error;
      
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(prev => prev ? { ...prev, title } : null);
      }
    } catch (error) {
      console.error('Error updating conversation title:', error);
    }
  };

  const createTask = async (
    conversationId: string,
    taskType: string,
    description: string,
    context?: any
  ) => {
    try {
      const { data: task, error } = await supabase
        .from('ai_tasks')
        .insert([{
          conversation_id: conversationId,
          task_type: taskType,
          description,
          context,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;
      return task;
    } catch (error) {
      console.error('Error creating task:', error);
      return null;
    }
  };

  const updateTaskStatus = async (taskId: string, status: AITask['status']) => {
    try {
      const { error } = await supabase
        .from('ai_tasks')
        .update({ status })
        .eq('id', taskId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      await getUserPreferences();
      setLoading(false);
    };
    
    initialize();
  }, []);

  return {
    currentConversation,
    conversationHistory,
    userPreferences,
    loading,
    createOrGetActiveConversation,
    loadConversationHistory,
    saveMessage,
    getUserPreferences,
    updateConversationTitle,
    createTask,
    updateTaskStatus
  };
};
