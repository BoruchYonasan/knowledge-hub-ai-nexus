
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, User, Building } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface UpdateDetailProps {
  update: {
    id: string;
    title: string;
    content: string;
    author: string;
    department?: string;
    priority: 'high' | 'medium' | 'low';
    attachments?: string[];
    created_at: string;
  } | null;
  onBack: () => void;
}

const UpdateDetail: React.FC<UpdateDetailProps> = ({ update, onBack }) => {
  if (!update) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBack}
          className="flex items-center mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Update Not Found</h2>
          <p className="text-gray-600">The update you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBack}
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Latest Updates
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-4">{update.title}</CardTitle>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {update.author}
                </div>
                {update.department && (
                  <div className="flex items-center">
                    <Building className="w-4 h-4 mr-1" />
                    {update.department}
                  </div>
                )}
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {formatDistanceToNow(new Date(update.created_at), { addSuffix: true })}
                </div>
              </div>
            </div>
            <Badge variant={getPriorityColor(update.priority)}>
              {update.priority}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {update.content}
            </div>
          </div>
          
          {update.attachments && update.attachments.length > 0 && (
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Attachments</h3>
              <div className="space-y-2">
                {update.attachments.map((attachment, index) => (
                  <a
                    key={index}
                    href={attachment}
                    className="text-blue-600 hover:text-blue-800 block"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📎 {attachment}
                  </a>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateDetail;
