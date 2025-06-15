
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLatestUpdates } from '@/hooks/useLatestUpdates';
import { ArrowUpRight, TrendingUp, Users, Target, Clock, Search, BookOpen, Code, Palette, Users2 } from 'lucide-react';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { updates, loading } = useLatestUpdates();

  const companyMetrics = [
    { 
      label: 'Active Projects', 
      value: '12', 
      change: '+2', 
      changeType: 'positive',
      icon: Target,
      trend: '+16.7%'
    },
    { 
      label: 'Team Members', 
      value: '45', 
      change: '+3', 
      changeType: 'positive',
      icon: Users,
      trend: '+6.7%'
    },
    { 
      label: 'Completed Milestones', 
      value: '28', 
      change: '+5', 
      changeType: 'positive',
      icon: TrendingUp,
      trend: '+21.7%'
    },
    { 
      label: 'Pending Tasks', 
      value: '67', 
      change: '-8', 
      changeType: 'negative',
      icon: Clock,
      trend: '-10.7%'
    },
  ];

  const newsAnnouncements = [
    {
      id: 1,
      title: 'New Product Launch Q2 2024',
      date: '2024-06-14',
      priority: 'high',
      preview: 'Exciting news about our upcoming product release targeting sustainable aviation solutions...',
      category: 'Product'
    },
    {
      id: 2,
      title: 'Company Retreat Planning',
      date: '2024-06-12',
      priority: 'medium',
      preview: 'Save the date for our annual company retreat focused on innovation and team building...',
      category: 'Culture'
    },
    {
      id: 3,
      title: 'Q2 Performance Review',
      date: '2024-06-10',
      priority: 'medium',
      preview: 'Performance review cycle begins next week with new streamlined process...',
      category: 'HR'
    },
  ];

  const quickLinks = [
    { 
      title: 'Product Specifications', 
      icon: BookOpen, 
      category: 'Technical Documentation',
      description: 'Detailed product specs and requirements',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    { 
      title: 'Design Guidelines', 
      icon: Palette, 
      category: 'Processes & Procedures',
      description: 'Brand and design system guidelines',
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    { 
      title: 'Team Directory', 
      icon: Users2, 
      category: 'Company Hub',
      description: 'Contact info and organizational chart',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    { 
      title: 'Development Protocols', 
      icon: Code, 
      category: 'Product Development',
      description: 'Development standards and protocols',
      color: 'bg-orange-50 text-orange-700 border-orange-200'
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-navy-900 mb-2">Dashboard</h1>
              <p className="text-lg text-navy-600">Welcome back! Here's what's happening at AeroMail today.</p>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-navy-500">
              <span>Last updated:</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Enhanced Search Bar */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search knowledge base, projects, documents..."
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl bg-white shadow-sm"
                onClick={() => onNavigate('search')}
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Company Metrics */}
        <div className="mb-8">
          <div className="section-header">
            <div>
              <h2 className="section-title">Company Metrics</h2>
              <p className="section-subtitle">Real-time overview of key performance indicators</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyMetrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <div key={index} className="card-metric group">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <IconComponent className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="text-3xl font-bold text-navy-900">{metric.value}</div>
                      </div>
                      <div className="text-sm font-medium text-navy-600 mb-1">{metric.label}</div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-medium ${
                          metric.changeType === 'positive' ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {metric.trend}
                        </span>
                        <span className="text-xs text-navy-500">this month</span>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-navy-400 group-hover:text-navy-600 transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Latest Updates - Enhanced */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="card-elevated">
              <CardHeader className="section-header">
                <div>
                  <CardTitle className="text-xl font-semibold text-navy-900">Latest Updates</CardTitle>
                  <p className="text-sm text-navy-600 mt-1">Recent company announcements and news</p>
                </div>
                <button
                  onClick={() => onNavigate('company-hub')}
                  className="btn-secondary text-sm"
                >
                  View All →
                </button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loading ? (
                    <div className="animate-pulse space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
                      ))}
                    </div>
                  ) : (
                    updates.slice(0, 3).map((update) => (
                      <div key={update.id} className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50/30 rounded-r-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-navy-900 mb-1">{update.title}</h4>
                            <p className="text-sm text-navy-600 mb-2">{update.preview}</p>
                            <div className="flex items-center space-x-3 text-xs text-navy-500">
                              <span>By {update.author}</span>
                              <span>•</span>
                              <span>{new Date(update.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* News & Announcements - Enhanced */}
            <Card className="card-elevated">
              <CardHeader>
                <div>
                  <CardTitle className="text-xl font-semibold text-navy-900">News & Announcements</CardTitle>
                  <p className="text-sm text-navy-600 mt-1">Important company updates and communications</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {newsAnnouncements.map((news) => (
                    <div key={news.id} className="p-4 bg-gray-50 rounded-xl border hover:bg-gray-100 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <Badge className={getPriorityColor(news.priority) + ' border'}>
                          {news.priority.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-navy-500">{news.category}</span>
                      </div>
                      <h4 className="font-semibold text-navy-900 mb-2">{news.title}</h4>
                      <p className="text-sm text-navy-600 mb-2">{news.preview}</p>
                      <p className="text-xs text-navy-500">{new Date(news.date).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Links - Enhanced */}
          <div>
            <Card className="card-elevated">
              <CardHeader>
                <div>
                  <CardTitle className="text-xl font-semibold text-navy-900">Quick Links</CardTitle>
                  <p className="text-sm text-navy-600 mt-1">Popular resources and documentation</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quickLinks.map((link, index) => {
                    const IconComponent = link.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => onNavigate('knowledge')}
                        className="w-full p-4 bg-white border rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-md group"
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${link.color} border`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-semibold text-navy-900 group-hover:text-blue-600 transition-colors">{link.title}</p>
                            <p className="text-xs text-navy-600 mb-1">{link.category}</p>
                            <p className="text-xs text-navy-500">{link.description}</p>
                          </div>
                          <ArrowUpRight className="h-4 w-4 text-navy-400 group-hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
