
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, User, Target, Plus, Edit, Trash2, CheckCircle, Clock } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import { useContentManager } from '@/hooks/useContentManager';

const WorksInProgress: React.FC = () => {
  const { projects, loading, toggleTask } = useProjects();
  const { createProjectFromAI, editProjectFromAI, deleteProjectFromAI } = useContentManager();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [newTaskInputs, setNewTaskInputs] = useState<{ [key: string]: string }>({});

  // Listen for AI-created projects
  useEffect(() => {
    const handleAICreatedProject = (event: CustomEvent) => {
      const newProject = event.detail;
      // The hook will automatically refetch
    };

    const handleAIEditedProject = (event: CustomEvent) => {
      const updatedProject = event.detail;
      // Handle AI edits
    };

    const handleAIDeletedProject = (event: CustomEvent) => {
      const { id } = event.detail;
      // Handle AI deletions  
    };

    window.addEventListener('ai-created-project', handleAICreatedProject as EventListener);
    window.addEventListener('ai-edited-project', handleAIEditedProject as EventListener);
    window.addEventListener('ai-deleted-project', handleAIDeletedProject as EventListener);

    return () => {
      window.removeEventListener('ai-created-project', handleAICreatedProject as EventListener);
      window.removeEventListener('ai-edited-project', handleAIEditedProject as EventListener);
      window.removeEventListener('ai-deleted-project', handleAIDeletedProject as EventListener);
    };
  }, []);

  const filteredProjects = projects.filter(project => {
    if (selectedStatus === 'all') return true;
    return project.status === selectedStatus;
  });

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No date set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planning': return 'secondary';
      case 'In Progress': return 'default';
      case 'Completed': return 'default';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'default';
      case 'Low': return 'secondary';
      default: return 'default';
    }
  };

  const handleTaskToggle = async (taskId: string, completed: boolean) => {
    await toggleTask(taskId, completed);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Works in Progress</h1>
          <p className="text-gray-600">Track ongoing projects and their progress</p>
        </div>
        <Button className="flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
        <TabsList>
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="Planning">Planning</TabsTrigger>
          <TabsTrigger value="In Progress">In Progress</TabsTrigger>
          <TabsTrigger value="Completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedStatus} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map(project => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant={getStatusColor(project.status) as any}>
                          {project.status}
                        </Badge>
                        <Badge variant={getPriorityColor(project.priority) as any}>
                          {project.priority}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>Lead: {project.lead}</span>
                        </div>
                        {project.team && (
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            <span>Team: {project.team}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Due: {formatDate(project.due_date)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {project.description && (
                    <p className="text-gray-700 text-sm">{project.description}</p>
                  )}
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-gray-600">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>

                  {project.tasks && project.tasks.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Tasks</h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {project.tasks.map(task => (
                          <div key={task.id} className="flex items-center gap-2">
                            <button
                              onClick={() => handleTaskToggle(task.id, !task.completed)}
                              className={`w-4 h-4 rounded border flex items-center justify-center ${
                                task.completed 
                                  ? 'bg-green-500 border-green-500 text-white' 
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              {task.completed && <CheckCircle className="w-3 h-3" />}
                            </button>
                            <span className={`text-sm flex-1 ${
                              task.completed ? 'line-through text-gray-500' : 'text-gray-700'
                            }`}>
                              {task.name}
                            </span>
                            {task.in_progress && !task.completed && (
                              <Clock className="w-4 h-4 text-blue-500" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {project.attachments && project.attachments.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Attachments</h4>
                      <div className="flex flex-wrap gap-1">
                        {project.attachments.map((attachment, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {attachment}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-600">
                {selectedStatus === 'all' 
                  ? 'No projects have been created yet.'
                  : `No projects with status "${selectedStatus}".`
                }
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorksInProgress;
