
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, BookOpen, FileText, Users, DollarSign, Settings, Plus } from 'lucide-react';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import ArticleView from './ArticleView';

interface KnowledgeBaseProps {
  onNavigate?: (page: string) => void;
  onManagingChange?: (isManaging: boolean) => void;
}

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ onNavigate, onManagingChange }) => {
  const { articles, loading } = useKnowledgeBase();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isManaging, setIsManaging] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  React.useEffect(() => {
    onManagingChange?.(isManaging);
  }, [isManaging, onManagingChange]);

  const categories = [
    { id: 'all', label: 'All Categories', icon: BookOpen },
    { id: 'hr', label: 'Human Resources', icon: Users },
    { id: 'engineering', label: 'Engineering', icon: Settings },
    { id: 'sales', label: 'Sales & Marketing', icon: DollarSign },
    { id: 'finance', label: 'Finance', icon: DollarSign },
    { id: 'operations', label: 'Operations', icon: Settings }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

  // Show article view if an article is selected
  if (selectedArticle) {
    return <ArticleView article={selectedArticle} onBack={handleBackToList} />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="text-gray-600">Access company documentation, guides, and resources</p>
        </div>
        <div className="flex space-x-2">
          <Button className="flex items-center" onClick={handleAddArticle}>
            <Plus className="w-4 h-4 mr-2" />
            Add Article
          </Button>
          <Button
            variant={isManaging ? 'destructive' : 'default'}
            onClick={() => setIsManaging(!isManaging)}
          >
            {isManaging ? 'Exit Manage Mode' : 'Manage Mode'}
          </Button>
        </div>
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
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <TabsTrigger key={category.id} value={category.id} className="flex items-center">
                <Icon className="w-4 h-4 mr-1 hidden sm:block" />
                <span className="hidden md:inline">{category.label}</span>
                <span className="md:hidden">{category.label.split(' ')[0]}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {categories.map(category => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map(article => (
                <Card 
                  key={article.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleArticleClick(article)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{article.title}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {article.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {article.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        {article.read_time}
                      </div>
                      <span>By {article.author}</span>
                    </div>
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {article.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {article.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{article.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600">
                  {searchTerm 
                    ? `No articles match "${searchTerm}" in this category.`
                    : `No articles available in this category yet.`
                  }
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default KnowledgeBase;
