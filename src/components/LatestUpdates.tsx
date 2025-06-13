import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Update {
  id: number;
  title: string;
  date: string;
  author: string;
  department: string;
  priority: 'high' | 'medium' | 'low';
  preview: string;
  content: string;
  attachments: string[];
}

interface LatestUpdatesProps {
  onManagingChange?: (isManaging: boolean) => void;
}

const LatestUpdates: React.FC<LatestUpdatesProps> = ({ onManagingChange }) => {
  const [expandedUpdate, setExpandedUpdate] = useState<number | null>(null);
  const [isManaging, setIsManaging] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<Update | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const [updates, setUpdates] = useState<Update[]>([
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
  ]);

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

  const handleCreateUpdate = () => {
    setEditingUpdate({
      id: Date.now(),
      title: '',
      date: new Date().toISOString().split('T')[0],
      author: '',
      department: '',
      priority: 'medium',
      preview: '',
      content: '',
      attachments: []
    });
    setIsDialogOpen(true);
  };

  const handleEditUpdate = (update: Update) => {
    setEditingUpdate({ ...update });
    setIsDialogOpen(true);
  };

  const handleSaveUpdate = () => {
    if (!editingUpdate) return;

    if (updates.find(u => u.id === editingUpdate.id)) {
      setUpdates(prev => prev.map(u => u.id === editingUpdate.id ? editingUpdate : u));
      toast({
        title: "Update saved",
        description: `${editingUpdate.title} has been updated successfully.`
      });
    } else {
      setUpdates(prev => [editingUpdate, ...prev]);
      toast({
        title: "Update created",
        description: `${editingUpdate.title} has been added to latest updates.`
      });
    }

    setEditingUpdate(null);
    setIsDialogOpen(false);
  };

  const handleDeleteUpdate = (updateId: number) => {
    const update = updates.find(u => u.id === updateId);
    setUpdates(prev => prev.filter(u => u.id !== updateId));
    toast({
      title: "Update deleted",
      description: `${update?.title} has been removed.`
    });
  };

  const departments = [
    'Leadership',
    'HR',
    'IT Security',
    'Facilities',
    'Engineering',
    'Sales & Marketing',
    'Finance',
    'Operations'
  ];

  // Listen for AI-created updates
  useEffect(() => {
    const handleAICreatedUpdate = (event: CustomEvent) => {
      const newUpdate = event.detail;
      setUpdates(prev => [newUpdate, ...prev]);
    };

    window.addEventListener('ai-created-update', handleAICreatedUpdate as EventListener);
    
    return () => {
      window.removeEventListener('ai-created-update', handleAICreatedUpdate as EventListener);
    };
  }, []);

  // Notify parent about manage mode changes
  useEffect(() => {
    onManagingChange?.(isManaging);
  }, [isManaging, onManagingChange]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Latest Updates</h1>
          <p className="text-gray-600">
            Stay informed with the latest company news and announcements.
            {isManaging && (
              <span className="block text-sm text-green-600 mt-1">
                💬 Manage mode active - You can ask the AI assistant to create updates for you!
              </span>
            )}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={isManaging ? "default" : "outline"}
            onClick={() => setIsManaging(!isManaging)}
          >
            {isManaging ? 'View Mode' : 'Manage'}
          </Button>
          {isManaging && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleCreateUpdate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Update
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingUpdate?.id && updates.find(u => u.id === editingUpdate.id) ? 'Edit Update' : 'Create New Update'}
                  </DialogTitle>
                </DialogHeader>
                {editingUpdate && (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Title *</label>
                        <Input
                          value={editingUpdate.title}
                          onChange={(e) => setEditingUpdate(prev => prev ? { ...prev, title: e.target.value } : null)}
                          placeholder="Update title..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Author *</label>
                        <Input
                          value={editingUpdate.author}
                          onChange={(e) => setEditingUpdate(prev => prev ? { ...prev, author: e.target.value } : null)}
                          placeholder="Your name..."
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Department</label>
                        <Select
                          value={editingUpdate.department}
                          onValueChange={(value) => setEditingUpdate(prev => prev ? { ...prev, department: value } : null)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select department..." />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map(dept => (
                              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Priority</label>
                        <Select
                          value={editingUpdate.priority}
                          onValueChange={(value: 'high' | 'medium' | 'low') => 
                            setEditingUpdate(prev => prev ? { ...prev, priority: value } : null)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Date</label>
                        <Input
                          type="date"
                          value={editingUpdate.date}
                          onChange={(e) => setEditingUpdate(prev => prev ? { ...prev, date: e.target.value } : null)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Preview *</label>
                      <Textarea
                        value={editingUpdate.preview}
                        onChange={(e) => setEditingUpdate(prev => prev ? { ...prev, preview: e.target.value } : null)}
                        placeholder="Brief preview of the update..."
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Content *</label>
                      <Textarea
                        value={editingUpdate.content}
                        onChange={(e) => setEditingUpdate(prev => prev ? { ...prev, content: e.target.value } : null)}
                        placeholder="Full update content..."
                        rows={6}
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveUpdate}>
                        {editingUpdate.id && updates.find(u => u.id === editingUpdate.id) ? 'Update' : 'Create'}
                      </Button>
                    </div>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {updates.map((update) => (
          <Card key={update.id} className="hover:shadow-lg transition-shadow relative">
            {isManaging && (
              <div className="absolute top-4 right-4 flex space-x-1 z-10">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditUpdate(update)}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDeleteUpdate(update.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
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
