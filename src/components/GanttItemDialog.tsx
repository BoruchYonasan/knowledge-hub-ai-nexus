
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, X, Users, Clock, Target } from 'lucide-react';
import { format } from 'date-fns';

interface GanttItem {
  id: number;
  title: string;
  type: 'milestone' | 'task' | 'subtask';
  parentId?: number;
  startDate: string;
  endDate: string;
  progress: number;
  assignee: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Not Started' | 'In Progress' | 'Completed' | 'On Hold';
  resources: string[];
  dependencies: number[];
  description: string;
}

interface GanttItemDialogProps {
  item: GanttItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: GanttItem) => void;
  allItems: GanttItem[];
  assignees: string[];
}

const GanttItemDialog: React.FC<GanttItemDialogProps> = ({
  item,
  isOpen,
  onClose,
  onSave,
  allItems,
  assignees
}) => {
  const [formData, setFormData] = useState<Partial<GanttItem>>(
    item || {
      title: '',
      type: 'task',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      progress: 0,
      assignee: '',
      priority: 'Medium',
      status: 'Not Started',
      resources: [],
      dependencies: [],
      description: ''
    }
  );

  const [newResource, setNewResource] = useState('');

  React.useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        title: '',
        type: 'task',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        progress: 0,
        assignee: '',
        priority: 'Medium',
        status: 'Not Started',
        resources: [],
        dependencies: [],
        description: ''
      });
    }
  }, [item]);

  const handleSave = () => {
    if (formData.title && formData.startDate && formData.endDate && formData.assignee) {
      const itemToSave = {
        ...formData,
        id: item?.id || Date.now(),
      } as GanttItem;
      
      onSave(itemToSave);
      onClose();
    }
  };

  const addResource = () => {
    if (newResource.trim()) {
      setFormData(prev => ({
        ...prev,
        resources: [...(prev.resources || []), newResource.trim()]
      }));
      setNewResource('');
    }
  };

  const removeResource = (resource: string) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources?.filter(r => r !== resource) || []
    }));
  };

  const toggleDependency = (itemId: number) => {
    setFormData(prev => {
      const dependencies = prev.dependencies || [];
      const isSelected = dependencies.includes(itemId);
      
      return {
        ...prev,
        dependencies: isSelected
          ? dependencies.filter(id => id !== itemId)
          : [...dependencies, itemId]
      };
    });
  };

  const availableDependencies = allItems.filter(i => i.id !== item?.id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {item ? 'Edit Item' : 'Create New Item'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter title..."
              />
            </div>
            
            <div>
              <Label htmlFor="type">Type</Label>
              <Select 
                value={formData.type || 'task'} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="milestone">
                    <Target className="w-4 h-4 inline mr-2" />
                    Milestone
                  </SelectItem>
                  <SelectItem value="task">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Task
                  </SelectItem>
                  <SelectItem value="subtask">
                    <Users className="w-4 h-4 inline mr-2" />
                    Subtask
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(new Date(formData.startDate), 'MMM dd, yyyy') : 'Pick date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate ? new Date(formData.startDate) : undefined}
                    onSelect={(date) => setFormData(prev => ({ ...prev, startDate: date?.toISOString().split('T')[0] || '' }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? format(new Date(formData.endDate), 'MMM dd, yyyy') : 'Pick date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate ? new Date(formData.endDate) : undefined}
                    onSelect={(date) => setFormData(prev => ({ ...prev, endDate: date?.toISOString().split('T')[0] || '' }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Status and Progress */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status || 'Not Started'} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Not Started">Not Started</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={formData.priority || 'Medium'} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="progress">Progress (%)</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={formData.progress || 0}
                onChange={(e) => setFormData(prev => ({ ...prev, progress: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </div>

          {/* Assignee */}
          <div>
            <Label htmlFor="assignee">Assignee</Label>
            <Select 
              value={formData.assignee || ''} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, assignee: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select assignee..." />
              </SelectTrigger>
              <SelectContent>
                {assignees.map(assignee => (
                  <SelectItem key={assignee} value={assignee}>{assignee}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Resources */}
          <div>
            <Label>Resources</Label>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <Input
                  value={newResource}
                  onChange={(e) => setNewResource(e.target.value)}
                  placeholder="Add resource..."
                  onKeyPress={(e) => e.key === 'Enter' && addResource()}
                />
                <Button onClick={addResource} size="sm">Add</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(formData.resources || []).map(resource => (
                  <Badge key={resource} variant="secondary" className="flex items-center">
                    {resource}
                    <X
                      className="w-3 h-3 ml-1 cursor-pointer"
                      onClick={() => removeResource(resource)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Dependencies */}
          <div>
            <Label>Dependencies</Label>
            <div className="max-h-32 overflow-y-auto space-y-2 border rounded p-2">
              {availableDependencies.map(depItem => (
                <div key={depItem.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={(formData.dependencies || []).includes(depItem.id)}
                    onChange={() => toggleDependency(depItem.id)}
                    className="rounded"
                  />
                  <span className="text-sm">{depItem.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter description..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {item ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GanttItemDialog;
