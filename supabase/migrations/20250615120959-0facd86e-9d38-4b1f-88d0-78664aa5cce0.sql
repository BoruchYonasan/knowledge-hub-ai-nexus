
-- Create conversation sessions table
CREATE TABLE public.ai_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT,
  context_type TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  summary TEXT
);

-- Create messages table for conversation history
CREATE TABLE public.ai_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'ai')),
  model_used TEXT,
  files_context JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  token_count INTEGER
);

-- Create tasks table for tracking ongoing operations
CREATE TABLE public.ai_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  task_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  description TEXT,
  context JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user AI preferences table
CREATE TABLE public.user_ai_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  preferred_model TEXT DEFAULT 'gemini-2.0-flash-exp',
  max_context_messages INTEGER DEFAULT 15,
  enable_conversation_summary BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ai_preferences ENABLE ROW LEVEL SECURITY;

-- Conversations policies
CREATE POLICY "Users can view their own conversations" ON public.ai_conversations
  FOR SELECT USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can create their own conversations" ON public.ai_conversations
  FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update their own conversations" ON public.ai_conversations
  FOR UPDATE USING (user_id = current_setting('app.current_user_id', true));

-- Messages policies
CREATE POLICY "Users can view messages from their conversations" ON public.ai_messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM public.ai_conversations 
      WHERE user_id = current_setting('app.current_user_id', true)
    )
  );

CREATE POLICY "Users can create messages in their conversations" ON public.ai_messages
  FOR INSERT WITH CHECK (
    conversation_id IN (
      SELECT id FROM public.ai_conversations 
      WHERE user_id = current_setting('app.current_user_id', true)
    )
  );

-- Tasks policies
CREATE POLICY "Users can view their own tasks" ON public.ai_tasks
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM public.ai_conversations 
      WHERE user_id = current_setting('app.current_user_id', true)
    )
  );

CREATE POLICY "Users can create tasks in their conversations" ON public.ai_tasks
  FOR INSERT WITH CHECK (
    conversation_id IN (
      SELECT id FROM public.ai_conversations 
      WHERE user_id = current_setting('app.current_user_id', true)
    )
  );

CREATE POLICY "Users can update their own tasks" ON public.ai_tasks
  FOR UPDATE USING (
    conversation_id IN (
      SELECT id FROM public.ai_conversations 
      WHERE user_id = current_setting('app.current_user_id', true)
    )
  );

-- Preferences policies
CREATE POLICY "Users can view their own preferences" ON public.user_ai_preferences
  FOR SELECT USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can create their own preferences" ON public.user_ai_preferences
  FOR INSERT WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update their own preferences" ON public.user_ai_preferences
  FOR UPDATE USING (user_id = current_setting('app.current_user_id', true));

-- Add triggers for updated_at columns
CREATE TRIGGER update_ai_conversations_updated_at
  BEFORE UPDATE ON public.ai_conversations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_tasks_updated_at
  BEFORE UPDATE ON public.ai_tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_ai_preferences_updated_at
  BEFORE UPDATE ON public.user_ai_preferences
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_ai_conversations_user_id ON public.ai_conversations(user_id);
CREATE INDEX idx_ai_messages_conversation_id ON public.ai_messages(conversation_id);
CREATE INDEX idx_ai_messages_created_at ON public.ai_messages(created_at);
CREATE INDEX idx_ai_tasks_conversation_id ON public.ai_tasks(conversation_id);
CREATE INDEX idx_ai_tasks_status ON public.ai_tasks(status);
