
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Trash2, Plus, Calendar, Users, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GanttItem {
  id: number;
  title: string;
  type: 'milestone' | 'task' | 'subtask';
  parentId?: number;
  startDate: string;
  endDate: string;
  progress: number;
  assignee: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Not Started' | 'In Progress' | 'Completed' | 'On Hold';
  resources: string[];
  dependencies: number[];
  description: string;
}

interface GanttChartProps {
  onManagingChange?: (isManaging: boolean) => void;
}

const GanttChart: React.FC<GanttChartProps> = ({ onManagingChange }) => {
  const [items, setItems] = useState<GanttItem[]>([
    {
      id: 1,
      title: 'Product Launch Q1',
      type: 'milestone',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      progress: 65,
      assignee: 'Sarah Johnson',
      priority: 'High',
      status: 'In Progress',
      resources: ['Development Team', 'Marketing Team'],
      dependencies: [],
      description: 'Major product launch for Q1 2024'
    },
    {
      id: 2,
      title: 'Development Phase',
      type: 'task',
      parentId: 1,
      startDate: '2024-01-15',
      endDate: '2024-02-28',
      progress: 80,
      assignee: 'Mike Chen',
      priority: 'High',
      status: 'In Progress',
      resources: ['Frontend Team', 'Backend Team'],
      dependencies: [],
      description: 'Complete development of core features'
    },
    {
      id: 3,
      title: 'Frontend Implementation',
      type: 'subtask',
      parentId: 2,
      startDate: '2024-01-15',
      endDate: '2024-02-15',
      progress: 90,
      assignee: 'Alex Rivera',
      priority: 'High',
      status: 'In Progress',
      resources: ['Frontend Team'],
      dependencies: [],
      description: 'Implement user interface components'
    }
  ]);

  const [isManaging, setIsManaging] = useState(false);
  const [editingItem, setEditingItem] = useState<GanttItem | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');
  const { toast } = useToast();

  useEffect(() => {
    onManagingChange?.(isManaging);
  }, [isManaging, onManagingChange]);

  useEffect(() => {
    const handleAICreatedGanttItem = (event: CustomEvent) => {
      const newItem = event.detail;
      setItems(prev => [...prev, newItem]);
    };

    const handleAIEditedGanttItem = (event: CustomEvent) => {
      const updatedItem = event.detail;
      setItems(prev => prev.map(item => 
        item.id === updatedItem.id ? { ...item, ...updatedItem } : item
      ));
    };

    const handleAIDeletedGanttItem = (event: CustomEvent) => {
      const { id } = event.detail;
      setItems(prev => prev.filter(item => item.id !== id));
    };

    window.addEventListener('ai-created-gantt-item', handleAICreatedGanttItem as EventListener);
    window.addEventListener('ai-edited-gantt-item', handleAIEditedGanttItem as EventListener);
    window.addEventListener('ai-deleted-gantt-item', handleAIDeletedGanttItem as EventListener);

    return () => {
      window.removeEventListener('ai-created-gantt-item', handleAICreatedGanttItem as EventListener);
      window.removeEventListener('ai-edited-gantt-item', handleAIEditedGanttItem as EventListener);
      window.removeEventListener('ai-deleted-gantt-item', handleAIDeletedGanttItem as EventListener);
    };
  }, []);

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getItemsByType = (type: 'milestone' | 'task' | 'subtask') => {
    return items.filter(item => item.type === type);
  };

  const getSubItems = (parentId: number) => {
    return items.filter(item => item.parentId === parentId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'On Hold': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderGanttChart = () => {
    const allDates = items.flatMap(item => [new Date(item.startDate), new Date(item.endDate)]);
    const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
    const totalDays = Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));

    return (
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Timeline Header */}
            <div className="flex mb-4">
              <div className="w-64 text-sm font-medium text-gray-900">Task</div>
              <div className="flex-1 grid grid-cols-12 gap-1 text-xs text-gray-600">
                {Array.from({ length: 12 }, (_, i) => (
                  <div key={i} className="text-center">
                    {new Date(minDate.getTime() + (i * totalDays / 12 * 24 * 60 * 60 * 1000)).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                ))}
              </div>
            </div>

            {/* Gantt Bars */}
            {items.map(item => {
              const itemStart = new Date(item.startDate);
              const itemEnd = new Date(item.endDate);
              const startOffset = ((itemStart.getTime() - minDate.getTime()) / (maxDate.getTime() - minDate.getTime())) * 100;
              const width = ((itemEnd.getTime() - itemStart.getTime()) / (maxDate.getTime() - minDate.getTime())) * 100;

              return (
                <div key={item.id} className="flex items-center mb-2">
                  <div className="w-64 text-sm truncate">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      item.type === 'milestone' ? 'bg-purple-500' :
                      item.type === 'task' ? 'bg-blue-500' : 'bg-green-500'
                    }`}></span>
                    {item.title}
                  </div>
                  <div className="flex-1 relative h-8 bg-gray-200 rounded">
                    <div
                      className={`absolute h-6 top-1 rounded ${
                        item.type === 'milestone' ? 'bg-purple-400' :
                        item.type === 'task' ? 'bg-blue-400' : 'bg-green-400'
                      }`}
                      style={{
                        left: `${startOffset}%`,
                        width: `${width}%`,
                      }}
                    >
                      <div
                        className="h-full bg-black bg-opacity-20 rounded"
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gantt Chart</h1>
          <p className="text-gray-600">Manage project timelines, milestones, and tasks</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            onClick={() => setViewMode('table')}
          >
            Table View
          </Button>
          <Button
            variant={viewMode === 'chart' ? 'default' : 'outline'}
            onClick={() => setViewMode('chart')}
          >
            Chart View
          </Button>
          <Button
            variant={isManaging ? 'destructive' : 'default'}
            onClick={() => setIsManaging(!isManaging)}
          >
            {isManaging ? 'Exit Manage Mode' : 'Manage Mode'}
          </Button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Items</TabsTrigger>
            <TabsTrigger value="milestones">
              <Target className="w-4 h-4 mr-2" />
              Milestones ({getItemsByType('milestone').length})
            </TabsTrigger>
            <TabsTrigger value="tasks">
              <Calendar className="w-4 h-4 mr-2" />
              Tasks ({getItemsByType('task').length})
            </TabsTrigger>
            <TabsTrigger value="subtasks">
              <Users className="w-4 h-4 mr-2" />
              Subtasks ({getItemsByType('subtask').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>Project Timeline Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Assignee</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        {isManaging && <TableHead>Actions</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map(item => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              item.type === 'milestone' ? 'border-purple-200 text-purple-700' :
                              item.type === 'task' ? 'border-blue-200 text-blue-700' :
                              'border-green-200 text-green-700'
                            }>
                              {item.type}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(item.startDate).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(item.endDate).toLocaleDateString()}</TableCell>
                          <TableCell>{calculateDuration(item.startDate, item.endDate)} days</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${item.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-gray-600">{item.progress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>{item.assignee}</TableCell>
                          <TableCell>
                            <Badge className={getPriorityColor(item.priority)}>
                              {item.priority}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(item.status)}>
                              {item.status}
                            </Badge>
                          </TableCell>
                          {isManaging && (
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="outline" onClick={() => setEditingItem(item)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="destructive">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Similar TabsContent for milestones, tasks, and subtasks with filtered data */}
          <TabsContent value="milestones">
            <Card>
              <CardHeader>
                <CardTitle>Project Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {getItemsByType('milestone').map(milestone => (
                    <div key={milestone.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{milestone.title}</h3>
                          <p className="text-gray-600 text-sm">{milestone.description}</p>
                          <div className="flex space-x-4 mt-2 text-sm text-gray-500">
                            <span>Due: {new Date(milestone.endDate).toLocaleDateString()}</span>
                            <span>Assignee: {milestone.assignee}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(milestone.status)}>
                            {milestone.status}
                          </Badge>
                          <div className="mt-2 text-sm text-gray-600">{milestone.progress}% Complete</div>
                        </div>
                      </div>
                      {getSubItems(milestone.id).length > 0 && (
                        <div className="mt-4 pl-4 border-l-2 border-gray-200">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Related Tasks:</h4>
                          {getSubItems(milestone.id).map(task => (
                            <div key={task.id} className="text-sm text-gray-600">• {task.title}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>Project Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getItemsByType('task').map(task => (
                    <div key={task.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold">{task.title}</h3>
                          <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                          <div className="flex space-x-4 mt-3 text-sm">
                            <span className="text-gray-500">
                              {new Date(task.startDate).toLocaleDateString()} - {new Date(task.endDate).toLocaleDateString()}
                            </span>
                            <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                            <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-sm text-gray-600 mb-2">Progress: {task.progress}%</div>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subtasks">
            <Card>
              <CardHeader>
                <CardTitle>Subtasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getItemsByType('subtask').map(subtask => (
                    <div key={subtask.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">{subtask.title}</h3>
                          <p className="text-gray-600 text-sm">{subtask.description}</p>
                          <div className="mt-2 text-sm text-gray-500">
                            Assigned to: {subtask.assignee}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(subtask.status)}>{subtask.status}</Badge>
                          <div className="mt-1 text-sm text-gray-600">{subtask.progress}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Gantt Chart Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            {renderGanttChart()}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GanttChart;
