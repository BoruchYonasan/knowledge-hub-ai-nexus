
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, FileText, Plus, Settings, Users, Handshake } from 'lucide-react';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import ArticleView from './ArticleView';

interface KnowledgeBaseProps {
  onNavigate?: (page: string) => void;
  isManaging?: boolean;
}

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ onNavigate, isManaging = false }) => {
  const { articles, loading } = useKnowledgeBase();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  const categoryStructure = {
    'technical': {
      label: 'Technical Documentation',
      icon: Settings,
      subcategories: {
        'product-specs': 'Product Specifications',
        'material-properties': 'Material Properties',
        'design-files': 'Design Files'
      }
    },
    'business': {
      label: 'Business Documentation',
      icon: Handshake,
      subcategories: {
        'patents-ip': 'Patents & IP',
        'contracts': 'Contracts & Agreements',
        'compliance': 'Compliance & Certifications'
      }
    },
    'processes': {
      label: 'Processes & Procedures',
      icon: FileText,
      subcategories: {
        'dev-guidelines': 'Development Guidelines',
        'testing-protocols': 'Testing Protocols',
        'vendor-management': 'Vendor Management'
      }
    }
  };

  const mockArticlesByCategory = {
    'product-specs': [
      { id: 'ps1', title: 'Carbon Fiber Composite Specifications', category: 'product-specs', author: 'Engineering Team', read_time: '8 min read', description: 'Detailed specifications for carbon fiber materials used in aerospace applications.' },
      { id: 'ps2', title: 'Aluminum Alloy Standards', category: 'product-specs', author: 'Materials Team', read_time: '6 min read', description: 'Standards and specifications for aluminum alloys in aircraft manufacturing.' }
    ],
    'material-properties': [
      { id: 'mp1', title: 'Thermal Properties Database', category: 'material-properties', author: 'Research Team', read_time: '12 min read', description: 'Comprehensive database of thermal properties for aerospace materials.' },
      { id: 'mp2', title: 'Stress Testing Results', category: 'material-properties', author: 'QA Team', read_time: '10 min read', description: 'Latest stress testing results for new composite materials.' }
    ],
    'design-files': [
      { id: 'df1', title: 'CAD Template Library', category: 'design-files', author: 'Design Team', read_time: '5 min read', description: 'Standard CAD templates for aerospace component design.' },
      { id: 'df2', title: 'Design Review Checklist', category: 'design-files', author: 'Engineering', read_time: '7 min read', description: 'Comprehensive checklist for design reviews and approvals.' }
    ],
    'patents-ip': [
      { id: 'pi1', title: 'Patent Portfolio Overview', category: 'patents-ip', author: 'Legal Team', read_time: '15 min read', description: 'Overview of company patent portfolio and IP strategy.' },
      { id: 'pi2', title: 'IP Protection Guidelines', category: 'patents-ip', author: 'Legal Team', read_time: '9 min read', description: 'Guidelines for protecting intellectual property during development.' }
    ],
    'contracts': [
      { id: 'c1', title: 'Supplier Contract Templates', category: 'contracts', author: 'Procurement', read_time: '11 min read', description: 'Standard templates for supplier and vendor contracts.' },
      { id: 'c2', title: 'Partnership Agreements', category: 'contracts', author: 'Business Dev', read_time: '13 min read', description: 'Framework for strategic partnership agreements.' }
    ],
    'compliance': [
      { id: 'comp1', title: 'FAA Certification Process', category: 'compliance', author: 'Compliance Team', read_time: '20 min read', description: 'Step-by-step guide to FAA certification requirements.' },
      { id: 'comp2', title: 'ISO 9001 Standards', category: 'compliance', author: 'Quality Team', read_time: '14 min read', description: 'Implementation guide for ISO 9001 quality standards.' }
    ],
    'dev-guidelines': [
      { id: 'dg1', title: 'Software Development Standards', category: 'dev-guidelines', author: 'Engineering', read_time: '16 min read', description: 'Coding standards and development best practices.' },
      { id: 'dg2', title: 'Code Review Process', category: 'dev-guidelines', author: 'Engineering', read_time: '8 min read', description: 'Guidelines for effective code reviews and peer assessment.' }
    ],
    'testing-protocols': [
      { id: 'tp1', title: 'Material Testing Procedures', category: 'testing-protocols', author: 'QA Team', read_time: '18 min read', description: 'Standardized procedures for material testing and validation.' },
      { id: 'tp2', title: 'Environmental Testing', category: 'testing-protocols', author: 'Testing Lab', read_time: '12 min read', description: 'Environmental testing protocols for aerospace components.' }
    ],
    'vendor-management': [
      { id: 'vm1', title: 'Vendor Qualification Process', category: 'vendor-management', author: 'Procurement', read_time: '10 min read', description: 'Process for qualifying and onboarding new vendors.' },
      { id: 'vm2', title: 'Supply Chain Risk Management', category: 'vendor-management', author: 'Operations', read_time: '14 min read', description: 'Strategies for managing supply chain risks and disruptions.' }
    ]
  };

  const handleAddArticle = () => {
    if (onNavigate) {
      onNavigate('content-manager');
    }
  };

  const handleArticleClick = (article: any) => {
    setSelectedArticle(article);
  };

  const handleBackToList = () => {
    setSelectedArticle(null);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (selectedArticle) {
    return <ArticleView article={selectedArticle} onBack={handleBackToList} />;
  }

  const renderCategoryContent = (categoryKey: string) => {
    const category = categoryStructure[categoryKey as keyof typeof categoryStructure];
    if (!category) return null;

    return (
      <div className="space-y-6">
        <Accordion type="multiple" className="w-full">
          {Object.entries(category.subcategories).map(([subKey, subLabel]) => {
            const articles = mockArticlesByCategory[subKey as keyof typeof mockArticlesByCategory] || [];
            return (
              <AccordionItem key={subKey} value={subKey}>
                <AccordionTrigger className="text-lg font-medium">
                  {subLabel} ({articles.length})
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {articles.map(article => (
                      <Card 
                        key={article.id} 
                        className="hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => handleArticleClick(article)}
                      >
                        <CardHeader>
                          <CardTitle className="text-base">{article.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {article.description}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>{article.read_time}</span>
                            <span>By {article.author}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="text-gray-600">Access technical documentation, business information, and company procedures</p>
        </div>
        {isManaging && (
          <Button className="flex items-center" onClick={handleAddArticle}>
            <Plus className="w-4 h-4 mr-2" />
            Add Article
          </Button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search knowledge base..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Categories</TabsTrigger>
          <TabsTrigger value="technical">
            <Settings className="w-4 h-4 mr-2" />
            Technical
          </TabsTrigger>
          <TabsTrigger value="business">
            <Handshake className="w-4 h-4 mr-2" />
            Business
          </TabsTrigger>
          <TabsTrigger value="processes">
            <FileText className="w-4 h-4 mr-2" />
            Processes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="space-y-6">
            {Object.entries(categoryStructure).map(([key, category]) => (
              <Card key={key}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <category.icon className="w-5 h-5 mr-2" />
                    {category.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderCategoryContent(key)}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {Object.entries(categoryStructure).map(([key, category]) => (
          <TabsContent key={key} value={key} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <category.icon className="w-5 h-5 mr-2" />
                  {category.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderCategoryContent(key)}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default KnowledgeBase;
