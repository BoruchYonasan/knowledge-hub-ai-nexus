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
  
  const [isManaging, setIsManaging] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
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

  const handleEditItem = async (updatedItem: any) => {
    await updateItem(updatedItem.id, updatedItem);
  };

  const handleDeleteItem = async (id: string) => {
    await deleteItem(id);
    setSelectedItems(prev => prev.filter(itemId => itemId !== id));
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

  const getSubItems = (parentId: string) => {
    return items.filter(item => item.parent_id === parentId);
  };

  const renderHierarchicalTable = () => {
    const renderItems = (parentId?: string, level = 0): JSX.Element[] => {
      const itemsAtLevel = filteredAndSortedItems.filter(item => item.parent_id === parentId);
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

  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedItem(null);
    setIsDialogOpen(true);
  };

  const handleSaveItem = async (item: any) => {
    if (selectedItem) {
      await updateItem(selectedItem.id, item);
    } else {
      await createItem(item);
    }
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
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveItem}
        allItems={items}
        assignees={assignees}
      />
    </div>
  );
};

export default GanttChart;
