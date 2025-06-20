
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Calendar, Clock, Users, Target, Plus, Edit, Trash2 } from 'lucide-react';
import { useProjects } from '@/hooks/useProjects';
import AddProjectDialog from './AddProjectDialog';

interface WorksInProgressProps {
  onNavigate?: (page: string, tab?: string, data?: any) => void;
  isManaging?: boolean;
  isEmbedded?: boolean;
}

const WorksInProgress: React.FC<WorksInProgressProps> = ({ onNavigate, isManaging = false, isEmbedded = false }) => {
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

  const handleEditProject = async (projectId: string) => {
    // This would open an edit dialog - placeholder for now
    console.log('Edit project:', projectId);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(projectId);
      } catch (error) {
        // Error is handled by the hook
      }
    }
  };

  const handleProjectClick = (project: any) => {
    if (onNavigate) {
      onNavigate('project-detail', undefined, project);
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

  const content = (
    <>
      {!isEmbedded && (
        <div className="space-y-4">
          {/* Back Button - only show when not embedded */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onNavigate?.('dashboard')}
            className="flex items-center bg-white shadow-sm border-gray-300 hover:bg-gray-50 z-10 relative"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          {/* Header - only show when not embedded */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Works in Progress</h2>
            <p className="text-gray-600">Track ongoing projects and their progress</p>
          </div>
        </div>
      )}
      
      {isManaging && (
        <div className="flex justify-center mb-6">
          <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card 
            key={project.id} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleProjectClick(project)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <Badge variant={getPriorityColor(project.priority || 'Medium')} className="mt-2">
                    {project.priority}
                  </Badge>
                </div>
                {isManaging && (
                  <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditProject(project.id)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-2">{project.description}</p>
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

      {projects.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Yet</h3>
            <p className="text-gray-600 mb-4">
              {isManaging 
                ? "Get started by creating your first project." 
                : "No projects have been created yet."
              }
            </p>
            {isManaging && (
              <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center mx-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <AddProjectDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddProject={handleAddProject}
      />
    </>
  );

  // Wrap with full page layout only when not embedded
  if (isEmbedded) {
    return <div className="space-y-6">{content}</div>;
  }

  return (
    <div className="lg:ml-64 pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {content}
      </div>
    </div>
  );
};

export default WorksInProgress;
