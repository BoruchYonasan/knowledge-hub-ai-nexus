
import React, { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Edit, Save, X, Trash2, ChevronDown, ChevronRight } from 'lucide-react';

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

interface GanttTableRowProps {
  item: GanttItem;
  isSelected: boolean;
  onSelect: (id: number, selected: boolean) => void;
  onEdit: (item: GanttItem) => void;
  onDelete: (id: number) => void;
  isManaging: boolean;
  assignees: string[];
  hasSubItems: boolean;
  isExpanded: boolean;
  onToggleExpand: (id: number) => void;
  level: number;
}

const GanttTableRow: React.FC<GanttTableRowProps> = ({
  item,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  isManaging,
  assignees,
  hasSubItems,
  isExpanded,
  onToggleExpand,
  level
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(item);

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'On Hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSave = () => {
    onEdit(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(item);
    setIsEditing(false);
  };

  const indentStyle = { paddingLeft: `${level * 20}px` };

  return (
    <TableRow className={`${isSelected ? 'bg-blue-50' : ''} ${level > 0 ? 'bg-gray-50' : ''}`}>
      <TableCell className="w-8">
        {isManaging && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={(checked) => onSelect(item.id, checked as boolean)}
          />
        )}
      </TableCell>
      
      <TableCell style={indentStyle}>
        <div className="flex items-center space-x-2">
          {hasSubItems && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleExpand(item.id)}
              className="h-6 w-6 p-0"
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          )}
          {isEditing ? (
            <Input
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="font-medium"
            />
          ) : (
            <span className="font-medium">{item.title}</span>
          )}
        </div>
      </TableCell>

      <TableCell>
        <Badge variant="outline" className={
          item.type === 'milestone' ? 'border-purple-200 text-purple-700' :
          item.type === 'task' ? 'border-blue-200 text-blue-700' :
          'border-green-200 text-green-700'
        }>
          {item.type}
        </Badge>
      </TableCell>

      <TableCell>
        {isEditing ? (
          <Input
            type="date"
            value={editData.startDate}
            onChange={(e) => setEditData({ ...editData, startDate: e.target.value })}
          />
        ) : (
          new Date(item.startDate).toLocaleDateString()
        )}
      </TableCell>

      <TableCell>
        {isEditing ? (
          <Input
            type="date"
            value={editData.endDate}
            onChange={(e) => setEditData({ ...editData, endDate: e.target.value })}
          />
        ) : (
          new Date(item.endDate).toLocaleDateString()
        )}
      </TableCell>

      <TableCell>{calculateDuration(item.startDate, item.endDate)} days</TableCell>

      <TableCell>
        <div className="flex items-center space-x-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${item.progress}%` }}
            ></div>
          </div>
          {isEditing ? (
            <Input
              type="number"
              min="0"
              max="100"
              value={editData.progress}
              onChange={(e) => setEditData({ ...editData, progress: parseInt(e.target.value) || 0 })}
              className="w-16"
            />
          ) : (
            <span className="text-sm text-gray-600">{item.progress}%</span>
          )}
        </div>
      </TableCell>

      <TableCell>
        {isEditing ? (
          <Select
            value={editData.assignee}
            onValueChange={(value) => setEditData({ ...editData, assignee: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {assignees.map(assignee => (
                <SelectItem key={assignee} value={assignee}>{assignee}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          item.assignee
        )}
      </TableCell>

      <TableCell>
        {isEditing ? (
          <Select
            value={editData.priority}
            onValueChange={(value) => setEditData({ ...editData, priority: value as any })}
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
        ) : (
          <Badge className={getPriorityColor(item.priority)}>
            {item.priority}
          </Badge>
        )}
      </TableCell>

      <TableCell>
        {isEditing ? (
          <Select
            value={editData.status}
            onValueChange={(value) => setEditData({ ...editData, status: value as any })}
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
        ) : (
          <Badge className={getStatusColor(item.status)}>
            {item.status}
          </Badge>
        )}
      </TableCell>

      {isManaging && (
        <TableCell>
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <Button size="sm" onClick={handleSave}>
                  <Save className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(item.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </TableCell>
      )}
    </TableRow>
  );
};

export default GanttTableRow;
