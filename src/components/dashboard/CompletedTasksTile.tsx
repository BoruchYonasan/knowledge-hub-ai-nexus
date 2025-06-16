
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock } from 'lucide-react';
import { useTaskAssignments } from '@/hooks/useTaskAssignments';

interface CompletedTasksTileProps {
  onNavigate: (page: string, tab?: string) => void;
}

const CompletedTasksTile: React.FC<CompletedTasksTileProps> = ({ onNavigate }) => {
  const { completedTasks } = useTaskAssignments();

  // Get the most recent completed tasks
  const recentCompletedTasks = completedTasks
    .sort((a, b) => new Date(b.completed_at || b.updated_at).getTime() - new Date(a.completed_at || a.updated_at).getTime())
    .slice(0, 4);

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onNavigate('project-central', 'completed')}
    >
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center justify-between">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 mr-2" />
            Completed Tasks
          </div>
          <span className="text-sm font-normal text-blue-600">View All →</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentCompletedTasks.length > 0 ? (
          recentCompletedTasks.map((task) => (
            <div key={task.id} className="flex items-start space-x-3 p-2 rounded hover:bg-gray-50 transition-colors">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm">
                    <span className="font-medium text-gray-900">{task.task}</span>
                  </p>
                  <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-1">
                  {task.project} • {task.assignee}
                </p>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  {task.completed_at 
                    ? `Completed ${new Date(task.completed_at).toLocaleDateString()}`
                    : `Due ${new Date(task.due_date).toLocaleDateString()}`
                  }
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            <p className="text-sm">No completed tasks yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompletedTasksTile;
