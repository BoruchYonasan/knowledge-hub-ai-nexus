
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { BookOpen, Plus, Search, Edit, Trash2, User, Clock, Tag } from 'lucide-react';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { useToast } from '@/hooks/use-toast';

interface KnowledgeBaseProps {
  onNavigate?: (page: string, tab?: string) => void;
  onSelectArticle?: (articleId: string) => void;
  isManaging?: boolean;
}

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ 
  onNavigate, 
  onSelectArticle, 
  isManaging = false 
}) => {
  const { articles, loading, createArticle, updateArticle, deleteArticle } = useKnowledgeBase();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<any>(null);

  const categories = [
    { id: 'all', name: 'All', icon: '📚' },
    { id: 'hr', name: 'HR', icon: '👥' },
    { id: 'engineering', name: 'Engineering', icon: '⚙️' },
    { id: 'sales', name: 'Sales', icon: '💰' },
    { id: 'finance', name: 'Finance', icon: '💼' },
    { id: 'operations', name: 'Operations', icon: '🔧' },
    { id: 'research-development', name: 'R&D', icon: '🧪' },
    { id: 'sustainability-compliance', name: 'Sustainability', icon: '🌱' },
    { id: 'marketing-brand', name: 'Marketing', icon: '📢' },
    { id: 'quality-testing', name: 'Quality', icon: '✅' }
  ];

  const filteredArticles = useMemo(() => {
    let filtered = articles;
    
    if (activeTab !== 'all') {
      filtered = filtered.filter(article => article.category === activeTab);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return filtered;
  }, [articles, activeTab, searchQuery]);

  const getCategoryColor = (category: string) => {
    const colors = {
      'hr': 'bg-purple-100 text-purple-800',
      'engineering': 'bg-blue-100 text-blue-800',
      'sales': 'bg-green-100 text-green-800',
      'finance': 'bg-yellow-100 text-yellow-800',
      'operations': 'bg-red-100 text-red-800',
      'research-development': 'bg-indigo-100 text-indigo-800',
      'sustainability-compliance': 'bg-emerald-100 text-emerald-800',
      'marketing-brand': 'bg-pink-100 text-pink-800',
      'quality-testing': 'bg-orange-100 text-orange-800',
      'all': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.all;
  };

  const handleCreateArticle = async (formData: FormData) => {
    try {
      const articleData = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        content: formData.get('content') as string,
        category: formData.get('category') as any,
        author: formData.get('author') as string,
        read_time: formData.get('read_time') as string,
        tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()).filter(Boolean)
      };
      
      await createArticle(articleData);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Failed to create article:', error);
    }
  };

  const handleEditArticle = async (formData: FormData) => {
    if (!editingArticle) return;
    
    try {
      const updates = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        content: formData.get('content') as string,
        category: formData.get('category') as any,
        author: formData.get('author') as string,
        read_time: formData.get('read_time') as string,
        tags: (formData.get('tags') as string).split(',').map(tag => tag.trim()).filter(Boolean)
      };
      
      await updateArticle(editingArticle.id, updates);
      setEditingArticle(null);
    } catch (error) {
      console.error('Failed to update article:', error);
    }
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await deleteArticle(articleId);
      } catch (error) {
        console.error('Failed to delete article:', error);
      }
    }
  };

  const ArticleForm = ({ article, onSubmit, onCancel }: any) => (
    <form action={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={article?.title || ''}
          placeholder="Article title"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={article?.description || ''}
          placeholder="Brief description"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          name="content"
          defaultValue={article?.content || ''}
          placeholder="Article content"
          className="min-h-32"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select name="category" defaultValue={article?.category || 'all'}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.filter(cat => cat.id !== 'all').map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.icon} {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="read_time">Read Time</Label>
          <Input
            id="read_time"
            name="read_time"
            defaultValue={article?.read_time || ''}
            placeholder="5 min read"
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="author">Author</Label>
        <Input
          id="author"
          name="author"
          defaultValue={article?.author || ''}
          placeholder="Author name"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          name="tags"
          defaultValue={article?.tags?.join(', ') || ''}
          placeholder="tag1, tag2, tag3"
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {article ? 'Update' : 'Create'} Article
        </Button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pl-0 lg:pl-64">
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Knowledge Base</h1>
            <p className="text-gray-600">Access company knowledge and documentation</p>
          </div>
          {isManaging && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Article
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Article</DialogTitle>
                </DialogHeader>
                <ArticleForm
                  onSubmit={handleCreateArticle}
                  onCancel={() => setIsCreateDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Knowledge Articles
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Search className="w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 lg:grid-cols-10 w-full mb-6">
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="text-xs"
                  >
                    <span className="mr-1">{category.icon}</span>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category.id} value={category.id} className="space-y-4">
                  {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-48 bg-gray-200 rounded-lg"></div>
                        </div>
                      ))}
                    </div>
                  ) : filteredArticles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredArticles.map((article) => (
                        <Card 
                          key={article.id} 
                          className="cursor-pointer hover:shadow-lg transition-shadow"
                          onClick={() => onSelectArticle?.(article.id)}
                        >
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-lg line-clamp-2">
                                {article.title}
                              </CardTitle>
                              {isManaging && (
                                <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingArticle(article)}
                                  >
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeleteArticle(article.id)}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <Badge className={`text-xs ${getCategoryColor(article.category)}`}>
                                {categories.find(cat => cat.id === article.category)?.name || article.category}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                              {article.description}
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <div className="flex items-center">
                                <User className="w-3 h-3 mr-1" />
                                <span>{article.author}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                <span>{article.read_time}</span>
                              </div>
                            </div>
                            {article.tags.length > 0 && (
                              <div className="flex items-center mt-3 flex-wrap gap-1">
                                <Tag className="w-3 h-3 mr-1" />
                                {article.tags.slice(0, 3).map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {article.tags.length > 3 && (
                                  <span className="text-xs text-gray-500">+{article.tags.length - 3}</span>
                                )}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No articles in {category.name === 'All' ? 'this search' : category.name}
                      </h3>
                      <p className="text-gray-500 mb-4">
                        {category.name === 'All' 
                          ? 'Try adjusting your search terms or browse by category.'
                          : `No articles have been added to the ${category.name} category yet.`
                        }
                      </p>
                      {isManaging && category.name !== 'All' && (
                        <Button onClick={() => setIsCreateDialogOpen(true)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add First Article
                        </Button>
                      )}
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Edit Article Dialog */}
        <Dialog open={!!editingArticle} onOpenChange={() => setEditingArticle(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Article</DialogTitle>
            </DialogHeader>
            {editingArticle && (
              <ArticleForm
                article={editingArticle}
                onSubmit={handleEditArticle}
                onCancel={() => setEditingArticle(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default KnowledgeBase;
