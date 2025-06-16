
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Edit, Trash2 } from 'lucide-react';

interface CompletedTask {
  id: string;
  task: string;
  project: string;
  assignee: string;
  description?: string;
  due_date: string;
  completed_at?: string;
}

interface CompletedTasksSectionProps {
  completedTasks: CompletedTask[];
  isManaging: boolean;
  onEditClick: (task: CompletedTask) => void;
  onDeleteClick: (id: string) => void;
  onNavigate?: (page: string, tab?: string, data?: any) => void;
}

const CompletedTasksSection: React.FC<CompletedTasksSectionProps> = ({
  completedTasks,
  isManaging,
  onEditClick,
  onDeleteClick,
  onNavigate
}) => {
  const handleTaskClick = (task: CompletedTask) => {
    if (onNavigate && !isManaging) {
      onNavigate('task-detail', undefined, task);
    }
  };

  return (
    <div className="space-y-4">
      {completedTasks.map((task) => (
        <Card 
          key={task.id} 
          className={`${!isManaging ? 'cursor-pointer' : ''} hover:shadow-md transition-shadow`}
          onClick={() => handleTaskClick(task)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div className="flex-1">
                  <h3 className="font-medium">{task.task}</h3>
                  <p className="text-sm text-gray-600">{task.project} • Completed by {task.assignee}</p>
                  {task.description && (
                    <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                  )}
                  {task.completed_at && (
                    <p className="text-xs text-gray-400 mt-1">
                      Completed on {new Date(task.completed_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-right space-y-1">
                  <Badge variant="default">Completed</Badge>
                  <div className="text-sm text-gray-600">{new Date(task.due_date).toLocaleDateString()}</div>
                </div>
                {isManaging && (
                  <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
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

export default CompletedTasksSection;
