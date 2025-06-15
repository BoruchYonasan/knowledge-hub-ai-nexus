
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Clock, Users, Plus, Vote } from 'lucide-react';
import { useMeetingPolls, useVoteOnPoll } from '@/hooks/useMeetingPolls';
import CreatePollDialog from './CreatePollDialog';
import { format } from 'date-fns';

const MeetingPolls: React.FC = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { data: polls, isLoading } = useMeetingPolls();
  const voteOnPoll = useVoteOnPoll();

  const handleVote = async (pollId: string, optionId: string, vote: 'available' | 'busy' | 'maybe') => {
    try {
      await voteOnPoll.mutateAsync({
        poll_id: pollId,
        option_id: optionId,
        user_id: 'current-user', // In real app, get from auth
        vote: vote
      });
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const getVoteColor = (vote: string) => {
    switch (vote) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-red-500';
      case 'maybe': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'closed': return 'secondary';
      case 'resolved': return 'outline';
      default: return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-48 bg-gray-200 rounded"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Meeting Polls</h2>
          <p className="text-gray-600">Schedule meetings by polling team availability</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Create Poll
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {polls?.map((poll) => (
          <Card key={poll.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl font-semibold">{poll.title}</CardTitle>
                  <p className="text-gray-600 mt-1">{poll.description}</p>
                </div>
                <Badge variant={getStatusBadgeVariant(poll.status)}>
                  {poll.status}
                </Badge>
              </div>
              <div className="flex items-center text-sm text-gray-500 space-x-4">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Deadline: {format(new Date(poll.deadline), 'MMM d, yyyy h:mm a')}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {poll.poll_attendees?.length || 0} attendees
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Available Time Slots</h4>
                {poll.poll_options?.map((option) => (
                  <div key={option.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-medium">
                          {format(new Date(option.start_time), 'EEEE, MMMM d')}
                        </div>
                        <div className="text-sm text-gray-600">
                          {format(new Date(option.start_time), 'h:mm a')} - {format(new Date(option.end_time), 'h:mm a')}
                        </div>
                      </div>
                      {poll.status === 'active' && (
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-200 hover:bg-green-50"
                            onClick={() => handleVote(poll.id, option.id, 'available')}
                          >
                            Available
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                            onClick={() => handleVote(poll.id, option.id, 'maybe')}
                          >
                            Maybe
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleVote(poll.id, option.id, 'busy')}
                          >
                            Busy
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {/* Vote Summary */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Responses:</span>
                        <div className="flex items-center space-x-3">
                          {['available', 'maybe', 'busy'].map((voteType) => {
                            const count = poll.poll_responses?.filter(r => 
                              r.option_id === option.id && r.vote === voteType
                            ).length || 0;
                            return (
                              <div key={voteType} className="flex items-center space-x-1">
                                <div className={`w-3 h-3 rounded-full ${getVoteColor(voteType)}`}></div>
                                <span className="text-xs">{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all"
                          style={{ 
                            width: `${((poll.poll_responses?.filter(r => 
                              r.option_id === option.id && r.vote === 'available'
                            ).length || 0) / (poll.poll_attendees?.length || 1)) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {(!polls || polls.length === 0) && (
          <Card>
            <CardContent className="text-center py-12">
              <Vote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No polls yet</h3>
              <p className="text-gray-600 mb-4">Create your first meeting poll to get started</p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Poll
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <CreatePollDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
};

export default MeetingPolls;
