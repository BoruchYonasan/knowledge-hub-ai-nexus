import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Link, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface KnowledgeBaseLink {
  id: string;
  title: string;
  type: 'document' | 'image' | 'guide' | 'policy' | 'other';
  url?: string;
}

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
  knowledgeBaseLinks: KnowledgeBaseLink[];
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
      knowledgeBaseLinks: [
        { id: '1', title: 'UX Design Guidelines', type: 'guide' },
        { id: '2', title: 'Customer Portal Requirements', type: 'document' }
      ]
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
      knowledgeBaseLinks: [
        { id: '3', title: 'API Documentation Guidelines', type: 'guide' }
      ]
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
      knowledgeBaseLinks: [
        { id: '4', title: 'Mobile App Performance Best Practices', type: 'guide' }
      ]
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
      knowledgeBaseLinks: [
        { id: '5', title: 'SOC 2 Compliance Guidelines', type: 'guide' }
      ]
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
      knowledgeBaseLinks: [
        { id: '6', title: 'Training Platform Guidelines', type: 'guide' }
      ]
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
      attachments: [],
      knowledgeBaseLinks: []
    });
    setIsDialogOpen(true);
  };

  const addKnowledgeBaseLink = () => {
    if (!editingProject) return;
    const newLink: KnowledgeBaseLink = {
      id: Date.now().toString(),
      title: '',
      type: 'document'
    };
    setEditingProject(prev => prev ? {
      ...prev,
      knowledgeBaseLinks: [...prev.knowledgeBaseLinks, newLink]
    } : null);
  };

  const updateKnowledgeBaseLink = (linkId: string, field: keyof KnowledgeBaseLink, value: string) => {
    if (!editingProject) return;
    setEditingProject(prev => prev ? {
      ...prev,
      knowledgeBaseLinks: prev.knowledgeBaseLinks.map(link =>
        link.id === linkId ? { ...link, [field]: value } : link
      )
    } : null);
  };

  const removeKnowledgeBaseLink = (linkId: string) => {
    if (!editingProject) return;
    setEditingProject(prev => prev ? {
      ...prev,
      knowledgeBaseLinks: prev.knowledgeBaseLinks.filter(link => link.id !== linkId)
    } : null);
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

  // Listen for AI-created, edited, and deleted projects
  useEffect(() => {
    const handleAICreatedProject = (event: CustomEvent) => {
      const newProject = event.detail;
      setProjects(prev => [...prev, newProject]);
    };

    const handleAIEditedProject = (event: CustomEvent) => {
      const editedProject = event.detail;
      setProjects(prev => prev.map(p => p.id === editedProject.id ? { ...p, ...editedProject } : p));
    };

    const handleAIDeletedProject = (event: CustomEvent) => {
      const { id } = event.detail;
      setProjects(prev => prev.filter(p => p.id !== id));
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
                    <div>
                      <label className="block text-sm font-medium mb-2">Knowledge Base Links</label>
                      <div className="space-y-2">
                        {editingProject.knowledgeBaseLinks.map((link) => (
                          <div key={link.id} className="flex items-center space-x-2 p-2 border rounded">
                            <Input
                              placeholder="Link title..."
                              value={link.title}
                              onChange={(e) => updateKnowledgeBaseLink(link.id, 'title', e.target.value)}
                              className="flex-1"
                            />
                            <Select
                              value={link.type}
                              onValueChange={(value: any) => updateKnowledgeBaseLink(link.id, 'type', value)}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="document">Document</SelectItem>
                                <SelectItem value="guide">Guide</SelectItem>
                                <SelectItem value="policy">Policy</SelectItem>
                                <SelectItem value="image">Image</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeKnowledgeBaseLink(link.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addKnowledgeBaseLink}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Knowledge Base Link
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        {projects.map((project) => (
          <Card 
            key={project.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer relative flex-shrink-0 w-full lg:w-[calc(50%-12px)] xl:w-[calc(33.333%-16px)]"
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

                    {project.knowledgeBaseLinks.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center">
                          <Link className="w-4 h-4 mr-2" />
                          Related Knowledge Base:
                        </h4>
                        <div className="space-y-2">
                          {project.knowledgeBaseLinks.map((link) => (
                            <div key={link.id} className="flex items-center justify-between p-2 bg-blue-50 rounded border">
                              <div className="flex items-center">
                                <span className={`px-2 py-1 text-xs rounded mr-2 ${
                                  link.type === 'document' ? 'bg-blue-100 text-blue-800' :
                                  link.type === 'guide' ? 'bg-green-100 text-green-800' :
                                  link.type === 'policy' ? 'bg-purple-100 text-purple-800' :
                                  link.type === 'image' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {link.type}
                                </span>
                                <span className="text-sm font-medium">{link.title}</span>
                              </div>
                              {link.url && (
                                <ExternalLink className="w-4 h-4 text-blue-600 cursor-pointer" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

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
