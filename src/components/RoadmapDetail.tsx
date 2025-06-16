
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Calendar, Target, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import type { RoadmapItem } from '@/hooks/useRoadmapItems';

interface RoadmapDetailProps {
  roadmapItem: RoadmapItem;
  onBack: () => void;
}

const RoadmapDetail: React.FC<RoadmapDetailProps> = ({ roadmapItem, onBack }) => {
  if (!roadmapItem) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Roadmap Item Not Found</h2>
          <p className="text-gray-600 mb-6">The roadmap item you're looking for doesn't exist.</p>
          <Button onClick={onBack} className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Roadmap
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'planning': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Fixed Header Layout */}
      <div className="space-y-4">
        <div className="flex justify-start">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onBack}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Roadmap
          </Button>
        </div>
        
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">{roadmapItem.title}</h1>
          <p className="text-gray-600">Roadmap Item Details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {roadmapItem.description && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{roadmapItem.description}</p>
                </div>
              )}
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Progress</h3>
                <div className="flex items-center space-x-4">
                  <Progress value={roadmapItem.completion} className="flex-1" />
                  <span className="text-sm font-medium text-gray-600">{roadmapItem.completion}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Quarter</label>
                <div className="mt-1">
                  <Badge variant="outline" className="text-base">
                    {roadmapItem.quarter}
                  </Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <div className="mt-1">
                  <Badge className={`capitalize ${getStatusColor(roadmapItem.status)} text-white`}>
                    {roadmapItem.status.replace('-', ' ')}
                  </Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Created</label>
                <p className="text-gray-900">{format(new Date(roadmapItem.created_at), 'MMM dd, yyyy')}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Last Updated</label>
                <p className="text-gray-900">{format(new Date(roadmapItem.updated_at), 'MMM dd, yyyy')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RoadmapDetail;
