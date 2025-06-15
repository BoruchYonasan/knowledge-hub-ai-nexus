
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type CalendarEvent = Tables<'calendar_events'>;
type EventAttendee = Tables<'event_attendees'>;

export const useCalendarEvents = () => {
  return useQuery({
    queryKey: ['calendar-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('calendar_events')
        .select(`
          *,
          event_attendees(*)
        `)
        .order('start_time', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (eventData: {
      event: TablesInsert<'calendar_events'>;
      attendees: string[];
    }) => {
      const { data: event, error: eventError } = await supabase
        .from('calendar_events')
        .insert(eventData.event)
        .select()
        .single();
      
      if (eventError) throw eventError;
      
      if (eventData.attendees.length > 0) {
        const attendees = eventData.attendees.map(userId => ({
          event_id: event.id,
          user_id: userId,
          status: 'pending'
        }));
        
        const { error: attendeesError } = await supabase
          .from('event_attendees')
          .insert(attendees);
        
        if (attendeesError) throw attendeesError;
      }
      
      return event;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (eventData: {
      id: string;
      event: TablesUpdate<'calendar_events'>;
      attendees?: string[];
    }) => {
      const { data: event, error: eventError } = await supabase
        .from('calendar_events')
        .update(eventData.event)
        .eq('id', eventData.id)
        .select()
        .single();
      
      if (eventError) throw eventError;
      
      if (eventData.attendees) {
        await supabase
          .from('event_attendees')
          .delete()
          .eq('event_id', eventData.id);
        
        const attendees = eventData.attendees.map(userId => ({
          event_id: eventData.id,
          user_id: userId,
          status: 'pending'
        }));
        
        const { error: attendeesError } = await supabase
          .from('event_attendees')
          .insert(attendees);
        
        if (attendeesError) throw attendeesError;
      }
      
      return event;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
    },
  });
};
