
-- Create enum types for the new features
CREATE TYPE poll_status AS ENUM ('active', 'closed', 'resolved');
CREATE TYPE vote_type AS ENUM ('available', 'busy', 'maybe');
CREATE TYPE event_type AS ENUM ('meeting', 'deadline', 'reminder', 'other');
CREATE TYPE meeting_type AS ENUM ('in-person', 'video-call', 'hybrid');
CREATE TYPE recurrence_type AS ENUM ('none', 'daily', 'weekly', 'monthly');

-- Meeting Polls System Tables
CREATE TABLE public.meeting_polls (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  creator_id TEXT NOT NULL,
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  status poll_status DEFAULT 'active',
  selected_option_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.poll_options (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  poll_id UUID REFERENCES public.meeting_polls(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.poll_responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  poll_id UUID REFERENCES public.meeting_polls(id) ON DELETE CASCADE,
  option_id UUID REFERENCES public.poll_options(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  vote vote_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(poll_id, option_id, user_id)
);

CREATE TABLE public.poll_attendees (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  poll_id UUID REFERENCES public.meeting_polls(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  is_required BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(poll_id, user_id)
);

-- Team Calendar System Tables
CREATE TABLE public.calendar_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  event_type event_type DEFAULT 'meeting',
  meeting_type meeting_type DEFAULT 'in-person',
  creator_id TEXT NOT NULL,
  recurrence_type recurrence_type DEFAULT 'none',
  recurrence_end TIMESTAMP WITH TIME ZONE,
  parent_event_id UUID REFERENCES public.calendar_events(id) ON DELETE CASCADE,
  poll_id UUID REFERENCES public.meeting_polls(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.event_attendees (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES public.calendar_events(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

CREATE TABLE public.event_reminders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES public.calendar_events(id) ON DELETE CASCADE,
  reminder_time TIMESTAMP WITH TIME ZONE NOT NULL,
  sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.meeting_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_reminders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for company-wide access
CREATE POLICY "Company members can manage meeting polls" ON public.meeting_polls FOR ALL USING (true);
CREATE POLICY "Company members can manage poll options" ON public.poll_options FOR ALL USING (true);
CREATE POLICY "Company members can manage poll responses" ON public.poll_responses FOR ALL USING (true);
CREATE POLICY "Company members can manage poll attendees" ON public.poll_attendees FOR ALL USING (true);
CREATE POLICY "Company members can manage calendar events" ON public.calendar_events FOR ALL USING (true);
CREATE POLICY "Company members can manage event attendees" ON public.event_attendees FOR ALL USING (true);
CREATE POLICY "Company members can manage event reminders" ON public.event_reminders FOR ALL USING (true);

-- Add updated_at triggers
CREATE TRIGGER update_meeting_polls_updated_at
  BEFORE UPDATE ON public.meeting_polls
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_poll_responses_updated_at
  BEFORE UPDATE ON public.poll_responses
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_calendar_events_updated_at
  BEFORE UPDATE ON public.calendar_events
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.meeting_polls;
ALTER PUBLICATION supabase_realtime ADD TABLE public.poll_options;
ALTER PUBLICATION supabase_realtime ADD TABLE public.poll_responses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.poll_attendees;
ALTER PUBLICATION supabase_realtime ADD TABLE public.calendar_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_attendees;
ALTER PUBLICATION supabase_realtime ADD TABLE public.event_reminders;

-- Insert some sample data
INSERT INTO public.meeting_polls (title, description, creator_id, deadline) VALUES
('Q3 Planning Meeting', 'Quarterly planning session for all department heads', 'Sarah Johnson', NOW() + INTERVAL '7 days'),
('Team Building Event', 'Monthly team building activity', 'Mike Chen', NOW() + INTERVAL '3 days');

INSERT INTO public.poll_options (poll_id, start_time, end_time) VALUES
((SELECT id FROM public.meeting_polls WHERE title = 'Q3 Planning Meeting'), NOW() + INTERVAL '5 days' + INTERVAL '9 hours', NOW() + INTERVAL '5 days' + INTERVAL '11 hours'),
((SELECT id FROM public.meeting_polls WHERE title = 'Q3 Planning Meeting'), NOW() + INTERVAL '6 days' + INTERVAL '14 hours', NOW() + INTERVAL '6 days' + INTERVAL '16 hours'),
((SELECT id FROM public.meeting_polls WHERE title = 'Team Building Event'), NOW() + INTERVAL '10 days' + INTERVAL '10 hours', NOW() + INTERVAL '10 days' + INTERVAL '12 hours');

INSERT INTO public.calendar_events (title, description, start_time, end_time, creator_id, event_type) VALUES
('Weekly Standup', 'Engineering team weekly standup', NOW() + INTERVAL '1 days' + INTERVAL '9 hours', NOW() + INTERVAL '1 days' + INTERVAL '10 hours', 'Sarah Johnson', 'meeting'),
('Project Deadline', 'AeroMail Pro v2.0 feature freeze', NOW() + INTERVAL '14 days', NOW() + INTERVAL '14 days' + INTERVAL '1 hour', 'Emily Watson', 'deadline');
