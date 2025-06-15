
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

  const newsAnnouncements = [
    { title: 'Office reopening on May 15th', timeAgo: '3 days' },
    { title: 'Launch of AeroMail 2.0 platform', timeAgo: '7 days' },
  ];

  const quickLinksLeft = [
    'Popular Resources',
    'Team Directory',
  ];

  const quickLinksRight = [
    'Technical Documentation',
    'Product Roadmap',
  ];

  const quickLinksBottom = [
    'Popular Resources',
    'Technical Documentation',
    'Team Directory',
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pl-0 lg:pl-64">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Latest Updates */}
          <div className="lg:col-span-4">
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Latest Updates</CardTitle>
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
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Of Sales Report has been published
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Updated project plan for Project Phoenix
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          New employee onboarding guide
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* News & Announcements */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">News & Announcements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {newsAnnouncements.map((news, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
                      <p className="text-sm text-gray-900">{news.title}</p>
                    </div>
                    <span className="text-xs text-gray-500">{news.timeAgo}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Links (Bottom) */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Quick Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {quickLinksLeft.map((link, index) => (
                    <button
                      key={index}
                      onClick={() => onNavigate('knowledge')}
                      className="p-3 text-sm text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {link}
                    </button>
                  ))}
                  {quickLinksRight.map((link, index) => (
                    <button
                      key={index}
                      onClick={() => onNavigate('knowledge')}
                      className="p-3 text-sm text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {link}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Column - Company Metrics */}
          <div className="lg:col-span-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Company Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6 text-center">
                  {companyMetrics.map((metric, index) => (
                    <div key={index}>
                      <div className="text-3xl font-bold text-gray-900 mb-1">{metric.value}</div>
                      <div className="text-sm text-gray-600">{metric.sublabel}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Project Timeline */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Project Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-4">
                    <span>March</span>
                    <span>Apr</span>
                    <span>Apr</span>
                    <span>May</span>
                  </div>
                  <div className="space-y-3">
                    <div className="h-2 bg-blue-200 rounded-full">
                      <div className="h-2 bg-blue-500 rounded-full w-3/4"></div>
                    </div>
                    <div className="h-2 bg-purple-200 rounded-full">
                      <div className="h-2 bg-purple-500 rounded-full w-1/2"></div>
                    </div>
                    <div className="h-2 bg-yellow-200 rounded-full">
                      <div className="h-2 bg-yellow-500 rounded-full w-1/4"></div>
                    </div>
                    <div className="h-2 bg-green-200 rounded-full">
                      <div className="h-2 bg-green-500 rounded-full w-5/6"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - AI Assistant & Quick Links */}
          <div className="lg:col-span-4">
            <Card className="bg-blue-600 text-white">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">AI Assistant</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white text-gray-900 rounded-lg p-4 mb-4">
                  <p className="text-sm">How can I help you today?</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links (Right) */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickLinksBottom.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => onNavigate('knowledge')}
                    className="w-full p-3 text-sm text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {link}
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
