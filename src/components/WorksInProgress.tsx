import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, Users, Target, Plus } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import AddProjectDialog from './AddProjectDialog';

interface WorksInProgressProps {
  onNavigate?: (page: string, tab?: string) => void;
  isManaging?: boolean;
}

const WorksInProgress: React.FC<WorksInProgressProps> = ({ onNavigate, isManaging = false }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { projects, addProject, updateProject, deleteProject } = useProjects();

  const handleAddProject = (projectData: {
    title: string;
    description: string;
    status: 'planning' | 'in-progress' | 'review' | 'completed';
    priority: 'low' | 'medium' | 'high';
    assignee: string;
    dueDate: string;
  }) => {
    addProject({
      ...projectData,
      progress: 0,
      tags: [],
    });
    setIsAddDialogOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in-progress':
        return 'secondary';
      case 'review':
        return 'outline';
      case 'planning':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Works in Progress</h2>
          <p className="text-gray-600">Track ongoing projects and their progress</p>
        </div>
        {isManaging && (
          <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{project.title}</CardTitle>
                <Badge variant={getPriorityColor(project.priority)}>{project.priority}</Badge>
              </div>
              <p className="text-sm text-gray-600">{project.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="w-full" />
              
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center">
                  <Users className="w-3 h-3 mr-1" />
                  {project.assignee}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(project.dueDate).toLocaleDateString()}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <Badge variant={getStatusColor(project.status)}>{project.status}</Badge>
                <div className="flex space-x-1">
                  {project.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddProjectDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddProject={handleAddProject}
      />
    </div>
  );
};

export default WorksInProgress;
