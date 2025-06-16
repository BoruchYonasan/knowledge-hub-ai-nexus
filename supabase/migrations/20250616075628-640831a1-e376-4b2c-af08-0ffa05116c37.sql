
-- Create roadmap_items table
CREATE TABLE public.roadmap_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  quarter TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'planned',
  completion INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create milestones table
CREATE TABLE public.milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  assignee TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create task_assignments table
CREATE TABLE public.task_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task TEXT NOT NULL,
  assignee TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium',
  due_date DATE NOT NULL,
  project TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create company_reports table
CREATE TABLE public.company_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT,
  author TEXT NOT NULL,
  report_type TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add triggers for updated_at
CREATE TRIGGER update_roadmap_items_updated_at
  BEFORE UPDATE ON public.roadmap_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_milestones_updated_at
  BEFORE UPDATE ON public.milestones
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_task_assignments_updated_at
  BEFORE UPDATE ON public.task_assignments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_reports_updated_at
  BEFORE UPDATE ON public.company_reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample data for roadmap_items
INSERT INTO public.roadmap_items (title, description, quarter, status, completion) VALUES
('Product Launch Phase 1', 'Initial product release with core features', 'Q2 2024', 'in-progress', 75),
('Market Expansion', 'Expand to European markets', 'Q3 2024', 'planning', 25),
('Platform Integration', 'Third-party platform integrations', 'Q4 2024', 'planned', 0);

-- Insert some sample data for milestones
INSERT INTO public.milestones (title, due_date, status, assignee) VALUES
('MVP Release', '2024-07-15', 'completed', 'Development Team'),
('Beta Testing Complete', '2024-08-01', 'in-progress', 'QA Team'),
('Production Deployment', '2024-08-15', 'pending', 'DevOps Team');

-- Insert some sample data for task_assignments
INSERT INTO public.task_assignments (task, assignee, priority, due_date, project, status, completed) VALUES
('UI/UX Design Review', 'Sarah Johnson', 'high', '2024-06-20', 'Product Launch', 'in-progress', false),
('Database Migration', 'Mike Chen', 'medium', '2024-06-25', 'Platform Integration', 'pending', false),
('Performance Testing', 'Alex Rodriguez', 'high', '2024-06-22', 'Product Launch', 'completed', true),
('Security Audit', 'Emma Davis', 'high', '2024-06-30', 'Product Launch', 'completed', true);

-- Insert some sample data for company_reports
INSERT INTO public.company_reports (title, description, author, report_type) VALUES
('Weekly Sales Report - June Week 2', 'Comprehensive sales analysis for the second week of June', 'Sales Team', 'sales'),
('Operations Summary - June Week 2', 'Operational metrics and KPIs for June week 2', 'Operations Team', 'operations'),
('Weekly Sales Report - June Week 1', 'Sales performance review for first week of June', 'Sales Team', 'sales'),
('Operations Summary - June Week 1', 'Operations overview for the first week of June', 'Operations Team', 'operations');
