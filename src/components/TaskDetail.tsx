
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Calendar, User, AlertCircle, Link2, CheckSquare } from 'lucide-react';
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

interface TaskDetailProps {
  task: GanttItem;
  onBack: () => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ task, onBack }) => {
  if (!task) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Task Not Found</h2>
          <p className="text-gray-600 mb-6">The task you're looking for doesn't exist.</p>
          <Button onClick={onBack} className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Gantt Chart
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-500';
      case 'In Progress': return 'bg-blue-500';
      case 'On Hold': return 'bg-yellow-500';
      case 'Not Started': return 'bg-gray-500';
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

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBack}
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Gantt Chart
        </Button>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getTypeIcon(task.type)}</span>
            <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
          </div>
          <p className="text-gray-600 capitalize">{task.type} Details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckSquare className="w-5 h-5 mr-2" />
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {task.description && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{task.description}</p>
                </div>
              )}
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Progress</h3>
                <div className="flex items-center space-x-4">
                  <Progress value={task.progress} className="flex-1" />
                  <span className="text-sm font-medium text-gray-600">{task.progress}%</span>
                </div>
              </div>

              {task.resources && task.resources.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Resources</h3>
                  <div className="flex flex-wrap gap-2">
                    {task.resources.map((resource, index) => (
                      <Badge key={index} variant="outline">
                        {resource}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {task.dependencies && task.dependencies.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Link2 className="w-4 h-4 mr-1" />
                    Dependencies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {task.dependencies.map((dependency, index) => (
                      <Badge key={index} variant="secondary">
                        {dependency}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Type</label>
                <div className="mt-1">
                  <Badge variant="outline" className="text-base capitalize">
                    {task.type}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Assignee</label>
                <div className="mt-1 flex items-center">
                  <User className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-gray-900">{task.assignee}</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Priority</label>
                <div className="mt-1">
                  <Badge className={getPriorityColor(task.priority)}>
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {task.priority}
                  </Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <div className="mt-1 flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(task.status)}`}></div>
                  <Badge className={`${getStatusColor(task.status)} text-white`}>
                    {task.status}
                  </Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Start Date</label>
                <p className="text-gray-900">{format(new Date(task.startDate), 'MMMM dd, yyyy')}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">End Date</label>
                <p className="text-gray-900">{format(new Date(task.endDate), 'MMMM dd, yyyy')}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Created</label>
                <p className="text-gray-900">{format(new Date(task.created_at), 'MMM dd, yyyy')}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Last Updated</label>
                <p className="text-gray-900">{format(new Date(task.updated_at), 'MMM dd, yyyy')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
