
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, BarChart3 } from 'lucide-react';
import { useGanttItems } from '@/hooks/useGanttItems';

interface GanttOverviewTileProps {
  onNavigate: (page: string, tab?: string) => void;
}

const GanttOverviewTile: React.FC<GanttOverviewTileProps> = ({ onNavigate }) => {
  const { items, loading } = useGanttItems();

  // Get active items (not completed) and sort by start date
  const activeItems = items
    .filter(item => item.status !== 'Completed')
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
    .slice(0, 4); // Show top 4 items

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-500';
      case 'On Hold': return 'bg-yellow-500';
      case 'Not Started': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getProgressWidth = (progress: number) => `${Math.min(progress, 100)}%`;

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onNavigate('gantt-chart')}
    >
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center justify-between">
          <div className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Gantt Overview
          </div>
          <span className="text-sm font-normal text-blue-600">View Chart →</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="animate-pulse space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        ) : activeItems.length > 0 ? (
          activeItems.map((item) => (
            <div key={item.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(item.status)}`}></div>
                  <span className="text-sm font-medium text-gray-900 truncate">{item.title}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {item.type}
                </Badge>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>{new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full ${getStatusColor(item.status)}`}
                  style={{ width: getProgressWidth(item.progress) }}
                ></div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            <BarChart3 className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No active gantt items</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GanttOverviewTile;
