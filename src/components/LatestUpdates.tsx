
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, User, Building, AlertCircle, Plus, Edit, Trash2 } from 'lucide-react';
import { useLatestUpdates } from '@/hooks/useLatestUpdates';
import { useContentManager } from '@/hooks/useContentManager';

const LatestUpdates: React.FC = () => {
  const { updates, loading } = useLatestUpdates();
  const { createUpdateFromAI, editUpdateFromAI, deleteUpdateFromAI } = useContentManager();
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  // Listen for AI-created updates
  useEffect(() => {
    const handleAICreatedUpdate = (event: CustomEvent) => {
      const newUpdate = event.detail;
      // The hook will automatically refetch, but we can trigger additional logic here if needed
    };

    const handleAIEditedUpdate = (event: CustomEvent) => {
      const updatedUpdate = event.detail;
      // Handle AI edits
    };

    const handleAIDeletedUpdate = (event: CustomEvent) => {
      const { id } = event.detail;
      // Handle AI deletions
    };

    window.addEventListener('ai-created-update', handleAICreatedUpdate as EventListener);
    window.addEventListener('ai-edited-update', handleAIEditedUpdate as EventListener);
    window.addEventListener('ai-deleted-update', handleAIDeletedUpdate as EventListener);

    return () => {
      window.removeEventListener('ai-created-update', handleAICreatedUpdate as EventListener);
      window.removeEventListener('ai-edited-update', handleAIEditedUpdate as EventListener);
      window.removeEventListener('ai-deleted-update', handleAIDeletedUpdate as EventListener);
    };
  }, []);

  const filteredUpdates = updates.filter(update => {
    if (selectedPriority === 'all') return true;
    return update.priority === selectedPriority;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Latest Updates</h1>
          <p className="text-gray-600">Stay informed with the latest company news and announcements</p>
        </div>
        <Button className="flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Update
        </Button>
      </div>

      <Tabs value={selectedPriority} onValueChange={setSelectedPriority}>
        <TabsList>
          <TabsTrigger value="all">All Updates</TabsTrigger>
          <TabsTrigger value="high" className="text-red-600">High Priority</TabsTrigger>
          <TabsTrigger value="medium">Medium Priority</TabsTrigger>
          <TabsTrigger value="low">Low Priority</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedPriority} className="space-y-4">
          {filteredUpdates.map(update => (
            <Card key={update.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{update.title}</CardTitle>
                      <Badge variant={getPriorityColor(update.priority) as any} className="flex items-center gap-1">
                        {getPriorityIcon(update.priority)}
                        {update.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(update.created_at)}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {update.author}
                      </div>
                      {update.department && (
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          {update.department}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{update.preview}</p>
                
                {update.attachments && update.attachments.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Attachments</h4>
                    <div className="flex flex-wrap gap-2">
                      {update.attachments.map((attachment, index) => (
                        <Badge key={index} variant="outline">
                          {attachment}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {filteredUpdates.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No updates found</h3>
          <p className="text-gray-600">
            {selectedPriority === 'all' 
              ? 'No updates have been posted yet.'
              : `No ${selectedPriority} priority updates available.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default LatestUpdates;
