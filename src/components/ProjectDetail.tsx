
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Calendar, User, Users, Paperclip, AlertCircle, Briefcase } from 'lucide-react';
import { format } from 'date-fns';

interface Project {
  id: string;
  title: string;
  description?: string;
  lead: string;
  team?: string;
  status: 'Planning' | 'In Progress' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
  progress: number;
  start_date?: string;
  due_date?: string;
  attachments: string[];
  created_at: string;
  updated_at: string;
}

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack }) => {
  if (!project) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h2>
          <p className="text-gray-600 mb-6">The project you're looking for doesn't exist.</p>
          <Button onClick={onBack} className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-500';
      case 'In Progress': return 'bg-blue-500';
      case 'Planning': return 'bg-yellow-500';
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
            Back to Projects
          </Button>
        </div>
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
          <p className="text-gray-600">Project Details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="w-5 h-5 mr-2" />
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.description && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{project.description}</p>
                </div>
              )}
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Progress</h3>
                <div className="flex items-center space-x-4">
                  <Progress value={project.progress} className="flex-1" />
                  <span className="text-sm font-medium text-gray-600">{project.progress}%</span>
                </div>
              </div>

              {project.attachments && project.attachments.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Paperclip className="w-4 h-4 mr-1" />
                    Attachments ({project.attachments.length})
                  </h3>
                  <div className="space-y-2">
                    {project.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                        <Paperclip className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-700">{attachment}</span>
                      </div>
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
                <label className="text-sm font-medium text-gray-600">Project Lead</label>
                <div className="mt-1 flex items-center">
                  <User className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-gray-900">{project.lead}</span>
                </div>
              </div>

              {project.team && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Team</label>
                  <div className="mt-1 flex items-center">
                    <Users className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-gray-900">{project.team}</span>
                  </div>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-gray-600">Priority</label>
                <div className="mt-1">
                  <Badge className={getPriorityColor(project.priority)}>
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {project.priority}
                  </Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <div className="mt-1">
                  <Badge className={`${getStatusColor(project.status)} text-white`}>
                    {project.status}
                  </Badge>
                </div>
              </div>
              
              {project.start_date && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Start Date</label>
                  <p className="text-gray-900">{format(new Date(project.start_date), 'MMMM dd, yyyy')}</p>
                </div>
              )}
              
              {project.due_date && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Due Date</label>
                  <p className="text-gray-900">{format(new Date(project.due_date), 'MMMM dd, yyyy')}</p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-gray-600">Created</label>
                <p className="text-gray-900">{format(new Date(project.created_at), 'MMM dd, yyyy')}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Last Updated</label>
                <p className="text-gray-900">{format(new Date(project.updated_at), 'MMM dd, yyyy')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
