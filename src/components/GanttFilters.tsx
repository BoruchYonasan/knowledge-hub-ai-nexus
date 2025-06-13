
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, X, Filter } from 'lucide-react';
import { format } from 'date-fns';

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

interface GanttFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  assignees: string[];
  onClearFilters: () => void;
}

const GanttFilters: React.FC<GanttFiltersProps> = ({
  filters,
  onFiltersChange,
  assignees,
  onClearFilters
}) => {
  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'sortBy' || key === 'sortOrder') return false;
    return value !== '' && value !== null && value !== 'all';
  }).length;

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filters</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">{activeFiltersCount}</Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Search</label>
          <Input
            placeholder="Search tasks..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
          />
        </div>

        {/* Type Filter */}
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Type</label>
          <Select value={filters.type || 'all'} onValueChange={(value) => updateFilter('type', value === 'all' ? '' : value)}>
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="milestone">Milestone</SelectItem>
              <SelectItem value="task">Task</SelectItem>
              <SelectItem value="subtask">Subtask</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Status</label>
          <Select value={filters.status || 'all'} onValueChange={(value) => updateFilter('status', value === 'all' ? '' : value)}>
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Not Started">Not Started</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Priority</label>
          <Select value={filters.priority || 'all'} onValueChange={(value) => updateFilter('priority', value === 'all' ? '' : value)}>
            <SelectTrigger>
              <SelectValue placeholder="All priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Assignee Filter */}
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Assignee</label>
          <Select value={filters.assignee || 'all'} onValueChange={(value) => updateFilter('assignee', value === 'all' ? '' : value)}>
            <SelectTrigger>
              <SelectValue placeholder="All assignees" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All assignees</SelectItem>
              {assignees.map(assignee => (
                <SelectItem key={assignee} value={assignee}>{assignee}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Start Date Filter */}
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Start Date From</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.startDate ? format(filters.startDate, 'MMM dd, yyyy') : 'Pick date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.startDate || undefined}
                onSelect={(date) => updateFilter('startDate', date || null)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* End Date Filter */}
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">End Date To</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.endDate ? format(filters.endDate, 'MMM dd, yyyy') : 'Pick date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.endDate || undefined}
                onSelect={(date) => updateFilter('endDate', date || null)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Sort By */}
        <div>
          <label className="text-xs font-medium text-gray-700 mb-1 block">Sort By</label>
          <Select value={filters.sortBy || 'none'} onValueChange={(value) => updateFilter('sortBy', value === 'none' ? '' : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No sorting</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="startDate">Start Date</SelectItem>
              <SelectItem value="endDate">End Date</SelectItem>
              <SelectItem value="progress">Progress</SelectItem>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default GanttFilters;
