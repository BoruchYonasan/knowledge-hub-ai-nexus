
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Users, CheckCircle } from 'lucide-react';

interface GanttBulkActionsProps {
  selectedItems: string[]; // Changed from number[] to string[]
  onClearSelection: () => void;
  onBulkStatusUpdate: (status: string) => void;
  onBulkAssigneeUpdate: (assignee: string) => void;
  onBulkDelete: () => void;
  assignees: string[];
}

const GanttBulkActions: React.FC<GanttBulkActionsProps> = ({
  selectedItems,
  onClearSelection,
  onBulkStatusUpdate,
  onBulkAssigneeUpdate,
  onBulkDelete,
  assignees
}) => {
  if (selectedItems.length === 0) return null;

  return (
    <div className="flex items-center space-x-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center space-x-2">
        <Badge variant="secondary">
          {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
        </Badge>
        <Button variant="ghost" size="sm" onClick={onClearSelection}>
          Clear
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Select onValueChange={onBulkStatusUpdate}>
          <SelectTrigger className="w-40">
            <CheckCircle className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Update Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Not Started">Not Started</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="On Hold">On Hold</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={onBulkAssigneeUpdate}>
          <SelectTrigger className="w-40">
            <Users className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Reassign To" />
          </SelectTrigger>
          <SelectContent>
            {assignees.map(assignee => (
              <SelectItem key={assignee} value={assignee}>{assignee}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="destructive" size="sm" onClick={onBulkDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Selected
        </Button>
      </div>
    </div>
  );
};

export default GanttBulkActions;
