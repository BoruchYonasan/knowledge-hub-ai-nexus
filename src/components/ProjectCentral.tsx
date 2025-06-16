import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import WorksInProgress from './WorksInProgress';
import GanttChart from './GanttChart';
import OverviewSection from './project-central/OverviewSection';
import RoadmapSection from './project-central/RoadmapSection';
import MilestonesSection from './project-central/MilestonesSection';
import TaskAssignmentsSection from './project-central/TaskAssignmentsSection';
import CompletedTasksSection from './project-central/CompletedTasksSection';
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
          <OverviewSection
            projects={projects}
            milestones={milestones}
            roadmapItems={roadmapItems}
            tasks={tasks}
            completedTasks={completedTasks}
          />
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <WorksInProgress onNavigate={onNavigate} isManaging={isManaging} />
        </TabsContent>

        <TabsContent value="gantt" className="mt-6">
          <GanttChart isManaging={isManaging} onNavigate={onNavigate} />
        </TabsContent>

        <TabsContent value="roadmap" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Roadmap & Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <RoadmapSection
                roadmapItems={roadmapItems}
                isManaging={isManaging}
                onAddClick={() => setAddRoadmapOpen(true)}
                onEditClick={handleEditRoadmapItem}
                onDeleteClick={handleDeleteRoadmapItem}
                onNavigate={onNavigate}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Milestones & Deliverables</CardTitle>
            </CardHeader>
            <CardContent>
              <MilestonesSection
                milestones={milestones}
                isManaging={isManaging}
                onAddClick={() => setAddMilestoneOpen(true)}
                onEditClick={handleEditMilestone}
                onDeleteClick={handleDeleteMilestone}
                onNavigate={onNavigate}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <TaskAssignmentsSection
                tasks={tasks}
                isManaging={isManaging}
                onAddClick={() => setAddTaskOpen(true)}
                onEditClick={handleEditTask}
                onDeleteClick={handleDeleteTask}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Completed Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <CompletedTasksSection
                completedTasks={completedTasks}
                isManaging={isManaging}
                onEditClick={handleEditTask}
                onDeleteClick={handleDeleteTask}
              />
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
