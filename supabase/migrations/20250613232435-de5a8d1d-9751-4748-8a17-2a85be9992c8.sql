
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for better data consistency
CREATE TYPE update_priority AS ENUM ('high', 'medium', 'low');
CREATE TYPE project_status AS ENUM ('Planning', 'In Progress', 'Completed');
CREATE TYPE project_priority AS ENUM ('High', 'Medium', 'Low');
CREATE TYPE gantt_item_type AS ENUM ('milestone', 'task', 'subtask');
CREATE TYPE gantt_item_status AS ENUM ('Not Started', 'In Progress', 'Completed', 'On Hold');
CREATE TYPE gantt_item_priority AS ENUM ('High', 'Medium', 'Low');
CREATE TYPE knowledge_base_category AS ENUM ('all', 'hr', 'engineering', 'sales', 'finance', 'operations');
CREATE TYPE link_type AS ENUM ('document', 'image', 'guide', 'policy', 'other');

-- Create knowledge base articles table
CREATE TABLE public.knowledge_base_articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  category knowledge_base_category DEFAULT 'all',
  author TEXT NOT NULL,
  read_time TEXT DEFAULT '5 min read',
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create knowledge base links table
CREATE TABLE public.knowledge_base_links (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  type link_type DEFAULT 'document',
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create latest updates table
CREATE TABLE public.latest_updates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  preview TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  department TEXT,
  priority update_priority DEFAULT 'medium',
  attachments TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create junction table for update knowledge base links
CREATE TABLE public.update_knowledge_links (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  update_id UUID REFERENCES public.latest_updates(id) ON DELETE CASCADE,
  link_id UUID REFERENCES public.knowledge_base_links(id) ON DELETE CASCADE,
  UNIQUE(update_id, link_id)
);

-- Create projects table (Works in Progress)
CREATE TABLE public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  lead TEXT NOT NULL,
  team TEXT,
  status project_status DEFAULT 'Planning',
  priority project_priority DEFAULT 'Medium',
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  start_date DATE,
  due_date DATE,
  attachments TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create project tasks table
CREATE TABLE public.project_tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  in_progress BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create junction table for project knowledge base links
CREATE TABLE public.project_knowledge_links (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  link_id UUID REFERENCES public.knowledge_base_links(id) ON DELETE CASCADE,
  UNIQUE(project_id, link_id)
);

-- Create gantt items table
CREATE TABLE public.gantt_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  type gantt_item_type DEFAULT 'task',
  parent_id UUID REFERENCES public.gantt_items(id) ON DELETE CASCADE,
  assignee TEXT NOT NULL,
  priority gantt_item_priority DEFAULT 'Medium',
  status gantt_item_status DEFAULT 'Not Started',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  resources TEXT[],
  dependencies UUID[], -- Array of gantt_item IDs
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) - For now, allow all authenticated users access
ALTER TABLE public.knowledge_base_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.latest_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.update_knowledge_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_knowledge_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gantt_items ENABLE ROW LEVEL SECURITY;

-- Create permissive RLS policies for company-wide access (all authenticated users can do everything)
-- Knowledge base policies
CREATE POLICY "Company members can manage knowledge base articles" ON public.knowledge_base_articles
  FOR ALL USING (true);

CREATE POLICY "Company members can manage knowledge base links" ON public.knowledge_base_links
  FOR ALL USING (true);

-- Latest updates policies
CREATE POLICY "Company members can manage latest updates" ON public.latest_updates
  FOR ALL USING (true);

CREATE POLICY "Company members can manage update knowledge links" ON public.update_knowledge_links
  FOR ALL USING (true);

-- Projects policies
CREATE POLICY "Company members can manage projects" ON public.projects
  FOR ALL USING (true);

CREATE POLICY "Company members can manage project tasks" ON public.project_tasks
  FOR ALL USING (true);

CREATE POLICY "Company members can manage project knowledge links" ON public.project_knowledge_links
  FOR ALL USING (true);

-- Gantt items policies
CREATE POLICY "Company members can manage gantt items" ON public.gantt_items
  FOR ALL USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to relevant tables
CREATE TRIGGER update_knowledge_base_articles_updated_at
  BEFORE UPDATE ON public.knowledge_base_articles
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_latest_updates_updated_at
  BEFORE UPDATE ON public.latest_updates
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_gantt_items_updated_at
  BEFORE UPDATE ON public.gantt_items
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Insert some sample data to match your current static data
INSERT INTO public.knowledge_base_articles (title, description, category, author, read_time) VALUES
('Employee Onboarding Guide', 'Complete guide for new employee onboarding process', 'hr', 'Sarah Johnson', '5 min read'),
('API Development Standards', 'Best practices and standards for API development', 'engineering', 'Mike Chen', '8 min read'),
('Sales Process Documentation', 'Step-by-step guide to our sales process', 'sales', 'Jennifer Adams', '6 min read'),
('Code Review Guidelines', 'Guidelines for effective code reviews', 'engineering', 'Alex Rodriguez', '4 min read'),
('Expense Reporting Policy', 'How to submit and manage expense reports', 'finance', 'Emily Watson', '3 min read'),
('Remote Work Guidelines', 'Best practices for remote work productivity', 'hr', 'David Kim', '7 min read');
