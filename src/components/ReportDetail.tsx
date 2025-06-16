
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User, FileText } from 'lucide-react';

interface ReportDetailProps {
  report: {
    id: string;
    title: string;
    description?: string;
    content?: string;
    author: string;
    report_type: string;
    created_at: string;
  } | null;
  onBack: () => void;
}

const ReportDetail: React.FC<ReportDetailProps> = ({ report, onBack }) => {
  if (!report) {
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Not Found</h2>
          <p className="text-gray-600">The report you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBack}
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Company Reports
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-4">{report.title}</CardTitle>
              {report.description && (
                <p className="text-gray-600 mb-4">{report.description}</p>
              )}
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {report.author}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(report.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-1" />
                  Report
                </div>
              </div>
            </div>
            <Badge className={getReportTypeColor(report.report_type)}>
              {report.report_type}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {report.content ? (
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {report.content}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No content available for this report.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportDetail;
