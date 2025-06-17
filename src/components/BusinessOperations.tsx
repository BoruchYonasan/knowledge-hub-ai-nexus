import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { DollarSign, TrendingUp, Users, Leaf, Plus } from 'lucide-react';

interface BusinessOperationsProps {
  onNavigate?: (page: string, tab?: string) => void;
  isManaging?: boolean;
}

const BusinessOperations: React.FC<BusinessOperationsProps> = ({ onNavigate, isManaging = false }) => {
  const [activeTab, setActiveTab] = useState('financial');

  const financialOverview = [
    {
      metric: 'Monthly Revenue',
      value: '$2.4M',
      change: '+12%',
      changeType: 'positive',
      period: 'vs last month'
    },
    {
      metric: 'Operating Expenses',
      value: '$1.8M',
      change: '-5%',
      changeType: 'positive',
      period: 'vs last month'
    },
    {
      metric: 'Profit Margin',
      value: '25%',
      change: '+3%',
      changeType: 'positive',
      period: 'vs last quarter'
    },
    {
      metric: 'Cash Flow',
      value: '$600K',
      change: '+18%',
      changeType: 'positive',
      period: 'vs last month'
    }
  ];

  const marketResearch = [
    {
      id: 1,
      title: 'Aerospace Market Trends Q2 2024',
      category: 'Industry Analysis',
      date: '2024-06-10',
      status: 'completed',
      keyFindings: [
        'Market growth of 8.5% expected',
        'Increased demand for sustainable solutions',
        'AI integration becoming standard'
      ],
      researcher: 'Market Research Team'
    },
    {
      id: 2,
      title: 'Competitor Analysis Report',
      category: 'Competitive Intelligence',
      date: '2024-06-05',
      status: 'completed',
      keyFindings: [
        'Main competitor launched new product',
        'Pricing pressures in mid-market',
        'Opportunity in enterprise segment'
      ],
      researcher: 'Business Strategy Team'
    },
    {
      id: 3,
      title: 'Customer Satisfaction Survey',
      category: 'Customer Research',
      date: '2024-05-28',
      status: 'in-progress',
      keyFindings: [
        'Overall satisfaction: 4.2/5',
        'Product quality highly rated',
        'Support response time concerns'
      ],
      researcher: 'Customer Success Team'
    }
  ];

  const customerPipeline = [
    {
      id: 1,
      company: 'AeroTech Industries',
      contact: 'John Smith',
      value: '$450K',
      stage: 'Proposal',
      probability: 75,
      expectedClose: '2024-07-15',
      lastActivity: '2024-06-14'
    },
    {
      id: 2,
      company: 'Global Aviation Corp',
      contact: 'Sarah Johnson',
      value: '$680K',
      stage: 'Negotiation',
      probability: 85,
      expectedClose: '2024-06-30',
      lastActivity: '2024-06-13'
    },
    {
      id: 3,
      company: 'SkyLine Manufacturing',
      contact: 'Mike Chen',
      value: '$320K',
      stage: 'Discovery',
      probability: 40,
      expectedClose: '2024-08-20',
      lastActivity: '2024-06-12'
    },
    {
      id: 4,
      company: 'Aerospace Dynamics',
      contact: 'Emily Watson',
      value: '$890K',
      stage: 'Closed Won',
      probability: 100,
      expectedClose: '2024-06-10',
      lastActivity: '2024-06-10'
    }
  ];

  const carbonCredits = [
    {
      id: 1,
      project: 'Reforestation Initiative Brazil',
      credits: 12500,
      price: '$45.00',
      totalValue: '$562,500',
      status: 'active',
      verification: 'Gold Standard',
      purchaseDate: '2024-05-15'
    },
    {
      id: 2,
      project: 'Wind Farm Development Texas',
      credits: 8750,
      price: '$52.00',
      totalValue: '$455,000',
      status: 'active',
      verification: 'VCS',
      purchaseDate: '2024-04-20'
    },
    {
      id: 3,
      project: 'Solar Energy Project California',
      credits: 6200,
      price: '$48.50',
      totalValue: '$300,700',
      status: 'pending',
      verification: 'ACR',
      purchaseDate: '2024-06-01'
    }
  ];

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Discovery':
        return 'secondary';
      case 'Proposal':
        return 'outline';
      case 'Negotiation':
        return 'default';
      case 'Closed Won':
        return 'default';
      case 'Closed Lost':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'completed':
        return 'default';
      case 'in-progress':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Fixed Header Layout */}
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Business Operations</h1>
          <p className="text-gray-600">Financial overview, market research, customer pipeline, and carbon credits</p>
        </div>
        
        {isManaging && (
          <div className="flex justify-center">
            <Button className="flex items-center">
              <Plus className="w-4 h-4 mr-2" />
              Add Data
            </Button>
          </div>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="financial">
            <DollarSign className="w-4 h-4 mr-2" />
            Financial Overview
          </TabsTrigger>
          <TabsTrigger value="research">
            <TrendingUp className="w-4 h-4 mr-2" />
            Market Research
          </TabsTrigger>
          <TabsTrigger value="pipeline">
            <Users className="w-4 h-4 mr-2" />
            Customer Pipeline
          </TabsTrigger>
          <TabsTrigger value="carbon">
            <Leaf className="w-4 h-4 mr-2" />
            Carbon Credits
          </TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {financialOverview.map((item, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{item.metric}</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{item.value}</div>
                  <p className={`text-xs ${item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    {item.change} {item.period}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900">Product Sales</h3>
                    <p className="text-2xl font-bold text-blue-700">$1.6M</p>
                    <p className="text-sm text-blue-600">67% of total revenue</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-900">Service Revenue</h3>
                    <p className="text-2xl font-bold text-green-700">$600K</p>
                    <p className="text-sm text-green-600">25% of total revenue</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-900">Licensing</h3>
                    <p className="text-2xl font-bold text-purple-700">$200K</p>
                    <p className="text-sm text-purple-600">8% of total revenue</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="research" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Market Research</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {marketResearch.map((research) => (
                  <Card key={research.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{research.title}</h3>
                          <p className="text-sm text-gray-600">{research.category} • {research.researcher}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={getStatusColor(research.status)}>{research.status}</Badge>
                          <p className="text-sm text-gray-500 mt-1">{new Date(research.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Key Findings</h4>
                        <ul className="space-y-1">
                          {research.keyFindings.map((finding, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                              {finding}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customerPipeline.map((opportunity) => (
                  <Card key={opportunity.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{opportunity.company}</h3>
                          <p className="text-sm text-gray-600">Contact: {opportunity.contact}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">{opportunity.value}</p>
                          <Badge variant={getStageColor(opportunity.stage)}>{opportunity.stage}</Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Probability</p>
                          <div className="flex items-center space-x-2">
                            <Progress value={opportunity.probability} className="flex-1" />
                            <span className="text-sm font-medium">{opportunity.probability}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Expected Close</p>
                          <p className="text-sm">{new Date(opportunity.expectedClose).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Last Activity</p>
                          <p className="text-sm">{new Date(opportunity.lastActivity).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="carbon" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Carbon Credit Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-900">Total Credits Owned</h3>
                  <p className="text-2xl font-bold text-green-700">27,450</p>
                  <p className="text-sm text-green-600">Across 3 projects</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900">Total Investment</h3>
                  <p className="text-2xl font-bold text-blue-700">$1.32M</p>
                  <p className="text-sm text-blue-600">Average: $48.18/credit</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-purple-900">Carbon Offset</h3>
                  <p className="text-2xl font-bold text-purple-700">27,450</p>
                  <p className="text-sm text-purple-600">Tons CO2 equivalent</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {carbonCredits.map((credit) => (
                  <Card key={credit.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{credit.project}</h3>
                          <p className="text-sm text-gray-600">Verification: {credit.verification}</p>
                        </div>
                        <Badge variant={getStatusColor(credit.status)}>{credit.status}</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Credits</p>
                          <p className="font-semibold">{credit.credits.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Price per Credit</p>
                          <p className="font-semibold">{credit.price}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Total Value</p>
                          <p className="font-semibold text-green-600">{credit.totalValue}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Purchase Date</p>
                          <p className="text-sm">{new Date(credit.purchaseDate).toLocaleDateString()}</p>
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

export default BusinessOperations;
