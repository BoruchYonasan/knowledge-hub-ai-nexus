
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Task {
  id: string;
  task: string;
  project: string;
  assignee: string;
  description?: string;
  priority: string;
  due_date: string;
  completed: boolean;
}

interface TaskAssignmentsSectionProps {
  tasks: Task[];
  isManaging: boolean;
  onAddClick: () => void;
  onEditClick: (task: Task) => void;
  onDeleteClick: (id: string) => void;
}

const TaskAssignmentsSection: React.FC<TaskAssignmentsSectionProps> = ({
  tasks,
  isManaging,
  onAddClick,
  onEditClick,
  onDeleteClick
}) => {
  return (
    <div className="space-y-4">
      {isManaging && (
        <div className="flex justify-end">
          <Button 
            className="flex items-center"
            onClick={onAddClick}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task Assignment
          </Button>
        </div>
      )}
      {tasks.filter(task => !task.completed).map((task) => (
        <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium">{task.task}</h3>
                <p className="text-sm text-gray-600">{task.project} • Assigned to {task.assignee}</p>
                {task.description && (
                  <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-right space-y-1">
                  <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
                    {task.priority}
                  </Badge>
                  <div className="text-sm text-gray-600">{new Date(task.due_date).toLocaleDateString()}</div>
                </div>
                {isManaging && (
                  <div className="flex space-x-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onEditClick(task)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onDeleteClick(task.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TaskAssignmentsSection;
