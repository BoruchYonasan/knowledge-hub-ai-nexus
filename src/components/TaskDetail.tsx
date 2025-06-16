
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

interface TaskAssignment {
  id: string;
  task: string;
  assignee: string;
  priority: string;
  due_date: string;
  project: string;
  status: string;
  description?: string;
  completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

interface TaskDetailProps {
  task: GanttItem | TaskAssignment;
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
            Back
          </Button>
        </div>
      </div>
    );
  }

  // Check if this is a Gantt item or task assignment
  const isGanttItem = 'type' in task && 'startDate' in task;
  const isTaskAssignment = 'task' in task && 'project' in task;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': 
      case 'completed': return 'bg-green-500';
      case 'In Progress': 
      case 'in_progress': return 'bg-blue-500';
      case 'On Hold': 
      case 'on_hold': return 'bg-yellow-500';
      case 'Not Started': 
      case 'pending': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    const lowerPriority = priority.toLowerCase();
    switch (lowerPriority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type?: string) => {
    if (!type) return '📋'; // Default for task assignments
    switch (type) {
      case 'milestone': return '🎯';
      case 'task': return '📋';
      case 'subtask': return '📝';
      default: return '📋';
    }
  };

  // Get the title based on item type
  const title = isGanttItem ? (task as GanttItem).title : (task as TaskAssignment).task;
  const assignee = task.assignee;
  const priority = task.priority;
  const description = task.description;
  const status = isGanttItem ? (task as GanttItem).status : (task as TaskAssignment).status;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Fixed Header Layout */}
      <div className="space-y-4">
        <div className="flex justify-start">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onBack}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
        
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-2xl">{getTypeIcon(isGanttItem ? (task as GanttItem).type : undefined)}</span>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          </div>
          <p className="text-gray-600">
            {isGanttItem ? `${(task as GanttItem).type} Details` : 'Task Assignment Details'}
          </p>
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
              {description && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{description}</p>
                </div>
              )}
              
              {isGanttItem && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Progress</h3>
                  <div className="flex items-center space-x-4">
                    <Progress value={(task as GanttItem).progress} className="flex-1" />
                    <span className="text-sm font-medium text-gray-600">{(task as GanttItem).progress}%</span>
                  </div>
                </div>
              )}

              {isGanttItem && (task as GanttItem).resources && (task as GanttItem).resources.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Resources</h3>
                  <div className="flex flex-wrap gap-2">
                    {(task as GanttItem).resources.map((resource, index) => (
                      <Badge key={index} variant="outline">
                        {resource}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {isGanttItem && (task as GanttItem).dependencies && (task as GanttItem).dependencies.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Link2 className="w-4 h-4 mr-1" />
                    Dependencies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(task as GanttItem).dependencies.map((dependency, index) => (
                      <Badge key={index} variant="secondary">
                        {dependency}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {isTaskAssignment && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Project</h3>
                  <p className="text-gray-700">{(task as TaskAssignment).project}</p>
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
              {isGanttItem && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Type</label>
                  <div className="mt-1">
                    <Badge variant="outline" className="text-base capitalize">
                      {(task as GanttItem).type}
                    </Badge>
                  </div>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-600">Assignee</label>
                <div className="mt-1 flex items-center">
                  <User className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-gray-900">{assignee}</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Priority</label>
                <div className="mt-1">
                  <Badge className={getPriorityColor(priority)}>
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {priority}
                  </Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <div className="mt-1 flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></div>
                  <Badge className={`${getStatusColor(status)} text-white`}>
                    {status}
                  </Badge>
                </div>
              </div>
              
              {isGanttItem ? (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Start Date</label>
                    <p className="text-gray-900">{format(new Date((task as GanttItem).startDate), 'MMMM dd, yyyy')}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-600">End Date</label>
                    <p className="text-gray-900">{format(new Date((task as GanttItem).endDate), 'MMMM dd, yyyy')}</p>
                  </div>
                </>
              ) : (
                <div>
                  <label className="text-sm font-medium text-gray-600">Due Date</label>
                  <p className="text-gray-900">{format(new Date((task as TaskAssignment).due_date), 'MMMM dd, yyyy')}</p>
                </div>
              )}
              
              {isTaskAssignment && (task as TaskAssignment).completed_at && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Completed</label>
                  <p className="text-gray-900">{format(new Date((task as TaskAssignment).completed_at), 'MMMM dd, yyyy')}</p>
                </div>
              )}
              
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
