
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useLatestUpdates } from '@/hooks/useLatestUpdates';
import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Plus, Search, Filter, Clock, User, Building } from 'lucide-react';
import AddUpdateDialog from './AddUpdateDialog';

interface LatestUpdatesProps {
  onNavigate?: (page: string, tab?: string) => void;
  isManaging?: boolean;
}

const LatestUpdates: React.FC<LatestUpdatesProps> = ({ onNavigate, isManaging = false }) => {
  const { updates, loading, createUpdate } = useLatestUpdates();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const departments = ['All', 'Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations'];
  
  const filteredUpdates = updates.filter(update => {
    const matchesSearch = update.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         update.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === '' || selectedDepartment === 'All' || 
                             update.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const handleAddUpdate = async (updateData: {
    title: string;
    content: string;
    priority: 'high' | 'medium' | 'low';
    department: string;
    author: string;
  }) => {
    try {
      await createUpdate({
        ...updateData,
        preview: updateData.content.substring(0, 100) + '...',
        attachments: [],
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      // Error is handled by the hook
    }
  };

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
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onNavigate?.('dashboard')}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Latest Updates</h1>
            <p className="text-gray-600">Stay informed with the latest company announcements</p>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search updates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept === 'All' ? '' : dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          
          {isManaging && (
            <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add Update
            </Button>
          )}
        </div>
      </div>

      {/* Updates List */}
      <div className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredUpdates.length > 0 ? (
          filteredUpdates.map((update) => (
            <Card key={update.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{update.title}</CardTitle>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
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
                  <Badge variant={getPriorityColor(update.priority || 'medium')}>
                    {update.priority}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{update.content}</p>
                {update.attachments && update.attachments.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-900 mb-2">Attachments:</p>
                    <div className="space-y-1">
                      {update.attachments.map((attachment, index) => (
                        <a
                          key={index}
                          href={attachment}
                          className="text-blue-600 hover:text-blue-800 text-sm block"
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
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Clock className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Updates Found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedDepartment 
                  ? "Try adjusting your search or filter criteria."
                  : "No updates have been published yet."
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <AddUpdateDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddUpdate={handleAddUpdate}
      />
    </div>
  );
};

export default LatestUpdates;
