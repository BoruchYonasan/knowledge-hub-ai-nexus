
-- Enable RLS on all affected tables
ALTER TABLE public.roadmap_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_reports ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for roadmap_items
CREATE POLICY "Company members can manage roadmap items" ON public.roadmap_items
  FOR ALL USING (true) WITH CHECK (true);

-- Add RLS policies for milestones
CREATE POLICY "Company members can manage milestones" ON public.milestones
  FOR ALL USING (true) WITH CHECK (true);

-- Add RLS policies for task_assignments
CREATE POLICY "Company members can manage task assignments" ON public.task_assignments
  FOR ALL USING (true) WITH CHECK (true);

-- Add RLS policies for company_reports
CREATE POLICY "Company members can manage company reports" ON public.company_reports
  FOR ALL USING (true) WITH CHECK (true);
