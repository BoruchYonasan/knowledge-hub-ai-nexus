
-- Clean up any remaining "Allow all operations" policies that are still causing conflicts
-- These policies are mentioned in the warnings and need to be completely removed

-- Drop any remaining broad policies for ai_messages
DROP POLICY IF EXISTS "Allow all operations on ai_messages" ON public.ai_messages;

-- Drop any remaining broad policies for ai_tasks  
DROP POLICY IF EXISTS "Allow all operations on ai_tasks" ON public.ai_tasks;

-- Drop any remaining broad policies for user_ai_preferences
DROP POLICY IF EXISTS "Allow all operations on user_ai_preferences" ON public.user_ai_preferences;

-- Also check for any other variations of broad policies that might exist
DROP POLICY IF EXISTS "Allow all operations" ON public.ai_messages;
DROP POLICY IF EXISTS "Allow all operations" ON public.ai_tasks;
DROP POLICY IF EXISTS "Allow all operations" ON public.user_ai_preferences;
DROP POLICY IF EXISTS "Allow all operations" ON public.ai_conversations;

-- List all policies to make sure we have the right ones
-- This will help us see what policies currently exist
