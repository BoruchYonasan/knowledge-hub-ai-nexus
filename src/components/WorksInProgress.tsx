
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
  const { projects, createProject, updateProject, deleteProject } = useProjects();

  const handleAddProject = async (projectData: {
    title: string;
    description: string;
    status: 'Planning' | 'In Progress' | 'Completed';
    priority: 'Low' | 'Medium' | 'High';
    lead: string;
    due_date: string;
  }) => {
    try {
      await createProject({
        ...projectData,
        progress: 0,
        attachments: [],
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'default';
      case 'In Progress':
        return 'secondary';
      case 'Planning':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'destructive';
      case 'Medium':
        return 'default';
      case 'Low':
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
                <Badge variant={getPriorityColor(project.priority || 'Medium')}>{project.priority}</Badge>
              </div>
              <p className="text-sm text-gray-600">{project.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">{project.progress || 0}%</span>
              </div>
              <Progress value={project.progress || 0} className="w-full" />
              
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center">
                  <Users className="w-3 h-3 mr-1" />
                  {project.lead}
                </div>
                {project.due_date && (
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(project.due_date).toLocaleDateString()}
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <Badge variant={getStatusColor(project.status || 'Planning')}>{project.status}</Badge>
                {project.team && (
                  <Badge variant="outline" className="text-xs">{project.team}</Badge>
                )}
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
