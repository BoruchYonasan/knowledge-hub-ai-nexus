
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Target, Users, Clock, ChevronRight } from 'lucide-react';
import WorksInProgress from './WorksInProgress';
import GanttChart from './GanttChart';

interface ProjectCentralProps {
  isManaging?: boolean;
}

const ProjectCentral: React.FC<ProjectCentralProps> = ({ isManaging = false }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const roadmapItems = [
    {
      id: 1,
      title: 'Product Launch Phase 1',
      quarter: 'Q2 2024',
      status: 'in-progress',
      completion: 75,
      description: 'Initial product release with core features',
    },
    {
      id: 2,
      title: 'Market Expansion',
      quarter: 'Q3 2024',
      status: 'planning',
      completion: 25,
      description: 'Expand to European markets',
    },
    {
      id: 3,
      title: 'Platform Integration',
      quarter: 'Q4 2024',
      status: 'planned',
      completion: 0,
      description: 'Third-party platform integrations',
    },
  ];

  const milestones = [
    {
      id: 1,
      title: 'MVP Release',
      dueDate: '2024-07-15',
      status: 'completed',
      assignee: 'Development Team',
    },
    {
      id: 2,
      title: 'Beta Testing Complete',
      dueDate: '2024-08-01',
      status: 'in-progress',
      assignee: 'QA Team',
    },
    {
      id: 3,
      title: 'Production Deployment',
      dueDate: '2024-08-15',
      status: 'pending',
      assignee: 'DevOps Team',
    },
  ];

  const taskAssignments = [
    {
      id: 1,
      task: 'UI/UX Design Review',
      assignee: 'Sarah Johnson',
      priority: 'high',
      dueDate: '2024-06-20',
      project: 'Product Launch',
    },
    {
      id: 2,
      task: 'Database Migration',
      assignee: 'Mike Chen',
      priority: 'medium',
      dueDate: '2024-06-25',
      project: 'Platform Integration',
    },
    {
      id: 3,
      task: 'Performance Testing',
      assignee: 'Alex Rodriguez',
      priority: 'high',
      dueDate: '2024-06-22',
      project: 'Product Launch',
    },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67</div>
            <p className="text-xs text-muted-foreground">-8 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Capacity</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">Optimal utilization</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderRoadmap = () => (
    <div className="space-y-4">
      {roadmapItems.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
              <Badge variant={item.status === 'in-progress' ? 'default' : 'secondary'}>
                {item.quarter}
              </Badge>
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
      {milestones.map((milestone) => (
        <Card key={milestone.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  milestone.status === 'completed' ? 'bg-green-500' :
                  milestone.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'
                }`}></div>
                <div>
                  <h3 className="font-medium">{milestone.title}</h3>
                  <p className="text-sm text-gray-600">Assigned to {milestone.assignee}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{new Date(milestone.dueDate).toLocaleDateString()}</div>
                <Badge variant={
                  milestone.status === 'completed' ? 'default' :
                  milestone.status === 'in-progress' ? 'secondary' : 'outline'
                }>
                  {milestone.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderTaskAssignments = () => (
    <div className="space-y-4">
      {taskAssignments.map((task) => (
        <Card key={task.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{task.task}</h3>
                <p className="text-sm text-gray-600">{task.project} • Assigned to {task.assignee}</p>
              </div>
              <div className="text-right space-y-1">
                <Badge variant={task.priority === 'high' ? 'destructive' : 'secondary'}>
                  {task.priority}
                </Badge>
                <div className="text-sm text-gray-600">{new Date(task.dueDate).toLocaleDateString()}</div>
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Central</h1>
          <p className="text-gray-600">Manage projects, timelines, and deliverables</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Works in Progress</TabsTrigger>
          <TabsTrigger value="gantt">Gantt Chart</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="tasks">Task Assignments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {renderOverview()}
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <WorksInProgress isManaging={isManaging} />
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
      </Tabs>
    </div>
  );
};

export default ProjectCentral;
