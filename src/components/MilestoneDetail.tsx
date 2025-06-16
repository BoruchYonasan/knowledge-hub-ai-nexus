
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User, Flag } from 'lucide-react';
import { format } from 'date-fns';
import type { Milestone } from '@/hooks/useMilestones';

interface MilestoneDetailProps {
  milestone: Milestone;
  onBack: () => void;
}

const MilestoneDetail: React.FC<MilestoneDetailProps> = ({ milestone, onBack }) => {
  if (!milestone) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Milestone Not Found</h2>
          <p className="text-gray-600 mb-6">The milestone you're looking for doesn't exist.</p>
          <Button onClick={onBack} className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Milestones
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const isOverdue = new Date(milestone.due_date) < new Date() && milestone.status !== 'completed';

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBack}
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Milestones
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{milestone.title}</h1>
          <p className="text-gray-600">Milestone Details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Flag className="w-5 h-5 mr-2" />
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {milestone.description && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{milestone.description}</p>
                </div>
              )}
              
              <div className="flex items-center space-x-4">
                <div className={`w-4 h-4 rounded-full ${getStatusColor(milestone.status)}`}></div>
                <Badge className={`capitalize ${getStatusColor(milestone.status)} text-white`}>
                  {milestone.status.replace('-', ' ')}
                </Badge>
                {isOverdue && (
                  <Badge variant="destructive">
                    Overdue
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Assignee</label>
                <div className="mt-1 flex items-center">
                  <User className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-gray-900">{milestone.assignee}</span>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Due Date</label>
                <p className={`text-gray-900 ${isOverdue ? 'text-red-600 font-medium' : ''}`}>
                  {format(new Date(milestone.due_date), 'MMMM dd, yyyy')}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Created</label>
                <p className="text-gray-900">{format(new Date(milestone.created_at), 'MMM dd, yyyy')}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-600">Last Updated</label>
                <p className="text-gray-900">{format(new Date(milestone.updated_at), 'MMM dd, yyyy')}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MilestoneDetail;
