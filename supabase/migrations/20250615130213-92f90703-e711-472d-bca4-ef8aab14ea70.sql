
-- Add RLS policies for ai_conversations table
CREATE POLICY "Allow all operations on ai_conversations" ON public.ai_conversations
  FOR ALL USING (true) WITH CHECK (true);

-- Add RLS policies for ai_messages table  
CREATE POLICY "Allow all operations on ai_messages" ON public.ai_messages
  FOR ALL USING (true) WITH CHECK (true);

-- Add RLS policies for ai_tasks table
CREATE POLICY "Allow all operations on ai_tasks" ON public.ai_tasks
  FOR ALL USING (true) WITH CHECK (true);

-- Add RLS policies for user_ai_preferences table
CREATE POLICY "Allow all operations on user_ai_preferences" ON public.user_ai_preferences
  FOR ALL USING (true) WITH CHECK (true);
