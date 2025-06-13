
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const LatestUpdates: React.FC = () => {
  const [expandedUpdate, setExpandedUpdate] = useState<number | null>(null);

  const updates = [
    {
      id: 1,
      title: 'Q4 Company All-Hands Meeting',
      date: '2024-06-10',
      author: 'Sarah Johnson',
      department: 'Leadership',
      priority: 'high',
      preview: 'Join us for the quarterly all-hands meeting where we\'ll discuss company performance, upcoming initiatives, and team achievements.',
      content: `
        Dear Team,
        
        We're excited to announce our Q4 All-Hands meeting scheduled for next week. This quarterly gathering will cover:
        
        • Company performance metrics and achievements
        • New product launches and roadmap updates  
        • Team recognition and celebrations
        • Q1 2025 strategic initiatives
        • Open Q&A session with leadership
        
        Please mark your calendars and prepare any questions you'd like to discuss.
        
        Meeting Details:
        - Date: June 20th, 2024
        - Time: 2:00 PM - 3:30 PM PST
        - Location: Main Conference Room & Virtual (Zoom link to follow)
        
        Looking forward to seeing everyone there!
      `,
      attachments: ['Q4-Agenda.pdf', 'Performance-Summary.xlsx'],
    },
    {
      id: 2,
      title: 'New Employee Onboarding Process',
      date: '2024-06-08',
      author: 'Mike Chen',
      department: 'HR',
      priority: 'medium',
      preview: 'We\'ve updated our onboarding process to include new training modules and a mentor assignment program.',
      content: `
        Hello everyone,
        
        We're pleased to announce significant improvements to our employee onboarding experience:
        
        NEW FEATURES:
        • Enhanced digital onboarding portal
        • Structured mentor assignment program
        • Interactive training modules
        • 30-60-90 day check-in system
        • Welcome kit with company swag
        
        These changes will help new hires integrate more effectively and feel welcomed from day one.
        
        For managers: Please review the updated manager's onboarding checklist in the HR portal.
        
        Questions? Contact the HR team at hr@company.com
      `,
      attachments: ['Onboarding-Guide.pdf'],
    },
    {
      id: 3,
      title: 'Security Policy Updates',
      date: '2024-06-05',
      author: 'Jennifer Adams',
      department: 'IT Security',
      priority: 'high',
      preview: 'Important changes to our security policies effective immediately. All employees must review and acknowledge.',
      content: `
        IMPORTANT SECURITY UPDATE
        
        Effective immediately, we're implementing enhanced security measures:
        
        MANDATORY CHANGES:
        • Two-factor authentication (2FA) required for all accounts
        • Password complexity requirements updated
        • VPN required for all remote access
        • Monthly security training modules
        • Device encryption mandatory
        
        ACTION REQUIRED:
        1. Enable 2FA on your company accounts by June 15th
        2. Update passwords to meet new requirements
        3. Install company VPN software
        4. Complete security acknowledgment form
        
        Non-compliance may result in account suspension.
        
        Support: security@company.com | ext. 2847
      `,
      attachments: ['Security-Policy-2024.pdf', '2FA-Setup-Guide.pdf'],
    },
    {
      id: 4,
      title: 'Office Renovation Updates',
      date: '2024-06-03',
      author: 'Alex Rodriguez',
      department: 'Facilities',
      priority: 'low',
      preview: 'Construction progress update and temporary workspace arrangements for the office renovation project.',
      content: `
        Office Renovation Progress Update
        
        Phase 1 of our office renovation is progressing well! Here's what's happening:
        
        COMPLETED:
        • New conference room setup on 2nd floor
        • Updated break room with modern appliances
        • Improved lighting in work areas
        
        IN PROGRESS:
        • Open workspace reconfiguration (estimated completion: June 25th)
        • New collaboration spaces
        • Upgraded IT infrastructure
        
        TEMPORARY ARRANGEMENTS:
        • Hot-desking available on 1st floor
        • Meeting rooms bookable via Outlook
        • Parking temporarily reduced (shuttle service available)
        
        Thank you for your patience during this improvement process!
      `,
      attachments: [],
    },
  ];

  const toggleExpand = (updateId: number) => {
    setExpandedUpdate(expandedUpdate === updateId ? null : updateId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Latest Updates</h1>
        <p className="text-gray-600">Stay informed with the latest company news and announcements.</p>
      </div>

      <div className="space-y-6">
        {updates.map((update) => (
          <Card key={update.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(update.priority)}`}>
                      {update.priority.toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500">
                      {update.department}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                    {update.title}
                  </CardTitle>
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <span>By {update.author}</span>
                    <span>{new Date(update.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{update.preview}</p>
              
              {expandedUpdate === update.id && (
                <div className="border-t pt-4 mt-4">
                  <div className="prose max-w-none">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                      {update.content}
                    </pre>
                  </div>
                  
                  {update.attachments.length > 0 && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Attachments:</h4>
                      <div className="space-y-1">
                        {update.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            <span className="cursor-pointer hover:underline">{attachment}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex justify-end mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleExpand(update.id)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {expandedUpdate === update.id ? 'Show Less' : 'Read More'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {updates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📰</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No updates available</h3>
          <p className="text-gray-600">Check back later for company news and announcements.</p>
        </div>
      )}
    </div>
  );
};

export default LatestUpdates;
