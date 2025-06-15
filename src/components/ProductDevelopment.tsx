
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Calendar, Target, Beaker, Settings, Plus } from 'lucide-react';

interface ProductDevelopmentProps {
  isManaging?: boolean;
}

const ProductDevelopment: React.FC<ProductDevelopmentProps> = ({ isManaging = false }) => {
  const [activeTab, setActiveTab] = useState('roadmap');

  const productRoadmap = [
    {
      id: 1,
      product: 'AeroMail Pro',
      version: 'v2.0',
      phase: 'Development',
      completion: 75,
      startDate: '2024-03-01',
      targetDate: '2024-08-15',
      features: ['Advanced Analytics', 'AI Integration', 'Mobile App'],
      owner: 'Product Team A'
    },
    {
      id: 2,
      product: 'Carbon Credit Platform',
      version: 'v1.5',
      phase: 'Testing',
      completion: 90,
      startDate: '2024-01-15',
      targetDate: '2024-07-01',
      features: ['Blockchain Integration', 'Real-time Tracking', 'Compliance Reports'],
      owner: 'Product Team B'
    },
    {
      id: 3,
      product: 'Enterprise Dashboard',
      version: 'v3.0',
      phase: 'Planning',
      completion: 25,
      startDate: '2024-05-01',
      targetDate: '2024-12-01',
      features: ['Custom Widgets', 'Multi-tenant Support', 'Advanced Security'],
      owner: 'Product Team C'
    }
  ];

  const rdDocumentation = [
    {
      id: 1,
      title: 'AI Algorithm Research',
      category: 'Machine Learning',
      status: 'active',
      lastUpdated: '2024-06-14',
      researcher: 'Dr. Sarah Chen',
      description: 'Research on advanced ML algorithms for predictive analytics'
    },
    {
      id: 2,
      title: 'Carbon Capture Technology',
      category: 'Environmental',
      status: 'review',
      lastUpdated: '2024-06-12',
      researcher: 'Dr. Mike Johnson',
      description: 'Novel approaches to carbon capture and storage systems'
    },
    {
      id: 3,
      title: 'Blockchain Optimization',
      category: 'Technology',
      status: 'completed',
      lastUpdated: '2024-06-10',
      researcher: 'Alex Rodriguez',
      description: 'Performance optimization for blockchain transaction processing'
    }
  ];

  const testingResults = [
    {
      id: 1,
      testName: 'Performance Load Testing',
      product: 'AeroMail Pro',
      date: '2024-06-13',
      status: 'passed',
      score: 95,
      details: 'System handled 10k concurrent users successfully'
    },
    {
      id: 2,
      testName: 'Security Penetration Test',
      product: 'Carbon Credit Platform',
      date: '2024-06-11',
      status: 'passed',
      score: 88,
      details: 'No critical vulnerabilities found, minor issues addressed'
    },
    {
      id: 3,
      testName: 'User Experience Testing',
      product: 'Enterprise Dashboard',
      date: '2024-06-09',
      status: 'failed',
      score: 72,
      details: 'UI improvements needed for mobile responsiveness'
    },
    {
      id: 4,
      testName: 'API Integration Testing',
      product: 'AeroMail Pro',
      date: '2024-06-08',
      status: 'passed',
      score: 92,
      details: 'All third-party integrations working as expected'
    }
  ];

  const prototypes = [
    {
      id: 1,
      name: 'Smart Analytics Widget',
      product: 'AeroMail Pro',
      version: 'v0.3',
      status: 'testing',
      completion: 80,
      lastUpdate: '2024-06-14',
      team: 'Frontend Team',
      description: 'Interactive analytics widget with real-time data visualization'
    },
    {
      id: 2,
      name: 'Carbon Credit Marketplace',
      product: 'Carbon Credit Platform',
      version: 'v0.5',
      status: 'development',
      completion: 60,
      lastUpdate: '2024-06-13',
      team: 'Blockchain Team',
      description: 'Decentralized marketplace for carbon credit trading'
    },
    {
      id: 3,
      name: 'Mobile Authentication',
      product: 'Enterprise Dashboard',
      version: 'v0.2',
      status: 'review',
      completion: 95,
      lastUpdate: '2024-06-12',
      team: 'Security Team',
      description: 'Biometric authentication for mobile applications'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'default';
      case 'failed':
        return 'destructive';
      case 'active':
      case 'development':
        return 'secondary';
      case 'testing':
        return 'outline';
      case 'completed':
      case 'review':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Development':
        return 'bg-blue-500';
      case 'Testing':
        return 'bg-yellow-500';
      case 'Planning':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Development</h1>
          <p className="text-gray-600">Track product roadmaps, R&D, testing results, and prototypes</p>
        </div>
        {isManaging && (
          <Button className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="roadmap">
            <Target className="w-4 h-4 mr-2" />
            Product Roadmap
          </TabsTrigger>
          <TabsTrigger value="research">
            <Beaker className="w-4 h-4 mr-2" />
            R&D Documentation
          </TabsTrigger>
          <TabsTrigger value="testing">
            <Settings className="w-4 h-4 mr-2" />
            Testing Results
          </TabsTrigger>
          <TabsTrigger value="prototypes">
            <Calendar className="w-4 h-4 mr-2" />
            Prototype Status
          </TabsTrigger>
        </TabsList>

        <TabsContent value="roadmap" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Roadmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {productRoadmap.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{item.product}</h3>
                          <p className="text-gray-600">{item.version} • Owned by {item.owner}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${getPhaseColor(item.phase)}`}></div>
                          <Badge variant="outline">{item.phase}</Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Progress</p>
                          <div className="flex items-center space-x-2">
                            <Progress value={item.completion} className="flex-1" />
                            <span className="text-sm font-medium">{item.completion}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Timeline</p>
                          <p className="text-sm">
                            {new Date(item.startDate).toLocaleDateString()} - {new Date(item.targetDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-2">Key Features</p>
                        <div className="flex flex-wrap gap-2">
                          {item.features.map((feature, index) => (
                            <Badge key={index} variant="secondary">{feature}</Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="research" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>R&D Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rdDocumentation.map((doc) => (
                  <Card key={doc.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-gray-900">{doc.title}</h3>
                        <Badge variant={getStatusColor(doc.status)}>{doc.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{doc.description}</p>
                      <div className="space-y-1 text-xs text-gray-500">
                        <p><strong>Category:</strong> {doc.category}</p>
                        <p><strong>Researcher:</strong> {doc.researcher}</p>
                        <p><strong>Last Updated:</strong> {new Date(doc.lastUpdated).toLocaleDateString()}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Testing Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testingResults.map((test) => (
                  <Card key={test.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{test.testName}</h3>
                          <p className="text-sm text-gray-600">{test.product}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={getStatusColor(test.status)}>{test.status}</Badge>
                          <p className="text-sm text-gray-500 mt-1">{new Date(test.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 mr-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Score</span>
                            <span>{test.score}/100</span>
                          </div>
                          <Progress value={test.score} className="mb-2" />
                          <p className="text-sm text-gray-600">{test.details}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="prototypes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Prototype Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prototypes.map((prototype) => (
                  <Card key={prototype.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{prototype.name}</h3>
                          <p className="text-sm text-gray-600">{prototype.product} • {prototype.version}</p>
                        </div>
                        <Badge variant={getStatusColor(prototype.status)}>{prototype.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{prototype.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Completion</span>
                          <span>{prototype.completion}%</span>
                        </div>
                        <Progress value={prototype.completion} />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Team: {prototype.team}</span>
                          <span>Updated: {new Date(prototype.lastUpdate).toLocaleDateString()}</span>
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

export default ProductDevelopment;
