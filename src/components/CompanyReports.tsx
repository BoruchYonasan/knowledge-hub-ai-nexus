
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CompanyReportsProps {
  onNavigate?: (page: string, tab?: string) => void;
}

const CompanyReports: React.FC<CompanyReportsProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Company Reports</h1>
        <p className="text-gray-600">View comprehensive company reports and analytics</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Reports Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Company reports implementation coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyReports;
