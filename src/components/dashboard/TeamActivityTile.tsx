
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, User, Clock } from 'lucide-react';

interface TeamActivityTileProps {
  onNavigate: (page: string, tab?: string) => void;
}

const TeamActivityTile: React.FC<TeamActivityTileProps> = ({ onNavigate }) => {
  // Mock team activity data
  const activities = [
    {
      id: 1,
      user: 'Sarah Johnson',
      action: 'updated project',
      target: 'AeroMail Pro v2.0',
      time: '2 hours ago',
      type: 'project'
    },
    {
      id: 2,
      user: 'Mike Chen',
      action: 'created article',
      target: 'API Documentation',
      time: '4 hours ago',
      type: 'knowledge'
    },
    {
      id: 3,
      user: 'Alex Rodriguez',
      action: 'completed task',
      target: 'Performance Testing',
      time: '6 hours ago',
      type: 'task'
    },
    {
      id: 4,
      user: 'Emma Davis',
      action: 'published update',
      target: 'Q2 Sales Report',
      time: '1 day ago',
      type: 'update'
    }
  ];

  const getActivityColor = (type: string) => {
    const colors = {
      project: 'bg-blue-100 text-blue-800',
      knowledge: 'bg-green-100 text-green-800',
      task: 'bg-yellow-100 text-yellow-800',
      update: 'bg-purple-100 text-purple-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onNavigate('content-manager')}
    >
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center justify-between">
          <div className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Team Activity
          </div>
          <span className="text-sm font-normal text-blue-600">View All →</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-2 rounded hover:bg-gray-50 transition-colors">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm">
                  <span className="font-medium text-gray-900">{activity.user}</span>
                  <span className="text-gray-600"> {activity.action} </span>
                  <span className="font-medium text-gray-900">{activity.target}</span>
                </p>
                <Badge className={`text-xs ${getActivityColor(activity.type)}`}>
                  {activity.type}
                </Badge>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                {activity.time}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TeamActivityTile;
