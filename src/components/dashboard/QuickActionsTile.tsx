
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Users, Calendar, Zap } from 'lucide-react';

interface QuickActionsTileProps {
  onNavigate: (page: string, tab?: string) => void;
}

const QuickActionsTile: React.FC<QuickActionsTileProps> = ({ onNavigate }) => {
  const quickActions = [
    {
      id: 1,
      label: 'New Project',
      icon: Plus,
      action: () => onNavigate('project-central'),
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      id: 2,
      label: 'Add Update',
      icon: FileText,
      action: () => onNavigate('latest-updates'),
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      id: 3,
      label: 'Team View',
      icon: Users,
      action: () => onNavigate('company-hub'),
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      id: 4,
      label: 'Schedule',
      icon: Calendar,
      action: () => onNavigate('project-central', 'gantt'),
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
          <Zap className="w-5 h-5 mr-2" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action) => (
            <Button
              key={action.id}
              onClick={action.action}
              className={`${action.color} text-white h-16 flex flex-col items-center justify-center space-y-1 text-xs font-medium`}
            >
              <action.icon className="w-4 h-4" />
              <span>{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionsTile;
