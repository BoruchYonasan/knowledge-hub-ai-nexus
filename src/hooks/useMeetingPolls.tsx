
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type MeetingPoll = Tables<'meeting_polls'>;
type PollOption = Tables<'poll_options'>;
type PollResponse = Tables<'poll_responses'>;
type PollAttendee = Tables<'poll_attendees'>;

export const useMeetingPolls = () => {
  return useQuery({
    queryKey: ['meeting-polls'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meeting_polls')
        .select(`
          *,
          poll_options(*),
          poll_attendees(*),
          poll_responses(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreatePoll = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (pollData: {
      poll: TablesInsert<'meeting_polls'>;
      options: Omit<TablesInsert<'poll_options'>, 'poll_id'>[];
      attendees: string[];
    }) => {
      const { data: poll, error: pollError } = await supabase
        .from('meeting_polls')
        .insert(pollData.poll)
        .select()
        .single();
      
      if (pollError) throw pollError;
      
      const options = pollData.options.map(option => ({
        ...option,
        poll_id: poll.id
      }));
      
      const { error: optionsError } = await supabase
        .from('poll_options')
        .insert(options);
      
      if (optionsError) throw optionsError;
      
      const attendees = pollData.attendees.map(userId => ({
        poll_id: poll.id,
        user_id: userId,
        is_required: true
      }));
      
      const { error: attendeesError } = await supabase
        .from('poll_attendees')
        .insert(attendees);
      
      if (attendeesError) throw attendeesError;
      
      return poll;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meeting-polls'] });
    },
  });
};

export const useVoteOnPoll = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (voteData: TablesInsert<'poll_responses'>) => {
      const { data, error } = await supabase
        .from('poll_responses')
        .upsert(voteData)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meeting-polls'] });
    },
  });
};
