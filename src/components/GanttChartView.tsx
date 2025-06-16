import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, ZoomIn, ZoomOut, Diamond, Users, Clock } from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { useGanttItems } from '@/hooks/useGanttItems';

// Use the GanttItem type from the hook to ensure consistency
type GanttItem = ReturnType<typeof useGanttItems>['items'][0];

interface GanttChartViewProps {
  onNavigate?: (page: string, tab?: string) => void;
  items: GanttItem[];
  onItemEdit: (item: GanttItem) => void;
  onItemClick: (item: GanttItem) => void;
  isManaging?: boolean;
}

type TimeScale = 'days' | 'weeks' | 'months' | 'quarters';

const GanttChartView: React.FC<GanttChartViewProps> = ({
  onNavigate,
  items,
  onItemEdit,
  onItemClick,
  isManaging = false
}) => {
  const [timeScale, setTimeScale] = useState<TimeScale>('weeks');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [showResourceView, setShowResourceView] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);

  // Calculate date range
  const allDates = items.flatMap(item => [new Date(item.startDate), new Date(item.endDate)]);
  const minDate = new Date(Math.min(...allDates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...allDates.map(d => d.getTime())));
  const today = new Date();

  // Extend date range for better visualization
  const chartStartDate = new Date(minDate);
  chartStartDate.setDate(chartStartDate.getDate() - 7);
  const chartEndDate = new Date(maxDate);
  chartEndDate.setDate(chartEndDate.getDate() + 7);

  const totalDays = Math.ceil((chartEndDate.getTime() - chartStartDate.getTime()) / (1000 * 60 * 60 * 24));

  // Generate timeline headers based on time scale
  const generateTimelineHeaders = () => {
    const headers = [];
    let current = new Date(chartStartDate);
    
    while (current <= chartEndDate) {
      let label = '';
      let nextDate = new Date(current);
      
      switch (timeScale) {
        case 'days':
          label = format(current, 'MMM dd');
          nextDate.setDate(nextDate.getDate() + 1);
          break;
        case 'weeks':
          label = format(current, 'MMM dd');
          nextDate = endOfWeek(current);
          nextDate.setDate(nextDate.getDate() + 1);
          break;
        case 'months':
          label = format(current, 'MMM yyyy');
          nextDate = endOfMonth(current);
          nextDate.setDate(nextDate.getDate() + 1);
          break;
        case 'quarters':
          const quarter = Math.floor(current.getMonth() / 3) + 1;
          label = `Q${quarter} ${current.getFullYear()}`;
          nextDate.setMonth(nextDate.getMonth() + 3);
          break;
      }
      
      headers.push({ date: new Date(current), label });
      current = nextDate;
    }
    
    return headers;
  };

  const timelineHeaders = generateTimelineHeaders();

  // Calculate position and width for items
  const getItemPosition = (item: GanttItem) => {
    const itemStart = new Date(item.startDate);
    const itemEnd = new Date(item.endDate);
    const startOffset = ((itemStart.getTime() - chartStartDate.getTime()) / (chartEndDate.getTime() - chartStartDate.getTime())) * 100;
    const width = ((itemEnd.getTime() - itemStart.getTime()) / (chartEndDate.getTime() - chartStartDate.getTime())) * 100;
    
    return { startOffset, width };
  };

  // Get today line position
  const getTodayPosition = () => {
    return ((today.getTime() - chartStartDate.getTime()) / (chartEndDate.getTime() - chartStartDate.getTime())) * 100;
  };

  // Handle item drag
  const handleMouseDown = (e: React.MouseEvent, itemId: string) => {
    e.preventDefault();
    setDraggedItem(itemId);
    setSelectedItem(itemId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedItem && chartRef.current) {
      // Implement drag logic here
      // This would update the item's start/end dates based on mouse position
    }
  };

  const handleMouseUp = () => {
    setDraggedItem(null);
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  // Get unique assignees
  const assignees = Array.from(new Set(items.map(item => item.assignee)));

  // Hierarchical data organization
  const getMilestones = () => {
    return items.filter(item => item.type === 'milestone');
  };

  const getTasksByMilestone = (milestoneId: string) => {
    return items.filter(item => item.type === 'task' && item.parent_id === milestoneId);
  };

  const getSubtasksByTask = (taskId: string) => {
    return items.filter(item => item.type === 'subtask' && item.parent_id === taskId);
  };

  const getOrphanedTasks = () => {
    const milestones = getMilestones();
    return items.filter(item => 
      item.type === 'task' && (!item.parent_id || !milestones.find(m => m.id === item.parent_id))
    );
  };

  const getOrphanedSubtasks = () => {
    return items.filter(item => 
      item.type === 'subtask' && (!item.parent_id || !items.find(t => t.id === item.parent_id && t.type === 'task'))
    );
  };

  const renderHierarchicalChart = () => {
    const rows: JSX.Element[] = [];
    const milestones = getMilestones();

    // Render milestones with their children
    milestones.forEach(milestone => {
      const isMilestoneExpanded = expandedItems.includes(milestone.id);
      const milestoneTasks = getTasksByMilestone(milestone.id);
      
      rows.push(renderChartRow(milestone, 0, milestoneTasks.length > 0, isMilestoneExpanded));

      if (isMilestoneExpanded) {
        milestoneTasks.forEach(task => {
          const isTaskExpanded = expandedItems.includes(task.id);
          const taskSubtasks = getSubtasksByTask(task.id);
          
          rows.push(renderChartRow(task, 1, taskSubtasks.length > 0, isTaskExpanded));

          if (isTaskExpanded) {
            taskSubtasks.forEach(subtask => {
              rows.push(renderChartRow(subtask, 2, false, false));
            });
          }
        });
      }
    });

    // Render orphaned tasks
    const orphanedTasks = getOrphanedTasks();
    orphanedTasks.forEach(task => {
      const isTaskExpanded = expandedItems.includes(task.id);
      const taskSubtasks = getSubtasksByTask(task.id);
      
      rows.push(renderChartRow(task, 0, taskSubtasks.length > 0, isTaskExpanded));

      if (isTaskExpanded) {
        taskSubtasks.forEach(subtask => {
          rows.push(renderChartRow(subtask, 1, false, false));
        });
      }
    });

    // Render orphaned subtasks
    const orphanedSubtasks = getOrphanedSubtasks();
    orphanedSubtasks.forEach(subtask => {
      rows.push(renderChartRow(subtask, 0, false, false));
    });

    return rows;
  };

  const renderChartRow = (item: GanttItem, level: number, hasSubItems: boolean, isExpanded: boolean) => {
    const { startOffset, width } = getItemPosition(item);
    const isSelected = selectedItem === item.id;
    const paddingLeft = level * 20;

    return (
      <div key={item.id} className="flex items-center border-b hover:bg-gray-50 relative">
        {/* Task Info */}
        <div className="w-80 p-3 border-r" style={{ paddingLeft: `${paddingLeft + 12}px` }}>
          <div className="flex items-center space-x-2">
            {hasSubItems && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleExpanded(item.id)}
                className="p-1 h-6 w-6"
              >
                {isExpanded ? '▼' : '▶'}
              </Button>
            )}
            {item.type === 'milestone' && <Diamond className="w-4 h-4 text-purple-500" />}
            {item.type === 'task' && <Calendar className="w-4 h-4 text-blue-500" />}
            {item.type === 'subtask' && <Clock className="w-4 h-4 text-green-500" />}
            <span className="text-sm font-medium truncate">{item.title}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {item.assignee} • {item.status}
          </div>
        </div>

        {/* Timeline Bar */}
        <div className="flex-1 relative h-12 bg-gray-50">
          {/* Task Bar */}
          <div
            className={`absolute top-3 rounded cursor-pointer transition-all duration-200 ${
              item.type === 'milestone' 
                ? 'bg-purple-400 transform rotate-45 w-6 h-6' 
                : item.type === 'task' 
                ? 'bg-blue-400 h-6' 
                : 'bg-green-400 h-6'
            } ${isSelected ? 'ring-2 ring-blue-500 ring-offset-1' : ''} ${
              draggedItem === item.id ? 'shadow-lg scale-105' : ''
            }`}
            style={{
              left: `${startOffset}%`,
              width: item.type === 'milestone' ? undefined : `${width}%`,
            }}
            onMouseDown={(e) => handleMouseDown(e, item.id)}
            onClick={() => onItemClick(item)}
            title={`${item.title} (${item.progress}% complete)`}
          >
            {/* Progress Bar */}
            {item.type !== 'milestone' && (
              <div
                className="h-full bg-black bg-opacity-20 rounded-l"
                style={{ width: `${item.progress}%` }}
              />
            )}
            
            {/* Resize Handles */}
            {item.type !== 'milestone' && (
              <>
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-black bg-opacity-30 cursor-ew-resize opacity-0 hover:opacity-100" />
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-black bg-opacity-30 cursor-ew-resize opacity-0 hover:opacity-100" />
              </>
            )}
          </div>

          {/* Progress Percentage */}
          {item.type !== 'milestone' && width > 15 && (
            <div
              className="absolute top-3 h-6 flex items-center justify-center text-xs font-medium text-white pointer-events-none"
              style={{
                left: `${startOffset}%`,
                width: `${width}%`,
              }}
            >
              {item.progress}%
            </div>
          )}
        </div>
      </div>
    );
  };

  // Resource allocation view
  const renderResourceView = () => {
    return (
      <div className="space-y-2">
        {assignees.map(assignee => {
          const assigneeItems = items.filter(item => item.assignee === assignee);
          return (
            <div key={assignee} className="flex items-center">
              <div className="w-64 text-sm font-medium truncate">
                <Users className="w-4 h-4 inline mr-2" />
                {assignee}
              </div>
              <div className="flex-1 relative h-6 bg-gray-100 rounded">
                {assigneeItems.map(item => {
                  const { startOffset, width } = getItemPosition(item);
                  return (
                    <div
                      key={item.id}
                      className="absolute h-4 top-1 bg-blue-400 rounded opacity-70 cursor-pointer hover:opacity-100"
                      style={{
                        left: `${startOffset}%`,
                        width: `${width}%`,
                      }}
                      title={item.title}
                      onClick={() => onItemClick(item)}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Dependency lines (simplified version)
  const renderDependencyLines = () => {
    const lines = [];
    items.forEach(item => {
      item.dependencies.forEach(depId => {
        const depItem = items.find(i => i.id === depId);
        if (depItem) {
          // Calculate line positions (simplified)
          const itemPos = getItemPosition(item);
          const depPos = getItemPosition(depItem);
          
          lines.push(
            <div
              key={`${item.id}-${depId}`}
              className="absolute h-0.5 bg-gray-400 z-10"
              style={{
                left: `${depPos.startOffset + depPos.width}%`,
                width: `${itemPos.startOffset - (depPos.startOffset + depPos.width)}%`,
                top: '50%',
              }}
            />
          );
        }
      });
    });
    return lines;
  };

  const todayPosition = getTodayPosition();

  return (
    <div className="space-y-4">
      {/* Chart Controls */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium">Time Scale:</label>
            <Select value={timeScale} onValueChange={(value: TimeScale) => setTimeScale(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="days">Days</SelectItem>
                <SelectItem value="weeks">Weeks</SelectItem>
                <SelectItem value="months">Months</SelectItem>
                <SelectItem value="quarters">Quarters</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.25))}
              disabled={zoomLevel <= 0.5}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm">{Math.round(zoomLevel * 100)}%</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.25))}
              disabled={zoomLevel >= 3}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={showResourceView ? "default" : "outline"}
            size="sm"
            onClick={() => setShowResourceView(!showResourceView)}
          >
            <Users className="w-4 h-4 mr-2" />
            Resource View
          </Button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <div 
          className="overflow-x-auto"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top left' }}
        >
          <div className="min-w-[1200px]">
            {/* Timeline Header */}
            <div className="flex border-b bg-gray-50">
              <div className="w-80 p-3 border-r font-medium text-gray-900">
                {showResourceView ? 'Resources' : 'Tasks (Hierarchical)'}
              </div>
              <div className="flex-1 grid border-r" style={{ gridTemplateColumns: `repeat(${timelineHeaders.length}, 1fr)` }}>
                {timelineHeaders.map((header, index) => (
                  <div key={index} className="p-2 text-xs text-center border-r text-gray-600 bg-gray-50">
                    {header.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Chart Content */}
            <div
              ref={chartRef}
              className="relative"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              {/* Today Line */}
              {todayPosition >= 0 && todayPosition <= 100 && (
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20 pointer-events-none"
                  style={{ left: `calc(320px + ${todayPosition}%)` }}
                >
                  <div className="absolute -top-2 -left-8 bg-red-500 text-white text-xs px-1 rounded">
                    Today
                  </div>
                </div>
              )}

              {/* Resource or Hierarchical View */}
              {showResourceView ? (
                <div className="p-4">
                  {renderResourceView()}
                </div>
              ) : (
                <div>
                  {renderHierarchicalChart()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <Diamond className="w-4 h-4 text-purple-500" />
          <span className="text-sm">Milestones</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-3 bg-blue-400 rounded" />
          <span className="text-sm">Tasks</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-3 bg-green-400 rounded" />
          <span className="text-sm">Subtasks</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 bg-red-500" />
          <span className="text-sm">Today</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-0.5 bg-gray-400" />
          <span className="text-sm">Dependencies</span>
        </div>
      </div>
    </div>
  );
};

export default GanttChartView;
