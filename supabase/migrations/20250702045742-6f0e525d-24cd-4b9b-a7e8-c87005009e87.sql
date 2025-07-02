
-- Drop the overly broad "Allow all operations" policies that are causing conflicts
-- These are redundant since we have more specific policies that are better for performance

-- Drop broad policies for ai_conversations
DROP POLICY IF EXISTS "Allow all operations on ai_conversations" ON public.ai_conversations;

-- Drop broad policies for ai_messages  
DROP POLICY IF EXISTS "Allow all operations on ai_messages" ON public.ai_messages;

-- Drop broad policies for ai_tasks
DROP POLICY IF EXISTS "Allow all operations on ai_tasks" ON public.ai_tasks;

-- Drop broad policies for user_ai_preferences
DROP POLICY IF EXISTS "Allow all operations on user_ai_preferences" ON public.user_ai_preferences;

-- Now optimize the remaining policies by wrapping auth function calls in SELECT statements
-- This prevents re-evaluation for each row

-- Update ai_conversations policies
DROP POLICY IF EXISTS "Users can view their own conversations" ON public.ai_conversations;
DROP POLICY IF EXISTS "Users can create their own conversations" ON public.ai_conversations;
DROP POLICY IF EXISTS "Users can update their own conversations" ON public.ai_conversations;

CREATE POLICY "Users can view their own conversations" ON public.ai_conversations
  FOR SELECT USING (user_id = (SELECT current_setting('app.current_user_id', true)));

CREATE POLICY "Users can create their own conversations" ON public.ai_conversations
  FOR INSERT WITH CHECK (user_id = (SELECT current_setting('app.current_user_id', true)));

CREATE POLICY "Users can update their own conversations" ON public.ai_conversations
  FOR UPDATE USING (user_id = (SELECT current_setting('app.current_user_id', true)));

-- Update ai_messages policies
DROP POLICY IF EXISTS "Users can view messages from their conversations" ON public.ai_messages;
DROP POLICY IF EXISTS "Users can create messages in their conversations" ON public.ai_messages;

CREATE POLICY "Users can view messages from their conversations" ON public.ai_messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM public.ai_conversations 
      WHERE user_id = (SELECT current_setting('app.current_user_id', true))
    )
  );

CREATE POLICY "Users can create messages in their conversations" ON public.ai_messages
  FOR INSERT WITH CHECK (
    conversation_id IN (
      SELECT id FROM public.ai_conversations 
      WHERE user_id = (SELECT current_setting('app.current_user_id', true))
    )
  );

-- Update ai_tasks policies
DROP POLICY IF EXISTS "Users can view their own tasks" ON public.ai_tasks;
DROP POLICY IF EXISTS "Users can create tasks in their conversations" ON public.ai_tasks;
DROP POLICY IF EXISTS "Users can update their own tasks" ON public.ai_tasks;

CREATE POLICY "Users can view their own tasks" ON public.ai_tasks
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM public.ai_conversations 
      WHERE user_id = (SELECT current_setting('app.current_user_id', true))
    )
  );

CREATE POLICY "Users can create tasks in their conversations" ON public.ai_tasks
  FOR INSERT WITH CHECK (
    conversation_id IN (
      SELECT id FROM public.ai_conversations 
      WHERE user_id = (SELECT current_setting('app.current_user_id', true))
    )
  );

CREATE POLICY "Users can update their own tasks" ON public.ai_tasks
  FOR UPDATE USING (
    conversation_id IN (
      SELECT id FROM public.ai_conversations 
      WHERE user_id = (SELECT current_setting('app.current_user_id', true))
    )
  );

-- Update user_ai_preferences policies
DROP POLICY IF EXISTS "Users can view their own preferences" ON public.user_ai_preferences;
DROP POLICY IF EXISTS "Users can create their own preferences" ON public.user_ai_preferences;
DROP POLICY IF EXISTS "Users can update their own preferences" ON public.user_ai_preferences;

CREATE POLICY "Users can view their own preferences" ON public.user_ai_preferences
  FOR SELECT USING (user_id = (SELECT current_setting('app.current_user_id', true)));

CREATE POLICY "Users can create their own preferences" ON public.user_ai_preferences
  FOR INSERT WITH CHECK (user_id = (SELECT current_setting('app.current_user_id', true)));

CREATE POLICY "Users can update their own preferences" ON public.user_ai_preferences
  FOR UPDATE USING (user_id = (SELECT current_setting('app.current_user_id', true)));

-- Update documents policies to optimize auth.uid() calls
DROP POLICY IF EXISTS "Users can create documents" ON public.documents;
DROP POLICY IF EXISTS "Users can update documents" ON public.documents;
DROP POLICY IF EXISTS "Users can delete their own documents" ON public.documents;

CREATE POLICY "Users can create documents" ON public.documents
  FOR INSERT WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "Users can update documents" ON public.documents
  FOR UPDATE USING ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "Users can delete their own documents" ON public.documents
  FOR DELETE USING ((SELECT auth.uid()) = created_by);

-- Update workspaces policy
DROP POLICY IF EXISTS "Authenticated users can create workspaces" ON public.workspaces;

CREATE POLICY "Authenticated users can create workspaces" ON public.workspaces
  FOR INSERT WITH CHECK ((SELECT auth.uid()) IS NOT NULL);
