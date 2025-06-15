import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Users, MessageSquare, Phone, Mail, Plus, Vote, Calendar as CalendarIcon } from 'lucide-react';
import { useLatestUpdates } from '@/hooks/useLatestUpdates';
import MeetingPolls from './company-hub/MeetingPolls';
import TeamCalendar from './company-hub/TeamCalendar';

interface CompanyHubProps {
  isManaging?: boolean;
}

const CompanyHub: React.FC<CompanyHubProps> = ({ isManaging = false }) => {
  const { updates, loading } = useLatestUpdates();
  const [searchTerm, setSearchTerm] = useState('');

  const teamDirectory = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'VP of Engineering',
      department: 'Engineering',
      email: 'sarah.johnson@aeromail.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      status: 'available'
    },
    {
      id: 2,
      name: 'Mike Chen',
      role: 'Senior Developer',
      department: 'Engineering',
      email: 'mike.chen@aeromail.com',
      phone: '+1 (555) 234-5678',
      location: 'Austin, TX',
      status: 'busy'
    },
    {
      id: 3,
      name: 'Emily Watson',
      role: 'Product Manager',
      department: 'Product',
      email: 'emily.watson@aeromail.com',
      phone: '+1 (555) 345-6789',
      location: 'New York, NY',
      status: 'available'
    },
    {
      id: 4,
      name: 'David Kim',
      role: 'Design Lead',
      department: 'Design',
      email: 'david.kim@aeromail.com',
      phone: '+1 (555) 456-7890',
      location: 'Seattle, WA',
      status: 'away'
    }
  ];

  const meetingNotes = [
    {
      id: 1,
      title: 'Q2 Engineering Review',
      date: '2024-06-14',
      attendees: ['Sarah Johnson', 'Mike Chen', 'Emily Watson'],
      decisions: ['Approved new architecture proposal', 'Delayed feature X to Q3'],
      nextSteps: ['Update project timeline', 'Schedule client review']
    },
    {
      id: 2,
      title: 'Product Roadmap Planning',
      date: '2024-06-12',
      attendees: ['Emily Watson', 'David Kim', 'Alex Rodriguez'],
      decisions: ['Prioritize mobile experience', 'Increase QA resources'],
      nextSteps: ['Create detailed mockups', 'Hire additional QA engineer']
    },
    {
      id: 3,
      title: 'Weekly Team Standup',
      date: '2024-06-10',
      attendees: ['All Engineering Team'],
      decisions: ['Switch to new deployment process', 'Implement code review guidelines'],
      nextSteps: ['Training session next week', 'Update documentation']
    }
  ];

  const vendorContacts = [
    {
      id: 1,
      company: 'CloudTech Solutions',
      contact: 'John Smith',
      role: 'Account Manager',
      service: 'Cloud Infrastructure',
      email: 'john.smith@cloudtech.com',
      phone: '+1 (555) 789-0123',
      status: 'active'
    },
    {
      id: 2,
      company: 'SecureData Inc',
      contact: 'Lisa Brown',
      role: 'Security Consultant',
      service: 'Data Security',
      email: 'lisa.brown@securedata.com',
      phone: '+1 (555) 890-1234',
      status: 'active'
    },
    {
      id: 3,
      company: 'DevTools Pro',
      contact: 'Robert Wilson',
      role: 'Technical Support',
      service: 'Development Tools',
      email: 'robert.wilson@devtools.com',
      phone: '+1 (555) 901-2345',
      status: 'pending'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'busy':
        return 'bg-red-500';
      case 'away':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Company Hub</h1>
          <p className="text-gray-600">Team directory, communications, calendar, and vendor contacts</p>
        </div>
        {isManaging && (
          <Button className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search team, meetings, polls, calendar, or vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="team" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="team">
            <Users className="w-4 h-4 mr-2" />
            Team Directory
          </TabsTrigger>
          <TabsTrigger value="polls">
            <Vote className="w-4 h-4 mr-2" />
            Meeting Polls
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <CalendarIcon className="w-4 h-4 mr-2" />
            Team Calendar
          </TabsTrigger>
          <TabsTrigger value="meetings">
            <MessageSquare className="w-4 h-4 mr-2" />
            Meeting Notes
          </TabsTrigger>
          <TabsTrigger value="communications">
            <Mail className="w-4 h-4 mr-2" />
            Communications
          </TabsTrigger>
          <TabsTrigger value="vendors">
            <Phone className="w-4 h-4 mr-2" />
            Vendor Contacts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Directory & Roles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamDirectory.map((member) => (
                  <Card key={member.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900">{member.name}</h3>
                          <p className="text-sm text-gray-600">{member.role}</p>
                          <Badge variant="outline" className="text-xs mt-1">
                            {member.department}
                          </Badge>
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center text-xs text-gray-500">
                              <Mail className="w-3 h-3 mr-1" />
                              {member.email}
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <Phone className="w-3 h-3 mr-1" />
                              {member.phone}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="polls" className="space-y-4">
          <MeetingPolls />
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <TeamCalendar />
        </TabsContent>

        <TabsContent value="meetings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Meeting Notes & Decisions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {meetingNotes.map((meeting) => (
                  <Card key={meeting.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-lg">{meeting.title}</h3>
                        <span className="text-sm text-gray-500">{new Date(meeting.date).toLocaleDateString()}</span>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-medium text-sm text-gray-700 mb-1">Attendees</h4>
                          <div className="flex flex-wrap gap-1">
                            {meeting.attendees.map((attendee, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {attendee}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-gray-700 mb-1">Key Decisions</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {meeting.decisions.map((decision, index) => (
                              <li key={index} className="flex items-start">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                {decision}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-gray-700 mb-1">Next Steps</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {meeting.nextSteps.map((step, index) => (
                              <li key={index} className="flex items-start">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="communications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Internal Communications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-20 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                ) : (
                  updates.map((update) => (
                    <div key={update.id} className="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 rounded-r">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{update.title}</h3>
                        <Badge variant={update.priority === 'high' ? 'destructive' : 'secondary'}>
                          {update.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{update.preview}</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>By {update.author}</span>
                        <span>{new Date(update.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vendor/Partner Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vendorContacts.map((vendor) => (
                  <Card key={vendor.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{vendor.company}</h3>
                          <p className="text-sm text-gray-600">{vendor.service}</p>
                        </div>
                        <Badge variant={vendor.status === 'active' ? 'default' : 'secondary'}>
                          {vendor.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="font-medium text-sm">{vendor.contact}</p>
                          <p className="text-xs text-gray-500">{vendor.role}</p>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center text-xs text-gray-600">
                            <Mail className="w-3 h-3 mr-1" />
                            {vendor.email}
                          </div>
                          <div className="flex items-center text-xs text-gray-600">
                            <Phone className="w-3 h-3 mr-1" />
                            {vendor.phone}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompanyHub;
