
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLatestUpdates } from '@/hooks/useLatestUpdates';
import { Clock } from 'lucide-react';
import GanttOverviewTile from './dashboard/GanttOverviewTile';
import KnowledgeGalleryTile from './dashboard/KnowledgeGalleryTile';
import ImageGalleryTile from './dashboard/ImageGalleryTile';
import TeamActivityTile from './dashboard/TeamActivityTile';
import QuickActionsTile from './dashboard/QuickActionsTile';

interface DashboardProps {
  onNavigate: (page: string, tab?: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { updates, loading } = useLatestUpdates();

  const quickLinksResources = [
    'Popular Resources',
    'Technical Documentation',
    'Team Directory',
    'Product Roadmap',
  ];

  const companyReports = [
    { title: 'Weekly Sales Report - June Week 2', date: '2024-06-14' },
    { title: 'Operations Summary - June Week 2', date: '2024-06-14' },
    { title: 'Weekly Sales Report - June Week 1', date: '2024-06-07' },
    { title: 'Operations Summary - June Week 1', date: '2024-06-07' },
  ];

  const worksInProgress = [
    { project: 'AeroMail Pro v2.0', progress: 75, status: 'On Track' },
    { project: 'Carbon Credit Platform', progress: 90, status: 'On Track' },
    { project: 'Enterprise Dashboard v3.0', progress: 25, status: 'Planning' },
  ];

  const roadmapMilestones = [
    { milestone: 'AeroMail Pro v2.0 Release', date: 'Aug 15, 2024', status: 'upcoming' },
    { milestone: 'Carbon Platform Launch', date: 'Jul 1, 2024', status: 'upcoming' },
    { milestone: 'Q3 Product Review', date: 'Sep 30, 2024', status: 'planned' },
  ];

  // Get the latest 3 updates for the dashboard preview
  const recentUpdates = updates.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pl-0 lg:pl-64">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        </div>

        {/* Main Grid Layout - 3 columns evenly distributed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
          {/* Left Column */}
          <ScrollArea className="space-y-6">
            <div className="space-y-6 pr-4">
              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onNavigate('latest-updates')}
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center justify-between">
                    Latest Updates
                    <span className="text-sm font-normal text-blue-600">View All →</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loading ? (
                    <div className="animate-pulse space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-16 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  ) : recentUpdates.length > 0 ? (
                    recentUpdates.map((update) => (
                      <div key={update.id} className="flex items-start space-x-3 p-2 rounded hover:bg-gray-50 transition-colors">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 line-clamp-2">
                            {update.title}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(update.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <p className="text-sm">No updates available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <GanttOverviewTile onNavigate={onNavigate} />
              
              <TeamActivityTile onNavigate={onNavigate} />

              <ImageGalleryTile onNavigate={onNavigate} />
            </div>
          </ScrollArea>

          {/* Center Column */}
          <ScrollArea className="space-y-6">
            <div className="space-y-6 pr-4">
              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onNavigate('company-reports')}
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center justify-between">
                    Company Reports
                    <span className="text-sm font-normal text-blue-600">View All →</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {companyReports.map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{report.title}</p>
                        <p className="text-xs text-gray-500">{report.date}</p>
                      </div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onNavigate('project-central', 'progress')}
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center justify-between">
                    Works In Progress Snapshot
                    <span className="text-sm font-normal text-blue-600">View →</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {worksInProgress.map((work, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{work.project}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${work.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">{work.progress}%</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 ml-3">{work.status}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <KnowledgeGalleryTile onNavigate={onNavigate} />
            </div>
          </ScrollArea>

          {/* Right Column */}
          <ScrollArea className="space-y-6">
            <div className="space-y-6 pr-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900">Quick Links to Popular Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {quickLinksResources.map((link, index) => (
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

              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onNavigate('project-central', 'roadmap')}
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center justify-between">
                    Roadmap
                    <span className="text-sm font-normal text-blue-600">View →</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {roadmapMilestones.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${item.status === 'upcoming' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.milestone}</p>
                          <p className="text-xs text-gray-500">{item.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <QuickActionsTile onNavigate={onNavigate} />
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
