
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, User, Filter, Search, Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLatestUpdates } from '@/hooks/useLatestUpdates';
import AddUpdateDialog from '@/components/AddUpdateDialog';

interface LatestUpdatesProps {
  isManaging?: boolean;
  onManagingChange?: (isManaging: boolean) => void;
  onNavigate?: (page: string) => void;
}

const LatestUpdates: React.FC<LatestUpdatesProps> = ({ isManaging = false, onManagingChange, onNavigate }) => {
  const { updates, loading, createUpdate, updateUpdate, deleteUpdate } = useLatestUpdates();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const { toast } = useToast();

  const filteredUpdates = useMemo(() => {
    return updates.filter(update => {
      const matchesSearch = update.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          update.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPriority = filterPriority === 'all' || update.priority === filterPriority;
      const matchesDepartment = filterDepartment === 'all' || update.department === filterDepartment;
      
      return matchesSearch && matchesPriority && matchesDepartment;
    });
  }, [updates, searchTerm, filterPriority, filterDepartment]);

  const departments = useMemo(() => {
    return Array.from(new Set(updates.map(update => update.department).filter(Boolean)));
  }, [updates]);

  const handleEdit = async (id: string, updatedData: any) => {
    await updateUpdate(id, updatedData);
  };

  const handleDelete = async (id: string) => {
    await deleteUpdate(id);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {onNavigate && (
            <Button 
              variant="ghost" 
              onClick={() => onNavigate('dashboard')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Latest Updates</h1>
            <p className="text-gray-600">Stay informed with the latest company news and announcements</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <AddUpdateDialog />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search updates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterDepartment} onValueChange={setFilterDepartment}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map(dept => (
              <SelectItem key={dept} value={dept!}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Updates ({filteredUpdates.length})</TabsTrigger>
          <TabsTrigger value="high">High Priority ({filteredUpdates.filter(u => u.priority === 'high').length})</TabsTrigger>
          <TabsTrigger value="recent">Recent (24h) ({filteredUpdates.filter(u => new Date(u.created_at) > new Date(Date.now() - 24*60*60*1000)).length})</TabsTrigger>
        </TabsList>

        <ScrollArea className="h-[calc(100vh-400px)]">
          <TabsContent value="all" className="space-y-4">
            {filteredUpdates.map((update) => {
              const { date, time } = formatDateTime(update.created_at);
              return (
                <Card key={update.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{update.title}</CardTitle>
                          <Badge className={getPriorityColor(update.priority)}>
                            {update.priority}
                          </Badge>
                          {update.department && (
                            <Badge variant="outline">{update.department}</Badge>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {update.author}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {date} at {time}
                          </div>
                        </div>
                      </div>
                      {isManaging && (
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(update.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-3">{update.preview}</p>
                    <Button variant="outline" size="sm">
                      Read More
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="high" className="space-y-4">
            {filteredUpdates.filter(u => u.priority === 'high').map((update) => {
              const { date, time } = formatDateTime(update.created_at);
              return (
                <Card key={update.id} className="hover:shadow-md transition-shadow border-red-200">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{update.title}</CardTitle>
                          <Badge className="bg-red-100 text-red-800">HIGH</Badge>
                          {update.department && (
                            <Badge variant="outline">{update.department}</Badge>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {update.author}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {date} at {time}
                          </div>
                        </div>
                      </div>
                      {isManaging && (
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(update.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-3">{update.preview}</p>
                    <Button variant="outline" size="sm">
                      Read More
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            {filteredUpdates.filter(u => new Date(u.created_at) > new Date(Date.now() - 24*60*60*1000)).map((update) => {
              const { date, time } = formatDateTime(update.created_at);
              return (
                <Card key={update.id} className="hover:shadow-md transition-shadow border-blue-200">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{update.title}</CardTitle>
                          <Badge className={getPriorityColor(update.priority)}>
                            {update.priority}
                          </Badge>
                          <Badge className="bg-blue-100 text-blue-800">NEW</Badge>
                          {update.department && (
                            <Badge variant="outline">{update.department}</Badge>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {update.author}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {date} at {time}
                          </div>
                        </div>
                      </div>
                      {isManaging && (
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(update.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-3">{update.preview}</p>
                    <Button variant="outline" size="sm">
                      Read More
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default LatestUpdates;
