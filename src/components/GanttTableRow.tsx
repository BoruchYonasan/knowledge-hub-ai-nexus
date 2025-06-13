
import React, { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

interface GanttItem {
  id: string;
  title: string;
  type: 'milestone' | 'task' | 'subtask';
  parent_id?: string;
  assignee: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Not Started' | 'In Progress' | 'Completed' | 'On Hold';
  startDate: string;
  endDate: string;
  progress: number;
  resources: string[];
  dependencies: string[];
  description?: string;
  created_at: string;
  updated_at: string;
}

interface GanttTableRowProps {
  item: GanttItem;
  isSelected: boolean;
  onSelect: (id: string, selected: boolean) => void;
  onEdit: (item: GanttItem) => void;
  onDelete: (id: string) => void;
  isManaging: boolean;
  assignees: string[];
  hasSubItems?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: (id: string) => void;
  level?: number;
}

const GanttTableRow: React.FC<GanttTableRowProps> = ({
  item,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  isManaging,
  assignees,
  hasSubItems = false,
  isExpanded = false,
  onToggleExpand,
  level = 0
}) => {
  const [editingField, setEditingField] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-500';
      case 'In Progress': return 'bg-blue-500';
      case 'On Hold': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50 border-red-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'milestone': return '🎯';
      case 'task': return '📋';
      case 'subtask': return '📝';
      default: return '📋';
    }
  };

  const handleFieldUpdate = async (field: string, value: any) => {
    const updatedItem = { ...item, [field]: value };
    await onEdit(updatedItem);
    setEditingField(null);
  };

  const paddingLeft = level * 20;

  return (
    <TableRow className={isSelected ? 'bg-blue-50' : ''}>
      {isManaging && (
        <TableCell className="w-8">
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(item.id, !!checked)}
          />
        </TableCell>
      )}
      
      <TableCell style={{ paddingLeft: `${paddingLeft + 16}px` }}>
        <div className="flex items-center space-x-2">
          {hasSubItems && onToggleExpand && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleExpand(item.id)}
              className="p-1 h-6 w-6"
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          )}
          <span className="mr-2">{getTypeIcon(item.type)}</span>
          <span className="font-medium">{item.title}</span>
        </div>
      </TableCell>

      <TableCell>
        <Badge variant="outline" className="capitalize">
          {item.type}
        </Badge>
      </TableCell>

      <TableCell>
        {format(new Date(item.startDate), 'MMM dd, yyyy')}
      </TableCell>

      <TableCell>
        {format(new Date(item.endDate), 'MMM dd, yyyy')}
      </TableCell>

      <TableCell>
        <div className="flex items-center space-x-2">
          <Progress value={item.progress} className="w-16" />
          <span className="text-sm text-gray-600">{item.progress}%</span>
        </div>
      </TableCell>

      <TableCell>
        {isManaging && editingField === 'assignee' ? (
          <Select value={item.assignee} onValueChange={(value) => handleFieldUpdate('assignee', value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {assignees.map(assignee => (
                <SelectItem key={assignee} value={assignee}>{assignee}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <span 
            className={isManaging ? "cursor-pointer hover:bg-gray-100 px-2 py-1 rounded" : ""}
            onClick={() => isManaging && setEditingField('assignee')}
          >
            {item.assignee}
          </span>
        )}
      </TableCell>

      <TableCell>
        <Badge className={getPriorityColor(item.priority)}>
          {item.priority}
        </Badge>
      </TableCell>

      <TableCell>
        {isManaging && editingField === 'status' ? (
          <Select value={item.status} onValueChange={(value) => handleFieldUpdate('status', value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Not Started">Not Started</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <div 
            className={`flex items-center space-x-2 ${isManaging ? "cursor-pointer hover:bg-gray-100 px-2 py-1 rounded" : ""}`}
            onClick={() => isManaging && setEditingField('status')}
          >
            <div className={`w-2 h-2 rounded-full ${getStatusColor(item.status)}`}></div>
            <span>{item.status}</span>
          </div>
        )}
      </TableCell>

      {isManaging && (
        <TableCell>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(item)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(item.id)}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      )}
    </TableRow>
  );
};

export default GanttTableRow;
