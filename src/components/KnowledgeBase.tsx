import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, FileText, Plus, Settings, Users, Handshake, FlaskConical, Leaf, Megaphone, Shield } from 'lucide-react';
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
    },
    'research-development': {
      label: 'Research & Development',
      icon: FlaskConical,
      subcategories: {
        'materials-research': 'Materials Research',
        'competitor-analysis': 'Competitor Analysis',
        'patent-search': 'Patent Search Reports',
        'tech-feasibility': 'Technology Feasibility Studies'
      }
    },
    'sustainability-compliance': {
      label: 'Sustainability & Compliance',
      icon: Leaf,
      subcategories: {
        'environmental-impact': 'Environmental Impact Assessments',
        'carbon-credit': 'Carbon Credit Methodology',
        'composting-protocols': 'Composting Protocols',
        'food-grade-cert': 'Food-Grade Certification Requirements',
        'regulatory-compliance': 'Regulatory Compliance'
      }
    },
    'marketing-brand': {
      label: 'Marketing & Brand',
      icon: Megaphone,
      subcategories: {
        'brand-guidelines': 'Brand Guidelines',
        'product-photography': 'Product Photography/Renders',
        'marketing-materials': 'Marketing Materials',
        'customer-case-studies': 'Customer Case Studies',
        'value-proposition': 'Value Proposition Documents'
      }
    },
    'quality-testing': {
      label: 'Quality & Testing',
      icon: Shield,
      subcategories: {
        'testing-standards': 'Testing Standards & Protocols',
        'quality-control': 'Quality Control Procedures',
        'third-party-cert': 'Third-Party Certification Results',
        'durability-testing': 'Durability Testing Data',
        'temperature-control': 'Temperature Control Validation'
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
    ],
    'materials-research': [
      { id: 'mr1', title: 'Mycelium Packaging Performance Study', category: 'materials-research', author: 'R&D Team', read_time: '22 min read', description: 'Comprehensive analysis of mycelium-based packaging materials performance and biodegradability.' },
      { id: 'mr2', title: 'Aerogel Thermal Insulation Properties', category: 'materials-research', author: 'Materials Lab', read_time: '18 min read', description: 'Research findings on aerogel insulation properties for sustainable packaging applications.' },
      { id: 'mr3', title: 'Algae-Based TPU Biodegradability Analysis', category: 'materials-research', author: 'Sustainability Team', read_time: '16 min read', description: 'Laboratory results on algae-derived TPU decomposition rates and environmental impact.' }
    ],
    'competitor-analysis': [
      { id: 'ca1', title: 'Market Landscape: Sustainable Packaging Solutions', category: 'competitor-analysis', author: 'Market Research', read_time: '25 min read', description: 'Comprehensive overview of competitors in the sustainable packaging market.' },
      { id: 'ca2', title: 'Competitor Feature Matrix', category: 'competitor-analysis', author: 'Product Strategy', read_time: '12 min read', description: 'Feature comparison matrix of major sustainable packaging competitors.' }
    ],
    'patent-search': [
      { id: 'ps1', title: 'Biodegradable Material Patents Review', category: 'patent-search', author: 'IP Research', read_time: '20 min read', description: 'Analysis of existing patents in biodegradable packaging materials.' },
      { id: 'ps2', title: 'Temperature Control Patent Landscape', category: 'patent-search', author: 'Legal Team', read_time: '15 min read', description: 'Patent search results for temperature-controlled packaging solutions.' }
    ],
    'tech-feasibility': [
      { id: 'tf1', title: 'Scalable Manufacturing Feasibility Study', category: 'tech-feasibility', author: 'Engineering', read_time: '30 min read', description: 'Technical feasibility analysis for scaling production of sustainable packaging.' },
      { id: 'tf2', title: 'Cost-Benefit Analysis: New Materials', category: 'tech-feasibility', author: 'Operations', read_time: '18 min read', description: 'Economic feasibility assessment of implementing new sustainable materials.' }
    ],
    'environmental-impact': [
      { id: 'ei1', title: 'LCA Report: Cradle-to-Grave Analysis', category: 'environmental-impact', author: 'Sustainability Team', read_time: '35 min read', description: 'Complete lifecycle assessment of our packaging from production to disposal.' },
      { id: 'ei2', title: 'Carbon Footprint Reduction Strategies', category: 'environmental-impact', author: 'Environmental Team', read_time: '20 min read', description: 'Strategic approaches to minimize carbon footprint across operations.' }
    ],
    'carbon-credit': [
      { id: 'cc1', title: 'Carbon Credit Certification Methodology', category: 'carbon-credit', author: 'Compliance Team', read_time: '28 min read', description: 'Step-by-step guide to carbon credit certification and verification process.' },
      { id: 'cc2', title: 'Offset Program Implementation', category: 'carbon-credit', author: 'Sustainability', read_time: '15 min read', description: 'Framework for implementing carbon offset programs.' }
    ],
    'composting-protocols': [
      { id: 'cp1', title: 'Industrial Composting Standards', category: 'composting-protocols', author: 'Quality Team', read_time: '22 min read', description: 'Protocols for industrial composting compatibility testing.' },
      { id: 'cp2', title: 'Home Composting Validation Tests', category: 'composting-protocols', author: 'Testing Lab', read_time: '18 min read', description: 'Home composting effectiveness and timeline validation studies.' }
    ],
    'food-grade-cert': [
      { id: 'fgc1', title: 'FDA Food Contact Certification Guide', category: 'food-grade-cert', author: 'Regulatory Affairs', read_time: '25 min read', description: 'Complete guide to FDA food contact material certification requirements.' },
      { id: 'fgc2', title: 'EU Food Safety Compliance', category: 'food-grade-cert', author: 'Compliance Team', read_time: '20 min read', description: 'European Union food safety regulations and compliance procedures.' }
    ],
    'regulatory-compliance': [
      { id: 'rc1', title: 'International Shipping Regulations', category: 'regulatory-compliance', author: 'Logistics Team', read_time: '30 min read', description: 'Comprehensive guide to international shipping regulations for sustainable packaging.' },
      { id: 'rc2', title: 'PFAS Regulations and Impact', category: 'regulatory-compliance', author: 'Legal Team', read_time: '16 min read', description: 'Analysis of PFAS regulations and their impact on packaging materials.' }
    ],
    'brand-guidelines': [
      { id: 'bg1', title: 'Logo Usage and Brand Identity Standards', category: 'brand-guidelines', author: 'Brand Team', read_time: '12 min read', description: 'Official brand guidelines including logo usage, colors, and typography.' },
      { id: 'bg2', title: 'Color Palette and Typography Guidelines', category: 'brand-guidelines', author: 'Design Team', read_time: '8 min read', description: 'Detailed specifications for brand colors, fonts, and visual elements.' }
    ],
    'product-photography': [
      { id: 'pp1', title: 'Product Photography Style Guide', category: 'product-photography', author: 'Marketing Team', read_time: '14 min read', description: 'Guidelines for consistent product photography and visual representation.' },
      { id: 'pp2', title: '3D Render Standards and Templates', category: 'product-photography', author: 'Design Team', read_time: '10 min read', description: 'Standards and templates for 3D product renders and visualization.' }
    ],
    'marketing-materials': [
      { id: 'mm1', title: 'Sales Presentation Templates', category: 'marketing-materials', author: 'Sales Team', read_time: '15 min read', description: 'Standardized presentation templates for sales and marketing activities.' },
      { id: 'mm2', title: 'Trade Show Materials Library', category: 'marketing-materials', author: 'Events Team', read_time: '12 min read', description: 'Collection of trade show materials, banners, and promotional content.' }
    ],
    'customer-case-studies': [
      { id: 'ccs1', title: 'Restaurant Chain Success Story', category: 'customer-case-studies', author: 'Customer Success', read_time: '18 min read', description: 'Case study of sustainable packaging implementation in major restaurant chain.' },
      { id: 'ccs2', title: 'E-commerce Platform Integration', category: 'customer-case-studies', author: 'Business Dev', read_time: '16 min read', description: 'Success story of packaging solution integration with e-commerce platform.' }
    ],
    'value-proposition': [
      { id: 'vp1', title: 'Sustainability Value Proposition Framework', category: 'value-proposition', author: 'Strategy Team', read_time: '20 min read', description: 'Framework for communicating sustainability benefits to different customer segments.' },
      { id: 'vp2', title: 'Cost Savings Calculator Methodology', category: 'value-proposition', author: 'Finance Team', read_time: '14 min read', description: 'Methodology for calculating customer cost savings from sustainable packaging.' }
    ],
    'testing-standards': [
      { id: 'ts1', title: '300+ Cycle Durability Testing Protocol', category: 'testing-standards', author: 'Quality Lab', read_time: '25 min read', description: 'Comprehensive protocol for 300+ cycle durability testing of reusable packaging.' },
      { id: 'ts2', title: 'ASTM Standards Compliance Checklist', category: 'testing-standards', author: 'Compliance Team', read_time: '18 min read', description: 'Checklist for ensuring compliance with relevant ASTM testing standards.' }
    ],
    'quality-control': [
      { id: 'qc1', title: 'Manufacturing Quality Control Procedures', category: 'quality-control', author: 'Production Team', read_time: '22 min read', description: 'Step-by-step quality control procedures for manufacturing processes.' },
      { id: 'qc2', title: 'Incoming Material Inspection Protocol', category: 'quality-control', author: 'QA Team', read_time: '16 min read', description: 'Protocol for inspecting and qualifying incoming raw materials.' }
    ],
    'third-party-cert': [
      { id: 'tpc1', title: 'BPI Certification Results', category: 'third-party-cert', author: 'Certification Team', read_time: '20 min read', description: 'Biodegradable Products Institute certification test results and documentation.' },
      { id: 'tpc2', title: 'USDA BioPreferred Certification', category: 'third-party-cert', author: 'Regulatory Affairs', read_time: '15 min read', description: 'USDA BioPreferred program certification process and results.' }
    ],
    'durability-testing': [
      { id: 'dt1', title: 'Stress Testing Data Analysis', category: 'durability-testing', author: 'Testing Lab', read_time: '24 min read', description: 'Comprehensive analysis of stress testing data for packaging durability.' },
      { id: 'dt2', title: 'Impact Resistance Test Results', category: 'durability-testing', author: 'Quality Team', read_time: '18 min read', description: 'Results from impact resistance testing across different temperature ranges.' }
    ],
    'temperature-control': [
      { id: 'tc1', title: 'Cold Chain Validation Study', category: 'temperature-control', author: 'Logistics Team', read_time: '28 min read', description: 'Validation study of temperature control performance in cold chain applications.' },
      { id: 'tc2', title: 'Thermal Performance Benchmarking', category: 'temperature-control', author: 'R&D Team', read_time: '22 min read', description: 'Benchmarking study comparing thermal performance against industry standards.' }
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
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-8 min-w-fit">
            <TabsTrigger value="all" className="whitespace-nowrap">All Categories</TabsTrigger>
            <TabsTrigger value="technical" className="whitespace-nowrap">
              <Settings className="w-4 h-4 mr-2" />
              Technical
            </TabsTrigger>
            <TabsTrigger value="business" className="whitespace-nowrap">
              <Handshake className="w-4 h-4 mr-2" />
              Business
            </TabsTrigger>
            <TabsTrigger value="processes" className="whitespace-nowrap">
              <FileText className="w-4 h-4 mr-2" />
              Processes
            </TabsTrigger>
            <TabsTrigger value="research-development" className="whitespace-nowrap">
              <FlaskConical className="w-4 h-4 mr-2" />
              R&D
            </TabsTrigger>
            <TabsTrigger value="sustainability-compliance" className="whitespace-nowrap">
              <Leaf className="w-4 h-4 mr-2" />
              Sustainability
            </TabsTrigger>
            <TabsTrigger value="marketing-brand" className="whitespace-nowrap">
              <Megaphone className="w-4 h-4 mr-2" />
              Marketing
            </TabsTrigger>
            <TabsTrigger value="quality-testing" className="whitespace-nowrap">
              <Shield className="w-4 h-4 mr-2" />
              Quality
            </TabsTrigger>
          </TabsList>
        </div>

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
