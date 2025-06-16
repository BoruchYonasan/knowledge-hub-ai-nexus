import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, HardHat, Users, Clock, ChevronRight, ArrowLeft, Plus, Edit, Trash2, CheckCircle } from 'lucide-react';
import WorksInProgress from './WorksInProgress';
import GanttChart from './GanttChart';
import AddRoadmapDialog from './AddRoadmapDialog';
import EditRoadmapDialog from './EditRoadmapDialog';
import AddMilestoneDialog from './AddMilestoneDialog';
import EditMilestoneDialog from './EditMilestoneDialog';
import AddTaskDialog from './AddTaskDialog';
import EditTaskDialog from './EditTaskDialog';
import { useRoadmapItems } from '@/hooks/useRoadmapItems';
import { useMilestones } from '@/hooks/useMilestones';
import { useTaskAssignments } from '@/hooks/useTaskAssignments';
import { useProjects } from '@/hooks/useProjects';
import { useToast } from '@/hooks/use-toast';

interface ProjectCentralProps {
  onNavigate?: (page: string, tab?: string) => void;
  isManaging?: boolean;
  initialTab?: string;
}

const ProjectCentral: React.FC<ProjectCentralProps> = ({ onNavigate, isManaging = false, initialTab = 'overview' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const { toast } = useToast();
  
  // Dialog states
  const [addRoadmapOpen, setAddRoadmapOpen] = useState(false);
  const [editRoadmapOpen, setEditRoadmapOpen] = useState(false);
  const [selectedRoadmapItem, setSelectedRoadmapItem] = useState(null);
  
  const [addMilestoneOpen, setAddMilestoneOpen] = useState(false);
  const [editMilestoneOpen, setEditMilestoneOpen] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  
  const [addTaskOpen, setAddTaskOpen] = useState(false);
  const [editTaskOpen, setEditTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // Hooks
  const { items: roadmapItems, loading: roadmapLoading, createItem, updateItem, deleteItem } = useRoadmapItems();
  const { milestones, loading: milestonesLoading, createMilestone, updateMilestone, deleteMilestone } = useMilestones();
  const { tasks, completedTasks, loading: tasksLoading, createTask, updateTask, deleteTask } = useTaskAssignments();
  const { projects } = useProjects();

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Roadmap handlers
  const handleAddRoadmapItem = async (data: any) => {
    try {
      await createItem(data);
    } catch (error) {
      console.error('Error creating roadmap item:', error);
    }
  };

  const handleEditRoadmapItem = (item: any) => {
    setSelectedRoadmapItem(item);
    setEditRoadmapOpen(true);
  };

  const handleUpdateRoadmapItem = async (id: string, data: any) => {
    try {
      await updateItem(id, data);
    } catch (error) {
      console.error('Error updating roadmap item:', error);
    }
  };

  const handleDeleteRoadmapItem = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this roadmap item?')) {
      try {
        await deleteItem(id);
        toast({
          title: 'Success',
          description: 'Roadmap item deleted successfully',
        });
      } catch (error) {
        console.error('Error deleting roadmap item:', error);
      }
    }
  };

  // Milestone handlers
  const handleAddMilestone = async (data: any) => {
    try {
      await createMilestone(data);
    } catch (error) {
      console.error('Error creating milestone:', error);
    }
  };

  const handleEditMilestone = (milestone: any) => {
    setSelectedMilestone(milestone);
    setEditMilestoneOpen(true);
  };

  const handleUpdateMilestone = async (id: string, data: any) => {
    try {
      await updateMilestone(id, data);
    } catch (error) {
      console.error('Error updating milestone:', error);
    }
  };

  const handleDeleteMilestone = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this milestone?')) {
      try {
        await deleteMilestone(id);
        toast({
          title: 'Success',
          description: 'Milestone deleted successfully',
        });
      } catch (error) {
        console.error('Error deleting milestone:', error);
      }
    }
  };

  // Task handlers
  const handleAddTask = async (data: any) => {
    try {
      await createTask(data);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleEditTask = (task: any) => {
    setSelectedTask(task);
    setEditTaskOpen(true);
  };

  const handleUpdateTask = async (id: string, data: any) => {
    try {
      await updateTask(id, data);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        toast({
          title: 'Success',
          description: 'Task deleted successfully',
        });
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <HardHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">Total projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.filter(t => !t.completed).length}</div>
            <p className="text-xs text-muted-foreground">Active assignments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks.length}</div>
            <p className="text-xs text-muted-foreground">Successfully finished</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {projects.slice(0, 3).map((project) => (
                <div key={project.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">{project.title}</p>
                    <p className="text-sm text-gray-500">{project.lead}</p>
                  </div>
                  <Badge variant={project.status === 'Completed' ? 'default' : 'secondary'}>
                    {project.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {milestones.slice(0, 3).map((milestone) => (
                <div key={milestone.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">{milestone.title}</p>
                    <p className="text-sm text-gray-500">{milestone.assignee}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{new Date(milestone.due_date).toLocaleDateString()}</p>
                    <Badge variant={milestone.status === 'completed' ? 'default' : 'outline'}>
                      {milestone.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Roadmap Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {roadmapItems.slice(0, 3).map((item) => (
              <div key={item.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{item.title}</span>
                  <span className="text-sm text-gray-500">{item.completion}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${item.completion}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderRoadmap = () => (
    <div className="space-y-4">
      {isManaging && (
        <div className="flex justify-end">
          <Button 
            className="flex items-center"
            onClick={() => setAddRoadmapOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Roadmap Item
          </Button>
        </div>
      )}
      {roadmapItems.map((item) => (
        <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={item.status === 'in-progress' ? 'default' : 'secondary'}>
                  {item.quarter}
                </Badge>
                {isManaging && (
                  <div className="flex space-x-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditRoadmapItem(item)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteRoadmapItem(item.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{item.completion}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${item.completion}%` }}
                  ></div>
                </div>
              </div>
              <Badge variant={
                item.status === 'in-progress' ? 'default' : 
                item.status === 'planning' ? 'secondary' : 'outline'
              }>
                {item.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderMilestones = () => (
    <div className="space-y-4">
      {isManaging && (
        <div className="flex justify-end">
          <Button 
            className="flex items-center"
            onClick={() => setAddMilestoneOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Milestone
          </Button>
        </div>
      )}
      {milestones.map((milestone) => (
        <Card key={milestone.id} className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className={`w-3 h-3 rounded-full ${
                  milestone.status === 'completed' ? 'bg-green-500' :
                  milestone.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'
                }`}></div>
                <div className="flex-1">
                  <h3 className="font-medium">{milestone.title}</h3>
                  <p className="text-sm text-gray-600">Assigned to {milestone.assignee}</p>
                  {milestone.description && (
                    <p className="text-sm text-gray-500 mt-1">{milestone.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <div className="text-sm font-medium">{new Date(milestone.due_date).toLocaleDateString()}</div>
                  <Badge variant={
                    milestone.status === 'completed' ? 'default' :
                    milestone.status === 'in-progress' ? 'secondary' : 'outline'
                  }>
                    {milestone.status}
                  </Badge>
                </div>
                {isManaging && (
                  <div className="flex space-x-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditMilestone(milestone)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteMilestone(milestone.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderTaskAssignments = () => (
    <div className="space-y-4">
      {isManaging && (
        <div className="flex justify-end">
          <Button 
            className="flex items-center"
            onClick={() => setAddTaskOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task Assignment
          </Button>
        </div>
      )}
      {tasks.filter(task => !task.completed).map((task) => (
        <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-medium">{task.task}</h3>
                <p className="text-sm text-gray-600">{task.project} • Assigned to {task.assignee}</p>
                {task.description && (
                  <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-right space-y-1">
                  <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
                    {task.priority}
                  </Badge>
                  <div className="text-sm text-gray-600">{new Date(task.due_date).toLocaleDateString()}</div>
                </div>
                {isManaging && (
                  <div className="flex space-x-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditTask(task)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderCompletedTasks = () => (
    <div className="space-y-4">
      {completedTasks.map((task) => (
        <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div className="flex-1">
                  <h3 className="font-medium">{task.task}</h3>
                  <p className="text-sm text-gray-600">{task.project} • Completed by {task.assignee}</p>
                  {task.description && (
                    <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                  )}
                  {task.completed_at && (
                    <p className="text-xs text-gray-400 mt-1">
                      Completed on {new Date(task.completed_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-right space-y-1">
                  <Badge variant="default">Completed</Badge>
                  <div className="text-sm text-gray-600">{new Date(task.due_date).toLocaleDateString()}</div>
                </div>
                {isManaging && (
                  <div className="flex space-x-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditTask(task)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onNavigate?.('dashboard')}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Project Central</h1>
            <p className="text-gray-600">Manage projects, timelines, and deliverables</p>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Works in Progress</TabsTrigger>
          <TabsTrigger value="gantt">Gantt Chart</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="tasks">Task Assignments</TabsTrigger>
          <TabsTrigger value="completed">Completed Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <WorksInProgress onNavigate={onNavigate} isManaging={isManaging} />
        </TabsContent>

        <TabsContent value="gantt" className="mt-6">
          <GanttChart isManaging={isManaging} />
        </TabsContent>

        <TabsContent value="roadmap" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Roadmap & Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {renderRoadmap()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Milestones & Deliverables</CardTitle>
            </CardHeader>
            <CardContent>
              {renderMilestones()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              {renderTaskAssignments()}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Completed Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              {renderCompletedTasks()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* All Dialog Components */}
      <AddRoadmapDialog
        open={addRoadmapOpen}
        onOpenChange={setAddRoadmapOpen}
        onAdd={handleAddRoadmapItem}
      />

      <EditRoadmapDialog
        open={editRoadmapOpen}
        onOpenChange={setEditRoadmapOpen}
        onEdit={handleUpdateRoadmapItem}
        item={selectedRoadmapItem}
      />

      <AddMilestoneDialog
        open={addMilestoneOpen}
        onOpenChange={setAddMilestoneOpen}
        onAdd={handleAddMilestone}
      />

      <EditMilestoneDialog
        open={editMilestoneOpen}
        onOpenChange={setEditMilestoneOpen}
        onEdit={handleUpdateMilestone}
        milestone={selectedMilestone}
      />

      <AddTaskDialog
        open={addTaskOpen}
        onOpenChange={setAddTaskOpen}
        onAdd={handleAddTask}
      />

      <EditTaskDialog
        open={editTaskOpen}
        onOpenChange={setEditTaskOpen}
        onEdit={handleUpdateTask}
        task={selectedTask}
      />
    </div>
  );
};

export default ProjectCentral;
