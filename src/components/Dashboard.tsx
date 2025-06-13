
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const latestUpdates = [
    {
      id: 1,
      title: 'Q4 Company All-Hands Meeting',
      date: '2024-06-10',
      author: 'Sarah Johnson',
      preview: 'Join us for the quarterly all-hands meeting where we\'ll discuss...',
    },
    {
      id: 2,
      title: 'New Employee Onboarding Process',
      date: '2024-06-08',
      author: 'Mike Chen',
      preview: 'We\'ve updated our onboarding process to include...',
    },
    {
      id: 3,
      title: 'Security Policy Updates',
      date: '2024-06-05',
      author: 'Jennifer Adams',
      preview: 'Important changes to our security policies effective...',
    },
  ];

  const worksInProgress = [
    {
      id: 1,
      title: 'Customer Portal Redesign',
      lead: 'Alex Rodriguez',
      status: 'In Progress',
      progress: 65,
      dueDate: '2024-07-15',
    },
    {
      id: 2,
      title: 'API Documentation Update',
      lead: 'Emily Watson',
      status: 'Planning',
      progress: 20,
      dueDate: '2024-08-01',
    },
    {
      id: 3,
      title: 'Mobile App Performance Optimization',
      lead: 'David Kim',
      status: 'In Progress',
      progress: 80,
      dueDate: '2024-06-30',
    },
  ];

  const quickLinks = [
    { title: 'Employee Handbook', icon: '📖', category: 'HR' },
    { title: 'Technical Documentation', icon: '⚙️', category: 'Engineering' },
    { title: 'Sales Playbook', icon: '💼', category: 'Sales' },
    { title: 'Marketing Guidelines', icon: '📢', category: 'Marketing' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to the Knowledge Base</h1>
        <p className="text-gray-600">Find information, stay updated, and collaborate effectively.</p>
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

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Latest Updates */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-semibold">Latest Updates</CardTitle>
              <button
                onClick={() => onNavigate('updates')}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All →
              </button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {latestUpdates.map((update) => (
                  <div key={update.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <h3 className="font-semibold text-gray-900">{update.title}</h3>
                    <p className="text-sm text-gray-600 mb-1">{update.preview}</p>
                    <p className="text-xs text-gray-500">
                      By {update.author} • {new Date(update.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access */}
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Quick Access</CardTitle>
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

      {/* Works in Progress */}
      <div className="mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-semibold">Works in Progress</CardTitle>
            <button
              onClick={() => onNavigate('progress')}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All →
            </button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {worksInProgress.map((project) => (
                <div key={project.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{project.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      project.status === 'In Progress' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Lead: {project.lead}</p>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Due: {new Date(project.dueDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
