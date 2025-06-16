import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Plus, Calendar, Users, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useGanttItems } from '@/hooks/useGanttItems';
import GanttFilters from './GanttFilters';
import GanttBulkActions from './GanttBulkActions';
import GanttTableRow from './GanttTableRow';
import GanttChartView from './GanttChartView';
import GanttItemDialog from './GanttItemDialog';

// Use a unique type alias to avoid conflicts
type GanttItemType = ReturnType<typeof useGanttItems>['items'][0];

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
  isManaging?: boolean;
  onManagingChange?: (isManaging: boolean) => void;
  onNavigate?: (page: string, tab?: string, data?: any) => void;
}

const GanttChart: React.FC<GanttChartProps> = ({ isManaging = false, onManagingChange, onNavigate }) => {
  const { 
    items, 
    loading, 
    updateItem, 
    deleteItem,
    bulkUpdateStatus,
    bulkUpdateAssignee,
    bulkDelete,
    createItem
  } = useGanttItems();
  
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<GanttItemType | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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

  React.useEffect(() => {
    onManagingChange?.(isManaging);
  }, [isManaging, onManagingChange]);

  // Extract unique assignees from items with fallback default assignees
  const assignees = useMemo(() => {
    const itemAssignees = Array.from(new Set(items.map(item => item.assignee).filter(Boolean)));
    const defaultAssignees = ['John Smith', 'Sarah Johnson', 'Mike Davis', 'Lisa Chen', 'David Wilson'];
    
    // Combine and deduplicate
    const allAssignees = Array.from(new Set([...itemAssignees, ...defaultAssignees]));
    return allAssignees;
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
        let aValue = a[filters.sortBy as keyof typeof a];
        let bValue = b[filters.sortBy as keyof typeof b];
        
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

  const handleSelectItem = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    }
  };

  const handleBulkStatusUpdate = async (status: string) => {
    await bulkUpdateStatus(selectedItems, status as 'Not Started' | 'In Progress' | 'Completed' | 'On Hold');
    setSelectedItems([]);
  };

  const handleBulkAssigneeUpdate = async (assignee: string) => {
    await bulkUpdateAssignee(selectedItems, assignee);
    setSelectedItems([]);
  };

  const handleBulkDelete = async () => {
    await bulkDelete(selectedItems);
    setSelectedItems([]);
  };

  const handleEditItem = async (updatedItem: GanttItemType) => {
    try {
      await updateItem(updatedItem.id, updatedItem);
      toast({
        title: "Success",
        description: "Gantt item updated successfully",
      });
    } catch (error) {
      console.error('Error updating gantt item:', error);
      toast({
        title: "Error",
        description: "Failed to update gantt item",
        variant: "destructive"
      });
    }
  };

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteItem(id);
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
      toast({
        title: "Success",
        description: "Gantt item deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting gantt item:', error);
      toast({
        title: "Error",
        description: "Failed to delete gantt item",
        variant: "destructive"
      });
    }
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

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const getItemsByType = (type: 'milestone' | 'task' | 'subtask') => {
    return filteredAndSortedItems.filter(item => item.type === type);
  };

  const getChildrenByParentId = (parentId: string) => {
    return filteredAndSortedItems.filter(item => item.parent_id === parentId);
  };

  const getMilestones = () => {
    return filteredAndSortedItems.filter(item => item.type === 'milestone');
  };

  const getTasksByMilestone = (milestoneId: string) => {
    return filteredAndSortedItems.filter(item => item.type === 'task' && item.parent_id === milestoneId);
  };

  const getSubtasksByTask = (taskId: string) => {
    return filteredAndSortedItems.filter(item => item.type === 'subtask' && item.parent_id === taskId);
  };

  const renderHierarchicalTable = () => {
    const elements: JSX.Element[] = [];
    const milestones = getMilestones();

    // Add milestones with their children
    milestones.forEach(milestone => {
      const isMilestoneExpanded = expandedItems.includes(milestone.id);
      const milestoneTasks = getTasksByMilestone(milestone.id);

      // Add milestone row
      elements.push(
        <GanttTableRow
          key={milestone.id}
          item={milestone}
          isSelected={selectedItems.includes(milestone.id)}
          onSelect={handleSelectItem}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
          isManaging={isManaging}
          assignees={assignees}
          hasSubItems={milestoneTasks.length > 0}
          isExpanded={isMilestoneExpanded}
          onToggleExpand={toggleExpanded}
          level={0}
          onNavigate={onNavigate}
        />
      );

      // Add tasks under milestone if expanded
      if (isMilestoneExpanded) {
        milestoneTasks.forEach(task => {
          const isTaskExpanded = expandedItems.includes(task.id);
          const taskSubtasks = getSubtasksByTask(task.id);

          // Add task row
          elements.push(
            <GanttTableRow
              key={task.id}
              item={task}
              isSelected={selectedItems.includes(task.id)}
              onSelect={handleSelectItem}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
              isManaging={isManaging}
              assignees={assignees}
              hasSubItems={taskSubtasks.length > 0}
              isExpanded={isTaskExpanded}
              onToggleExpand={toggleExpanded}
              level={1}
              onNavigate={onNavigate}
            />
          );

          // Add subtasks under task if expanded
          if (isTaskExpanded) {
            taskSubtasks.forEach(subtask => {
              elements.push(
                <GanttTableRow
                  key={subtask.id}
                  item={subtask}
                  isSelected={selectedItems.includes(subtask.id)}
                  onSelect={handleSelectItem}
                  onEdit={handleEditItem}
                  onDelete={handleDeleteItem}
                  isManaging={isManaging}
                  assignees={assignees}
                  hasSubItems={false}
                  isExpanded={false}
                  onToggleExpand={toggleExpanded}
                  level={2}
                  onNavigate={onNavigate}
                />
              );
            });
          }
        });
      }
    });

    // Add orphaned tasks (tasks without milestone parents)
    const orphanedTasks = filteredAndSortedItems.filter(item => 
      item.type === 'task' && (!item.parent_id || !milestones.find(m => m.id === item.parent_id))
    );

    orphanedTasks.forEach(task => {
      const isTaskExpanded = expandedItems.includes(task.id);
      const taskSubtasks = getSubtasksByTask(task.id);

      elements.push(
        <GanttTableRow
          key={task.id}
          item={task}
          isSelected={selectedItems.includes(task.id)}
          onSelect={handleSelectItem}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
          isManaging={isManaging}
          assignees={assignees}
          hasSubItems={taskSubtasks.length > 0}
          isExpanded={isTaskExpanded}
          onToggleExpand={toggleExpanded}
          level={0}
          onNavigate={onNavigate}
        />
      );

      if (isTaskExpanded) {
        taskSubtasks.forEach(subtask => {
          elements.push(
            <GanttTableRow
              key={subtask.id}
              item={subtask}
              isSelected={selectedItems.includes(subtask.id)}
              onSelect={handleSelectItem}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
              isManaging={isManaging}
              assignees={assignees}
              hasSubItems={false}
              isExpanded={false}
              onToggleExpand={toggleExpanded}
              level={1}
              onNavigate={onNavigate}
            />
          );
        });
      }
    });

    // Add orphaned subtasks (subtasks without task parents)
    const orphanedSubtasks = filteredAndSortedItems.filter(item => 
      item.type === 'subtask' && (!item.parent_id || !filteredAndSortedItems.find(t => t.id === item.parent_id && t.type === 'task'))
    );

    orphanedSubtasks.forEach(subtask => {
      elements.push(
        <GanttTableRow
          key={subtask.id}
          item={subtask}
          isSelected={selectedItems.includes(subtask.id)}
          onSelect={handleSelectItem}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
          isManaging={isManaging}
          assignees={assignees}
          hasSubItems={false}
          isExpanded={false}
          onToggleExpand={toggleExpanded}
          level={0}
          onNavigate={onNavigate}
        />
      );
    });

    return elements;
  };

  const handleItemClick = (item: GanttItemType) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedItem(null);
    setIsDialogOpen(true);
  };

  const handleSaveItem = async (itemData: Omit<GanttItemType, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (selectedItem) {
        // Update existing item
        await updateItem(selectedItem.id, itemData);
        toast({
          title: "Success",
          description: "Gantt item updated successfully",
        });
      } else {
        // Create new item
        await createItem(itemData);
        toast({
          title: "Success",
          description: "Gantt item created successfully",
        });
      }
      setIsDialogOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error saving gantt item:', error);
      toast({
        title: "Error",
        description: selectedItem ? "Failed to update gantt item" : "Failed to create gantt item",
        variant: "destructive"
      });
    }
  };

  const renderItemsByType = (type: 'milestone' | 'task' | 'subtask') => {
    const typeItems = getItemsByType(type);
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {isManaging && <TableHead className="w-8"></TableHead>}
              <TableHead>Title</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              {isManaging && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {typeItems.map(item => (
              <GanttTableRow
                key={item.id}
                item={item}
                isSelected={selectedItems.includes(item.id)}
                onSelect={handleSelectItem}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
                isManaging={isManaging}
                assignees={assignees}
                hasSubItems={false}
                isExpanded={false}
                onToggleExpand={() => {}}
                level={0}
                onNavigate={onNavigate}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gantt Chart</h1>
          <p className="text-gray-600">Manage project timelines, milestones, and tasks</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleCreateNew} className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
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
                <CardTitle>Project Timeline Overview (Hierarchical View)</CardTitle>
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
                        <TableHead>Progress</TableHead>
                        <TableHead>Assignee</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Status</TableHead>
                        {isManaging && <TableHead>Actions</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedItems.length > 0 ? (
                        renderHierarchicalTable()
                      ) : (
                        <TableRow>
                          <TableCell colSpan={isManaging ? 9 : 8} className="text-center py-8 text-gray-500">
                            No items found. Click "Add Item" to create your first gantt item.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="milestones">
            <Card>
              <CardHeader>
                <CardTitle>Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                {getItemsByType('milestone').length > 0 ? (
                  renderItemsByType('milestone')
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No milestones found. Click "Add Item" to create your first milestone.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                {getItemsByType('task').length > 0 ? (
                  renderItemsByType('task')
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No tasks found. Click "Add Item" to create your first task.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subtasks">
            <Card>
              <CardHeader>
                <CardTitle>Subtasks</CardTitle>
              </CardHeader>
              <CardContent>
                {getItemsByType('subtask').length > 0 ? (
                  renderItemsByType('subtask')
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No subtasks found. Click "Add Item" to create your first subtask.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Interactive Gantt Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <GanttChartView
              items={filteredAndSortedItems}
              onItemEdit={handleEditItem}
              onItemClick={handleItemClick}
            />
          </CardContent>
        </Card>
      )}

      <GanttItemDialog
        item={selectedItem}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedItem(null);
        }}
        onSave={handleSaveItem}
        allItems={items}
        assignees={assignees}
      />
    </div>
  );
};

export default GanttChart;
