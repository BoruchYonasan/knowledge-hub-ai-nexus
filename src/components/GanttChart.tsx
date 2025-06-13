import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Trash2, Plus, Calendar, Users, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import GanttFilters from './GanttFilters';
import GanttBulkActions from './GanttBulkActions';
import GanttTableRow from './GanttTableRow';

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

interface FilterState {
  search: string;
  type: string;
  status: string;
  priority: string;
  assignee: string;
  startDate: Date | null;
  endDate: Date | null;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
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
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [expandedItems, setExpandedItems] = useState<number[]>([1, 2]);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: '',
    status: '',
    priority: '',
    assignee: '',
    startDate: null,
    endDate: null,
    sortBy: '',
    sortOrder: 'asc'
  });

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

  const assignees = useMemo(() => {
    return Array.from(new Set(items.map(item => item.assignee)));
  }, [items]);

  const filteredAndSortedItems = useMemo(() => {
    let filtered = items.filter(item => {
      if (filters.search && !item.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.type && item.type !== filters.type) return false;
      if (filters.status && item.status !== filters.status) return false;
      if (filters.priority && item.priority !== filters.priority) return false;
      if (filters.assignee && item.assignee !== filters.assignee) return false;
      if (filters.startDate && new Date(item.startDate) < filters.startDate) return false;
      if (filters.endDate && new Date(item.endDate) > filters.endDate) return false;
      return true;
    });

    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue = a[filters.sortBy as keyof GanttItem];
        let bValue = b[filters.sortBy as keyof GanttItem];
        
        if (filters.sortBy === 'startDate' || filters.sortBy === 'endDate') {
          aValue = new Date(aValue as string).getTime();
          bValue = new Date(bValue as string).getTime();
        }
        
        if (filters.sortOrder === 'desc') {
          return bValue > aValue ? 1 : -1;
        }
        return aValue > bValue ? 1 : -1;
      });
    }

    return filtered;
  }, [items, filters]);

  const handleSelectItem = (id: number, selected: boolean) => {
    if (selected) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    }
  };

  const handleBulkStatusUpdate = (status: string) => {
    setItems(prev => prev.map(item => 
      selectedItems.includes(item.id) ? { ...item, status: status as any } : item
    ));
    setSelectedItems([]);
    toast({
      title: "Status Updated",
      description: `Updated status for ${selectedItems.length} items.`
    });
  };

  const handleBulkAssigneeUpdate = (assignee: string) => {
    setItems(prev => prev.map(item => 
      selectedItems.includes(item.id) ? { ...item, assignee } : item
    ));
    setSelectedItems([]);
    toast({
      title: "Assignee Updated",
      description: `Reassigned ${selectedItems.length} items.`
    });
  };

  const handleBulkDelete = () => {
    setItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
    toast({
      title: "Items Deleted",
      description: `Deleted ${selectedItems.length} items.`
    });
  };

  const handleEditItem = (updatedItem: GanttItem) => {
    setItems(prev => prev.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
    toast({
      title: "Item Updated",
      description: `"${updatedItem.title}" has been updated.`
    });
  };

  const handleDeleteItem = (id: number) => {
    const item = items.find(item => item.id === id);
    setItems(prev => prev.filter(item => item.id !== id));
    setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    toast({
      title: "Item Deleted",
      description: `"${item?.title}" has been deleted.`
    });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      status: '',
      priority: '',
      assignee: '',
      startDate: null,
      endDate: null,
      sortBy: '',
      sortOrder: 'asc'
    });
  };

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const getItemsByType = (type: 'milestone' | 'task' | 'subtask') => {
    return filteredAndSortedItems.filter(item => item.type === type);
  };

  const getSubItems = (parentId: number) => {
    return items.filter(item => item.parentId === parentId);
  };

  const renderHierarchicalTable = () => {
    const renderItems = (parentId?: number, level = 0): JSX.Element[] => {
      const itemsAtLevel = filteredAndSortedItems.filter(item => item.parentId === parentId);
      const elements: JSX.Element[] = [];

      itemsAtLevel.forEach(item => {
        const subItems = getSubItems(item.id);
        const hasSubItems = subItems.length > 0;
        const isExpanded = expandedItems.includes(item.id);

        elements.push(
          <GanttTableRow
            key={item.id}
            item={item}
            isSelected={selectedItems.includes(item.id)}
            onSelect={handleSelectItem}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
            isManaging={isManaging}
            assignees={assignees}
            hasSubItems={hasSubItems}
            isExpanded={isExpanded}
            onToggleExpand={toggleExpanded}
            level={level}
          />
        );

        if (hasSubItems && isExpanded) {
          elements.push(...renderItems(item.id, level + 1));
        }
      });

      return elements;
    };

    return renderItems();
  };

  const calculateDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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

      <GanttFilters
        filters={filters}
        onFiltersChange={setFilters}
        assignees={assignees}
        onClearFilters={clearFilters}
      />

      <GanttBulkActions
        selectedItems={selectedItems}
        onClearSelection={() => setSelectedItems([])}
        onBulkStatusUpdate={handleBulkStatusUpdate}
        onBulkAssigneeUpdate={handleBulkAssigneeUpdate}
        onBulkDelete={handleBulkDelete}
        assignees={assignees}
      />

      {viewMode === 'table' ? (
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Items ({filteredAndSortedItems.length})</TabsTrigger>
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
                        {isManaging && <TableHead className="w-8"></TableHead>}
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
                      {renderHierarchicalTable()}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Keep existing TabsContent for milestones, tasks, and subtasks */}
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
