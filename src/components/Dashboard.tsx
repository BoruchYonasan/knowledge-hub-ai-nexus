
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLatestUpdates } from '@/hooks/useLatestUpdates';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { updates, loading } = useLatestUpdates();

  const companyMetrics = [
    { label: 'Active Projects', value: '23', sublabel: 'Projects' },
    { label: 'Open Tasks', value: '127', sublabel: 'Tasks' },
    { label: 'Upcoming Milestones', value: '12', sublabel: 'Milestones' },
  ];

  const companyReports = [
    { title: 'Q4 Sales Report', date: 'Dec 15, 2024', status: 'Published' },
    { title: 'Weekly Operations Summary', date: 'Dec 10, 2024', status: 'Draft' },
    { title: 'Monthly Performance Review', date: 'Dec 1, 2024', status: 'Published' },
  ];

  const worksInProgress = [
    { title: 'Product Phoenix Development', progress: 75, team: 'Engineering' },
    { title: 'Q1 Marketing Campaign', progress: 45, team: 'Marketing' },
    { title: 'Customer Portal Redesign', progress: 90, team: 'UX/UI' },
    { title: 'API Integration Project', progress: 30, team: 'Backend' },
  ];

  const roadmapItems = [
    { milestone: 'Beta Release', date: 'Q1 2025', status: 'On Track' },
    { milestone: 'Mobile App Launch', date: 'Q2 2025', status: 'Planning' },
    { milestone: 'International Expansion', date: 'Q3 2025', status: 'Research' },
  ];

  const quickLinks = [
    'Technical Documentation',
    'Team Directory',
    'Product Roadmap',
    'Popular Resources',
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pl-0 lg:pl-64">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening at AeroMail today.</p>
        </div>

        {/* Company Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {companyMetrics.map((metric, index) => (
            <Card key={index} className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-800 mb-1">{metric.value}</div>
                <div className="text-sm text-blue-600">{metric.label}</div>
                <div className="text-xs text-gray-500 mt-1">{metric.sublabel}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Latest Updates */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-blue-800">Latest Updates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium text-blue-800">Q4 Sales Report has been published</p>
                        <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-emerald-50 rounded-lg">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium text-blue-800">Updated project plan for Project Phoenix</p>
                        <p className="text-xs text-gray-500 mt-1">4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium text-blue-800">New employee onboarding guide</p>
                        <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Company Reports */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-blue-800">Company Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {companyReports.map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer">
                    <div>
                      <p className="text-sm font-medium text-blue-800">{report.title}</p>
                      <p className="text-xs text-gray-500">{report.date}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      report.status === 'Published' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Center Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Works In Progress Snapshot */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-blue-800">Works In Progress Snapshot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {worksInProgress.map((work, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-blue-800">{work.title}</p>
                      <span className="text-xs text-gray-500">{work.team}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${work.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-blue-700">{work.progress}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Roadmap */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-blue-800">Roadmap</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {roadmapItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-blue-800">{item.milestone}</p>
                      <p className="text-xs text-gray-600">{item.date}</p>
                    </div>
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                      item.status === 'On Track' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : item.status === 'Planning'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4">
            {/* Quick Links to Popular Resources */}
            <Card className="shadow-sm border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-blue-800">Quick Links to Popular Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickLinks.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => onNavigate('knowledge')}
                    className="w-full p-4 text-left bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg hover:from-blue-50 hover:to-indigo-50 hover:border-blue-300 transition-all duration-200 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-800 group-hover:text-blue-900">{link}</span>
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
