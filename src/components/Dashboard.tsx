
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLatestUpdates } from '@/hooks/useLatestUpdates';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { updates, loading } = useLatestUpdates();

  const companyMetrics = [
    { label: 'Active Projects', value: '12', change: '+2', changeType: 'positive' },
    { label: 'Team Members', value: '45', change: '+3', changeType: 'positive' },
    { label: 'Completed Milestones', value: '28', change: '+5', changeType: 'positive' },
    { label: 'Pending Tasks', value: '67', change: '-8', changeType: 'negative' },
  ];

  const newsAnnouncements = [
    {
      id: 1,
      title: 'New Product Launch Q2 2024',
      date: '2024-06-14',
      priority: 'high',
      preview: 'Exciting news about our upcoming product release...',
    },
    {
      id: 2,
      title: 'Company Retreat Planning',
      date: '2024-06-12',
      priority: 'medium',
      preview: 'Save the date for our annual company retreat...',
    },
    {
      id: 3,
      title: 'Q2 Performance Review',
      date: '2024-06-10',
      priority: 'medium',
      preview: 'Performance review cycle begins next week...',
    },
  ];

  const quickLinks = [
    { title: 'Product Specifications', icon: '📋', category: 'Technical' },
    { title: 'Design Guidelines', icon: '🎨', category: 'Processes' },
    { title: 'Team Directory', icon: '👥', category: 'Company Hub' },
    { title: 'Project Roadmap', icon: '🗺️', category: 'Product Dev' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of company updates, metrics, and quick access to resources.</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search knowledge base..."
              className="w-full pl-10 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-lg"
              onClick={() => onNavigate('search')}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Company Metrics */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Company Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {companyMetrics.map((metric, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                  <div className="text-sm text-gray-600 mb-1">{metric.label}</div>
                  <div className={`text-xs font-medium ${
                    metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.change} this month
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Latest Updates */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-semibold">Latest Updates</CardTitle>
              <button
                onClick={() => onNavigate('company-hub')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All →
              </button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-16 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                ) : (
                  updates.slice(0, 3).map((update) => (
                    <div key={update.id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <h3 className="font-semibold text-gray-900">{update.title}</h3>
                      <p className="text-sm text-gray-600 mb-1">{update.preview}</p>
                      <p className="text-xs text-gray-500">
                        By {update.author} • {new Date(update.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* News & Announcements */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">News & Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {newsAnnouncements.map((news) => (
                  <div key={news.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Badge variant={news.priority === 'high' ? 'destructive' : 'secondary'} className="mt-1">
                      {news.priority}
                    </Badge>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{news.title}</h4>
                      <p className="text-sm text-gray-600 mb-1">{news.preview}</p>
                      <p className="text-xs text-gray-500">{new Date(news.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Quick Links to Popular Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quickLinks.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => onNavigate('knowledge')}
                    className="w-full flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <span className="text-2xl mr-3">{link.icon}</span>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{link.title}</p>
                      <p className="text-sm text-gray-600">{link.category}</p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
