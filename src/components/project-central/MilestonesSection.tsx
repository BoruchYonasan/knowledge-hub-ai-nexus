
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  assignee: string;
  description?: string;
  due_date: string;
  status: string;
}

interface MilestonesSectionProps {
  milestones: Milestone[];
  isManaging: boolean;
  onAddClick: () => void;
  onEditClick: (milestone: Milestone) => void;
  onDeleteClick: (id: string) => void;
  onNavigate?: (page: string, tab?: string, data?: any) => void;
}

const MilestonesSection: React.FC<MilestonesSectionProps> = ({
  milestones,
  isManaging,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onNavigate
}) => {
  const handleMilestoneClick = (milestone: Milestone) => {
    if (onNavigate) {
      onNavigate('milestone-detail', undefined, milestone);
    }
  };

  return (
    <div className="space-y-4">
      {isManaging && (
        <div className="flex justify-end">
          <Button 
            className="flex items-center"
            onClick={onAddClick}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Milestone
          </Button>
        </div>
      )}
      {milestones.map((milestone) => (
        <Card 
          key={milestone.id} 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => handleMilestoneClick(milestone)}
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className={`w-3 h-3 rounded-full ${
                  milestone.status === 'completed' ? 'bg-green-500' :
                  milestone.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-300'
                }`}></div>
                <div className="flex-1">
                  <h3 className="font-medium">{milestone.title}</h3>
                  <p className="text-sm text-gray-600">Assigned to {milestone.assignee}</p>
                  {milestone.description && (
                    <p className="text-sm text-gray-500 mt-1">{milestone.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <div className="text-sm font-medium">{new Date(milestone.due_date).toLocaleDateString()}</div>
                  <Badge variant={
                    milestone.status === 'completed' ? 'default' :
                    milestone.status === 'in-progress' ? 'secondary' : 'outline'
                  }>
                    {milestone.status}
                  </Badge>
                </div>
                {isManaging && (
                  <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onEditClick(milestone)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onDeleteClick(milestone.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MilestonesSection;
