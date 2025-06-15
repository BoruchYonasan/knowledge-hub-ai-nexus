
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, User, Search, Plus, Edit, Trash2, ArrowLeft, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AddReportDialog from '@/components/AddReportDialog';

interface CompanyReportsProps {
  isManaging?: boolean;
  onManagingChange?: (isManaging: boolean) => void;
  onNavigate?: (page: string) => void;
}

// Mock data for company reports
const mockReports = [
  {
    id: '1',
    title: 'Weekly Sales Report - June Week 2',
    preview: 'Sales performance analysis for the second week of June, showing a 15% increase over previous week.',
    content: 'Detailed sales analysis...',
    author: 'Sales Team',
    department: 'Sales',
    type: 'Weekly',
    created_at: '2024-06-14T10:00:00Z',
    updated_at: '2024-06-14T10:00:00Z'
  },
  {
    id: '2',
    title: 'Operations Summary - June Week 2',
    preview: 'Operational efficiency metrics and performance indicators for the second week of June.',
    content: 'Operational summary...',
    author: 'Operations Team',
    department: 'Operations',
    type: 'Weekly',
    created_at: '2024-06-14T09:00:00Z',
    updated_at: '2024-06-14T09:00:00Z'
  },
  {
    id: '3',
    title: 'Weekly Sales Report - June Week 1',
    preview: 'Sales performance analysis for the first week of June.',
    content: 'Sales analysis...',
    author: 'Sales Team',
    department: 'Sales',
    type: 'Weekly',
    created_at: '2024-06-07T10:00:00Z',
    updated_at: '2024-06-07T10:00:00Z'
  },
  {
    id: '4',
    title: 'Operations Summary - June Week 1',
    preview: 'Operational efficiency metrics for the first week of June.',
    content: 'Operational details...',
    author: 'Operations Team',
    department: 'Operations',
    type: 'Weekly',
    created_at: '2024-06-07T09:00:00Z',
    updated_at: '2024-06-07T09:00:00Z'
  },
  {
    id: '5',
    title: 'Monthly Financial Review - May 2024',
    preview: 'Comprehensive financial performance review for May 2024.',
    content: 'Financial review...',
    author: 'Finance Team',
    department: 'Finance',
    type: 'Monthly',
    created_at: '2024-05-31T15:00:00Z',
    updated_at: '2024-05-31T15:00:00Z'
  }
];

const CompanyReports: React.FC<CompanyReportsProps> = ({ isManaging = false, onManagingChange, onNavigate }) => {
  const [reports] = useState(mockReports);
  const [loading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const { toast } = useToast();

  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.preview.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || report.type === filterType;
      const matchesDepartment = filterDepartment === 'all' || report.department === filterDepartment;
      
      return matchesSearch && matchesType && matchesDepartment;
    });
  }, [reports, searchTerm, filterType, filterDepartment]);

  const departments = useMemo(() => {
    return Array.from(new Set(reports.map(report => report.department).filter(Boolean)));
  }, [reports]);

  const reportTypes = useMemo(() => {
    return Array.from(new Set(reports.map(report => report.type).filter(Boolean)));
  }, [reports]);

  const handleEdit = async (id: string, updatedData: any) => {
    // TODO: Implement edit functionality
    console.log('Edit report:', id, updatedData);
  };

  const handleDelete = async (id: string) => {
    // TODO: Implement delete functionality
    console.log('Delete report:', id);
    toast({
      title: "Report Deleted",
      description: "Company report has been deleted successfully"
    });
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'weekly': return 'bg-blue-100 text-blue-800';
      case 'monthly': return 'bg-green-100 text-green-800';
      case 'quarterly': return 'bg-purple-100 text-purple-800';
      case 'annual': return 'bg-orange-100 text-orange-800';
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
      <div className="flex items-start space-x-4">
        {onNavigate && (
          <Button 
            variant="ghost" 
            onClick={() => onNavigate('dashboard')}
            className="flex items-center space-x-2 mt-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
        )}
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Company Reports</h1>
              <p className="text-gray-600">Access all company reports and performance metrics</p>
            </div>
            <div className="flex space-x-2">
              <AddReportDialog />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {reportTypes.map(type => (
              <SelectItem key={type} value={type!}>{type}</SelectItem>
            ))}
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
          <TabsTrigger value="all">All Reports ({filteredReports.length})</TabsTrigger>
          <TabsTrigger value="weekly">Weekly ({filteredReports.filter(r => r.type === 'Weekly').length})</TabsTrigger>
          <TabsTrigger value="recent">Recent (30d) ({filteredReports.filter(r => new Date(r.created_at) > new Date(Date.now() - 30*24*60*60*1000)).length})</TabsTrigger>
        </TabsList>

        <ScrollArea className="h-[calc(100vh-400px)]">
          <TabsContent value="all" className="space-y-4">
            {filteredReports.map((report) => {
              const { date, time } = formatDateTime(report.created_at);
              return (
                <Card key={report.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{report.title}</CardTitle>
                          <Badge className={getTypeColor(report.type)}>
                            {report.type}
                          </Badge>
                          {report.department && (
                            <Badge variant="outline">{report.department}</Badge>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {report.author}
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
                            onClick={() => handleDelete(report.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-3">{report.preview}</p>
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      View Report
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="weekly" className="space-y-4">
            {filteredReports.filter(r => r.type === 'Weekly').map((report) => {
              const { date, time } = formatDateTime(report.created_at);
              return (
                <Card key={report.id} className="hover:shadow-md transition-shadow border-blue-200">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{report.title}</CardTitle>
                          <Badge className="bg-blue-100 text-blue-800">WEEKLY</Badge>
                          {report.department && (
                            <Badge variant="outline">{report.department}</Badge>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {report.author}
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
                            onClick={() => handleDelete(report.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-3">{report.preview}</p>
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      View Report
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            {filteredReports.filter(r => new Date(r.created_at) > new Date(Date.now() - 30*24*60*60*1000)).map((report) => {
              const { date, time } = formatDateTime(report.created_at);
              return (
                <Card key={report.id} className="hover:shadow-md transition-shadow border-green-200">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{report.title}</CardTitle>
                          <Badge className={getTypeColor(report.type)}>
                            {report.type}
                          </Badge>
                          <Badge className="bg-green-100 text-green-800">RECENT</Badge>
                          {report.department && (
                            <Badge variant="outline">{report.department}</Badge>
                          )}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 space-x-4">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {report.author}
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
                            onClick={() => handleDelete(report.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-3">{report.preview}</p>
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4 mr-2" />
                      View Report
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

export default CompanyReports;
