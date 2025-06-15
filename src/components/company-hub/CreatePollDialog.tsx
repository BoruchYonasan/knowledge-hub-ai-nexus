
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Clock, X, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useCreatePoll } from '@/hooks/useMeetingPolls';

interface CreatePollDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreatePollDialog: React.FC<CreatePollDialogProps> = ({ open, onOpenChange }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState<Date>();
  const [timeSlots, setTimeSlots] = useState<Array<{ date: Date; startTime: string; endTime: string }>>([]);
  const [attendees, setAttendees] = useState<string[]>([]);
  const [newTimeSlot, setNewTimeSlot] = useState({ date: undefined as Date | undefined, startTime: '', endTime: '' });

  const createPoll = useCreatePoll();

  // Mock team members - in real app, get from team directory
  const teamMembers = [
    { id: 'sarah-johnson', name: 'Sarah Johnson', email: 'sarah@company.com' },
    { id: 'mike-chen', name: 'Mike Chen', email: 'mike@company.com' },
    { id: 'emily-watson', name: 'Emily Watson', email: 'emily@company.com' },
    { id: 'david-kim', name: 'David Kim', email: 'david@company.com' },
  ];

  const handleAddTimeSlot = () => {
    if (newTimeSlot.date && newTimeSlot.startTime && newTimeSlot.endTime) {
      setTimeSlots([...timeSlots, { ...newTimeSlot, date: newTimeSlot.date }]);
      setNewTimeSlot({ date: undefined, startTime: '', endTime: '' });
    }
  };

  const handleRemoveTimeSlot = (index: number) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const handleToggleAttendee = (memberId: string) => {
    if (attendees.includes(memberId)) {
      setAttendees(attendees.filter(id => id !== memberId));
    } else {
      setAttendees([...attendees, memberId]);
    }
  };

  const handleSubmit = async () => {
    if (!title || !deadline || timeSlots.length === 0) return;

    try {
      const options = timeSlots.map(slot => {
        const startDate = new Date(slot.date);
        const endDate = new Date(slot.date);
        
        const [startHours, startMinutes] = slot.startTime.split(':');
        const [endHours, endMinutes] = slot.endTime.split(':');
        
        startDate.setHours(parseInt(startHours), parseInt(startMinutes));
        endDate.setHours(parseInt(endHours), parseInt(endMinutes));

        return {
          start_time: startDate.toISOString(),
          end_time: endDate.toISOString()
        };
      });

      await createPoll.mutateAsync({
        poll: {
          title,
          description,
          creator_id: 'current-user', // In real app, get from auth
          deadline: deadline.toISOString(),
          status: 'active'
        },
        options,
        attendees
      });

      // Reset form
      setTitle('');
      setDescription('');
      setDeadline(undefined);
      setTimeSlots([]);
      setAttendees([]);
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating poll:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Meeting Poll</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Meeting Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter meeting title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter meeting description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Poll Deadline</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, 'PPP') : 'Select deadline'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={setDeadline}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-4">
            <Label>Time Slot Options</Label>
            
            {/* Add new time slot */}
            <div className="border rounded-lg p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newTimeSlot.date ? format(newTimeSlot.date, 'PP') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newTimeSlot.date}
                        onSelect={(date) => setNewTimeSlot({ ...newTimeSlot, date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={newTimeSlot.startTime}
                    onChange={(e) => setNewTimeSlot({ ...newTimeSlot, startTime: e.target.value })}
                  />
                </div>
                <div>
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={newTimeSlot.endTime}
                    onChange={(e) => setNewTimeSlot({ ...newTimeSlot, endTime: e.target.value })}
                  />
                </div>
              </div>
              <Button onClick={handleAddTimeSlot} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Time Slot
              </Button>
            </div>

            {/* Added time slots */}
            {timeSlots.map((slot, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-4 h-4 text-gray-500" />
                  <span>{format(slot.date, 'EEE, MMM d')}</span>
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{slot.startTime} - {slot.endTime}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveTimeSlot(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <Label>Required Attendees</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    attendees.includes(member.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleToggleAttendee(member.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-gray-600">{member.email}</div>
                    </div>
                    {attendees.includes(member.id) && (
                      <Badge variant="default">Selected</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!title || !deadline || timeSlots.length === 0 || createPoll.isPending}
            >
              {createPoll.isPending ? 'Creating...' : 'Create Poll'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePollDialog;
