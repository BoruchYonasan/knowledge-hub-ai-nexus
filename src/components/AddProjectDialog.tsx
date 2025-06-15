
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface AddProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddProject: (projectData: {
    title: string;
    description: string;
    status: 'Planning' | 'In Progress' | 'Completed';
    priority: 'Low' | 'Medium' | 'High';
    lead: string;
    due_date: string;
  }) => void;
}

const AddProjectDialog: React.FC<AddProjectDialogProps> = ({ open, onOpenChange, onAddProject }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    lead: '',
    team: '',
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    startDate: '',
    dueDate: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.lead) {
      toast({
        title: "Missing required fields",
        description: "Please fill in title and project lead",
        variant: "destructive"
      });
      return;
    }

    try {
      onAddProject({
        title: formData.title,
        description: formData.description,
        lead: formData.lead,
        status: 'Planning',
        priority: formData.priority,
        due_date: formData.dueDate
      });

      setFormData({
        title: '',
        description: '',
        lead: '',
        team: '',
        priority: 'Medium',
        startDate: '',
        dueDate: ''
      });
    } catch (error) {
      // Error is handled by the parent component
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Project Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Project title..."
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Project Lead *</label>
              <Input
                value={formData.lead}
                onChange={(e) => setFormData(prev => ({ ...prev, lead: e.target.value }))}
                placeholder="Lead name..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Team</label>
              <Input
                value={formData.team}
                onChange={(e) => setFormData(prev => ({ ...prev, team: e.target.value }))}
                placeholder="Team name..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Priority</label>
            <Select value={formData.priority} onValueChange={(value: 'High' | 'Medium' | 'Low') => setFormData(prev => ({ ...prev, priority: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Project description..."
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Due Date</label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Create Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProjectDialog;
