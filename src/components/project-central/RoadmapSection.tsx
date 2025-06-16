
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  quarter: string;
  completion: number;
  status: string;
}

interface RoadmapSectionProps {
  roadmapItems: RoadmapItem[];
  isManaging: boolean;
  onAddClick: () => void;
  onEditClick: (item: RoadmapItem) => void;
  onDeleteClick: (id: string) => void;
}

const RoadmapSection: React.FC<RoadmapSectionProps> = ({
  roadmapItems,
  isManaging,
  onAddClick,
  onEditClick,
  onDeleteClick
}) => {
  return (
    <div className="space-y-4">
      {isManaging && (
        <div className="flex justify-end">
          <Button 
            className="flex items-center"
            onClick={onAddClick}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Roadmap Item
          </Button>
        </div>
      )}
      {roadmapItems.map((item) => (
        <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={item.status === 'in-progress' ? 'default' : 'secondary'}>
                  {item.quarter}
                </Badge>
                {isManaging && (
                  <div className="flex space-x-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onEditClick(item)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onDeleteClick(item.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex-1 mr-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{item.completion}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${item.completion}%` }}
                  ></div>
                </div>
              </div>
              <Badge variant={
                item.status === 'in-progress' ? 'default' : 
                item.status === 'planning' ? 'secondary' : 'outline'
              }>
                {item.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RoadmapSection;
