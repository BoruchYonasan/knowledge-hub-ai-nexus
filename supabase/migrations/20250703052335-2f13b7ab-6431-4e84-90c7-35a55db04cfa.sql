
-- First, drop all existing policies completely
DROP POLICY IF EXISTS "Users can view their own conversations" ON public.ai_conversations;
DROP POLICY IF EXISTS "Users can create their own conversations" ON public.ai_conversations;
DROP POLICY IF EXISTS "Users can update their own conversations" ON public.ai_conversations;
DROP POLICY IF EXISTS "Users can delete their own conversations" ON public.ai_conversations;

DROP POLICY IF EXISTS "Users can view messages from their conversations" ON public.ai_messages;
DROP POLICY IF EXISTS "Users can create messages in their conversations" ON public.ai_messages;

DROP POLICY IF EXISTS "Users can view their own tasks" ON public.ai_tasks;
DROP POLICY IF EXISTS "Users can view tasks from their conversations" ON public.ai_tasks;
DROP POLICY IF EXISTS "Users can create tasks in their conversations" ON public.ai_tasks;
DROP POLICY IF EXISTS "Users can update tasks from their conversations" ON public.ai_tasks;
DROP POLICY IF EXISTS "Users can update their own tasks" ON public.ai_tasks;

DROP POLICY IF EXISTS "Users can view their own preferences" ON public.user_ai_preferences;
DROP POLICY IF EXISTS "Users can create their own preferences" ON public.user_ai_preferences;
DROP POLICY IF EXISTS "Users can update their own preferences" ON public.user_ai_preferences;

-- Now create the correct policies using auth.uid()
CREATE POLICY "Users can view their own conversations" 
  ON public.ai_conversations 
  FOR SELECT 
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create their own conversations" 
  ON public.ai_conversations 
  FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own conversations" 
  ON public.ai_conversations 
  FOR UPDATE 
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own conversations" 
  ON public.ai_conversations 
  FOR DELETE 
  USING (auth.uid()::text = user_id);

-- AI Messages policies
CREATE POLICY "Users can view messages from their conversations" 
  ON public.ai_messages 
  FOR SELECT 
  USING (
    conversation_id IN (
      SELECT id FROM public.ai_conversations 
      WHERE user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can create messages in their conversations" 
  ON public.ai_messages 
  FOR INSERT 
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM public.ai_conversations 
      WHERE user_id = auth.uid()::text
    )
  );

-- AI Tasks policies
CREATE POLICY "Users can view tasks from their conversations" 
  ON public.ai_tasks 
  FOR SELECT 
  USING (
    conversation_id IN (
      SELECT id FROM public.ai_conversations 
      WHERE user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can create tasks in their conversations" 
  ON public.ai_tasks 
  FOR INSERT 
  WITH CHECK (
    conversation_id IN (
      SELECT id FROM public.ai_conversations 
      WHERE user_id = auth.uid()::text
    )
  );

CREATE POLICY "Users can update tasks from their conversations" 
  ON public.ai_tasks 
  FOR UPDATE 
  USING (
    conversation_id IN (
      SELECT id FROM public.ai_conversations 
      WHERE user_id = auth.uid()::text
    )
  );

-- User AI Preferences policies
CREATE POLICY "Users can view their own preferences" 
  ON public.user_ai_preferences 
  FOR SELECT 
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create their own preferences" 
  ON public.user_ai_preferences 
  FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own preferences" 
  ON public.user_ai_preferences 
  FOR UPDATE 
  USING (auth.uid()::text = user_id);
