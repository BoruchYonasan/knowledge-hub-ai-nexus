
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Edit, Trash2, FileText, Calendar, User } from 'lucide-react';
import { useCompanyReports } from '@/hooks/useCompanyReports';

interface CompanyReportsProps {
  onNavigate?: (page: string, tab?: string) => void;
  isManaging?: boolean;
}

const CompanyReports: React.FC<CompanyReportsProps> = ({ onNavigate, isManaging = false }) => {
  const { reports, loading } = useCompanyReports();

  const getReportTypeColor = (type: string) => {
    const colors = {
      sales: 'bg-green-100 text-green-800',
      operations: 'bg-blue-100 text-blue-800',
      finance: 'bg-yellow-100 text-yellow-800',
      general: 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
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
            <h1 className="text-3xl font-bold text-gray-900">Company Reports</h1>
            <p className="text-gray-600">View comprehensive company reports and analytics</p>
          </div>
        </div>
        {isManaging && (
          <Button className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Report
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-2 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : reports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Card key={report.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{report.title}</h3>
                      {report.description && (
                        <p className="text-gray-600 text-sm mb-3">{report.description}</p>
                      )}
                    </div>
                    {isManaging && (
                      <div className="flex space-x-1 ml-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="w-4 h-4 mr-2" />
                      {report.author}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(report.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <Badge className={getReportTypeColor(report.report_type)}>
                      {report.report_type}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <FileText className="w-4 h-4 mr-1" />
                      Report
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Available</h3>
              <p className="text-gray-600 mb-4">
                {isManaging 
                  ? "Get started by creating your first company report." 
                  : "No reports have been published yet."
                }
              </p>
              {isManaging && (
                <Button className="flex items-center mx-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Report
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CompanyReports;
