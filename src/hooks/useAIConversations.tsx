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
  const getCurrentUserId = (): string => {
    let userId = localStorage.getItem('demo_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('demo_user_id', userId);
    }
    return userId;
  };

  const setActiveConversation = async (conversation: AIConversation) => {
    try {
      const userId = getCurrentUserId();
      
      // First, deactivate all other conversations for this user and context type
      await supabase
        .from('ai_conversations')
        .update({ is_active: false })
        .eq('user_id', userId)
        .eq('context_type', conversation.context_type);

      // Then, activate the selected conversation
      const { error } = await supabase
        .from('ai_conversations')
        .update({ is_active: true })
        .eq('id', conversation.id);

      if (error) throw error;

      // Update local state
      setCurrentConversation({ ...conversation, is_active: true });
      
      return true;
    } catch (error) {
      console.error('Error setting active conversation:', error);
      toast({
        title: "Error",
        description: "Failed to set active conversation",
        variant: "destructive"
      });
      return false;
    }
  };

  const createOrGetActiveConversation = async (contextType: string = 'general') => {
    try {
      const userId = getCurrentUserId();
      
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
        // First deactivate any existing conversations for this context
        await supabase
          .from('ai_conversations')
          .update({ is_active: false })
          .eq('user_id', userId)
          .eq('context_type', contextType);

        const { data: newConversation, error: createError } = await supabase
          .from('ai_conversations')
          .insert([{
            user_id: userId,
            context_type: contextType,
            title: `${contextType} conversation`,
            is_active: true
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
      
      // Type cast the messages to ensure proper typing
      const typedMessages = (messages || []).map(msg => ({
        ...msg,
        sender: msg.sender as 'user' | 'ai'
      }));
      
      setConversationHistory(typedMessages);
      return typedMessages;
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
      
      // Type cast the returned message
      const typedMessage = {
        ...message,
        sender: message.sender as 'user' | 'ai'
      };
      
      setConversationHistory(prev => [...prev, typedMessage]);
      return typedMessage;
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
    updateTaskStatus,
    setActiveConversation
  };
};
