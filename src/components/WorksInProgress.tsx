import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Task {
  name: string;
  completed: boolean;
  inProgress?: boolean;
}

interface Project {
  id: number;
  title: string;
  lead: string;
  team: string;
  status: 'Planning' | 'In Progress' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
  progress: number;
  startDate: string;
  dueDate: string;
  description: string;
  tasks: Task[];
  attachments: string[];
}

interface WorksInProgressProps {
  onManagingChange?: (isManaging: boolean) => void;
}

const WorksInProgress: React.FC<WorksInProgressProps> = ({ onManagingChange }) => {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [isManaging, setIsManaging] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      title: 'Customer Portal Redesign',
      lead: 'Alex Rodriguez',
      team: 'Frontend Team',
      status: 'In Progress',
      priority: 'High',
      progress: 65,
      startDate: '2024-05-01',
      dueDate: '2024-07-15',
      description: 'Complete redesign of the customer portal with improved UX/UI, faster loading times, and mobile responsiveness.',
      tasks: [
        { name: 'User Research & Analysis', completed: true },
        { name: 'Wireframe Design', completed: true },
        { name: 'Frontend Development', completed: false, inProgress: true },
        { name: 'Backend Integration', completed: false },
        { name: 'Testing & QA', completed: false },
      ],
      attachments: ['Design-Mockups.fig', 'User-Research.pdf'],
    },
    {
      id: 2,
      title: 'API Documentation Update',
      lead: 'Emily Watson',
      team: 'Engineering',
      status: 'Planning',
      priority: 'Medium',
      progress: 20,
      startDate: '2024-06-01',
      dueDate: '2024-08-01',
      description: 'Comprehensive update of all API documentation with interactive examples and improved developer experience.',
      tasks: [
        { name: 'Content Audit', completed: true },
        { name: 'Documentation Framework Setup', completed: false, inProgress: true },
        { name: 'API Examples Creation', completed: false },
        { name: 'Interactive Demo Development', completed: false },
        { name: 'Review & Publishing', completed: false },
      ],
      attachments: ['API-Audit.xlsx'],
    },
    {
      id: 3,
      title: 'Mobile App Performance Optimization',
      lead: 'David Kim',
      team: 'Mobile Team',
      status: 'In Progress',
      priority: 'High',
      progress: 80,
      startDate: '2024-04-15',
      dueDate: '2024-06-30',
      description: 'Performance improvements for mobile applications including faster loading, reduced memory usage, and smoother animations.',
      tasks: [
        { name: 'Performance Audit', completed: true },
        { name: 'Code Optimization', completed: true },
        { name: 'Memory Leak Fixes', completed: true },
        { name: 'Load Testing', completed: false, inProgress: true },
        { name: 'Release Preparation', completed: false },
      ],
      attachments: ['Performance-Report.pdf', 'Optimization-Plan.docx'],
    },
    {
      id: 4,
      title: 'Security Compliance Audit',
      lead: 'Jennifer Adams',
      team: 'Security',
      status: 'Completed',
      priority: 'High',
      progress: 100,
      startDate: '2024-03-01',
      dueDate: '2024-05-31',
      description: 'Complete security audit and compliance review for SOC 2 certification.',
      tasks: [
        { name: 'Security Assessment', completed: true },
        { name: 'Policy Documentation', completed: true },
        { name: 'Vulnerability Testing', completed: true },
        { name: 'Compliance Review', completed: true },
        { name: 'Certification Submission', completed: true },
      ],
      attachments: ['Security-Audit.pdf', 'Compliance-Report.pdf'],
    },
    {
      id: 5,
      title: 'Employee Training Platform',
      lead: 'Sarah Johnson',
      team: 'HR Tech',
      status: 'Planning',
      priority: 'Medium',
      progress: 15,
      startDate: '2024-06-10',
      dueDate: '2024-09-15',
      description: 'Development of an internal training platform for employee skill development and onboarding.',
      tasks: [
        { name: 'Requirements Gathering', completed: true },
        { name: 'Platform Selection', completed: false, inProgress: true },
        { name: 'Content Creation', completed: false },
        { name: 'Platform Development', completed: false },
        { name: 'Pilot Testing', completed: false },
      ],
      attachments: ['Training-Requirements.docx'],
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Planning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateProject = () => {
    setEditingProject({
      id: Date.now(),
      title: '',
      lead: '',
      team: '',
      status: 'Planning',
      priority: 'Medium',
      progress: 0,
      startDate: '',
      dueDate: '',
      description: '',
      tasks: [],
      attachments: []
    });
    setIsDialogOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject({ ...project });
    setIsDialogOpen(true);
  };

  const handleSaveProject = () => {
    if (!editingProject) return;

    if (projects.find(p => p.id === editingProject.id)) {
      setProjects(prev => prev.map(p => p.id === editingProject.id ? editingProject : p));
      toast({
        title: "Project updated",
        description: `${editingProject.title} has been updated successfully.`
      });
    } else {
      setProjects(prev => [...prev, editingProject]);
      toast({
        title: "Project created",
        description: `${editingProject.title} has been added to works in progress.`
      });
    }

    setEditingProject(null);
    setIsDialogOpen(false);
  };

  const handleDeleteProject = (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    setProjects(prev => prev.filter(p => p.id !== projectId));
    toast({
      title: "Project deleted",
      description: `${project?.title} has been removed from works in progress.`
    });
  };

  // Listen for AI-created projects
  useEffect(() => {
    const handleAICreatedProject = (event: CustomEvent) => {
      const newProject = event.detail;
      setProjects(prev => [...prev, newProject]);
    };

    window.addEventListener('ai-created-project', handleAICreatedProject as EventListener);
    
    return () => {
      window.removeEventListener('ai-created-project', handleAICreatedProject as EventListener);
    };
  }, []);

  // Notify parent about manage mode changes
  useEffect(() => {
    onManagingChange?.(isManaging);
  }, [isManaging, onManagingChange]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Works in Progress</h1>
          <p className="text-gray-600">
            Track ongoing projects and their current status.
            {isManaging && (
              <span className="block text-sm text-green-600 mt-1">
                💬 Manage mode active - You can ask the AI assistant to create projects for you!
              </span>
            )}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={isManaging ? "default" : "outline"}
            onClick={() => setIsManaging(!isManaging)}
          >
            {isManaging ? 'View Mode' : 'Manage'}
          </Button>
          {isManaging && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreateProject}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingProject?.id && projects.find(p => p.id === editingProject.id) ? 'Edit Project' : 'Create New Project'}
                  </DialogTitle>
                </DialogHeader>
                {editingProject && (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Title *</label>
                        <Input
                          value={editingProject.title}
                          onChange={(e) => setEditingProject(prev => prev ? { ...prev, title: e.target.value } : null)}
                          placeholder="Project title..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Lead *</label>
                        <Input
                          value={editingProject.lead}
                          onChange={(e) => setEditingProject(prev => prev ? { ...prev, lead: e.target.value } : null)}
                          placeholder="Project lead..."
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Team</label>
                        <Input
                          value={editingProject.team}
                          onChange={(e) => setEditingProject(prev => prev ? { ...prev, team: e.target.value } : null)}
                          placeholder="Team name..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Priority</label>
                        <Select
                          value={editingProject.priority}
                          onValueChange={(value: 'High' | 'Medium' | 'Low') => 
                            setEditingProject(prev => prev ? { ...prev, priority: value } : null)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Status</label>
                        <Select
                          value={editingProject.status}
                          onValueChange={(value: 'Planning' | 'In Progress' | 'Completed') => 
                            setEditingProject(prev => prev ? { ...prev, status: value } : null)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Planning">Planning</SelectItem>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Start Date</label>
                        <Input
                          type="date"
                          value={editingProject.startDate}
                          onChange={(e) => setEditingProject(prev => prev ? { ...prev, startDate: e.target.value } : null)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Due Date</label>
                        <Input
                          type="date"
                          value={editingProject.dueDate}
                          onChange={(e) => setEditingProject(prev => prev ? { ...prev, dueDate: e.target.value } : null)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <Textarea
                        value={editingProject.description}
                        onChange={(e) => setEditingProject(prev => prev ? { ...prev, description: e.target.value } : null)}
                        placeholder="Project description..."
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveProject}>
                        {editingProject.id && projects.find(p => p.id === editingProject.id) ? 'Update' : 'Create'}
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card 
            key={project.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer relative"
            onClick={() => !isManaging && setSelectedProject(selectedProject === project.id ? null : project.id)}
          >
            {isManaging && (
              <div className="absolute top-2 right-2 flex space-x-1 z-10">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditProject(project);
                  }}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProject(project.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">
                  {project.title}
                </CardTitle>
                <div className="flex space-x-1 ml-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(project.priority)}`}>
                  {project.priority}
                </span>
                <span className="text-sm text-gray-600">{project.team}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Lead: {project.lead}</p>
                  <p className="text-sm text-gray-700">{project.description}</p>
                </div>

                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        project.status === 'Completed' ? 'bg-green-600' :
                        project.status === 'In Progress' ? 'bg-blue-600' :
                        'bg-yellow-600'
                      }`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between text-xs text-gray-500">
                  <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>
                  <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                </div>

                {selectedProject === project.id && !isManaging && (
                  <div className="border-t pt-4 mt-4 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Tasks:</h4>
                      <div className="space-y-2">
                        {project.tasks.map((task, index) => (
                          <div key={index} className="flex items-center text-sm">
                            {task.completed ? (
                              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-2">
                                <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            ) : task.inProgress ? (
                              <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                            ) : (
                              <div className="w-4 h-4 bg-gray-300 rounded-full mr-2"></div>
                            )}
                            <span className={task.completed ? 'line-through text-gray-500' : 'text-gray-700'}>
                              {task.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {project.attachments.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Attachments:</h4>
                        <div className="space-y-1">
                          {project.attachments.map((attachment, index) => (
                            <div key={index} className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                              </svg>
                              <span className="cursor-pointer hover:underline">{attachment}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🚧</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects in progress</h3>
          <p className="text-gray-600">All projects are completed or none have been started yet.</p>
        </div>
      )}
    </div>
  );
};

export default WorksInProgress;
