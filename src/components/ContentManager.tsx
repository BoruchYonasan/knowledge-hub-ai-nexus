
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Plus, FileText, Folder } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';

const ContentManager: React.FC = () => {
  const { createArticle } = useKnowledgeBase();
  const [isUploading, setIsUploading] = useState(false);
  const [newContent, setNewContent] = useState({
    title: '',
    description: '',
    content: '',
    category: 'all' as 'all' | 'hr' | 'engineering' | 'sales' | 'finance' | 'operations',
    author: '',
    read_time: '5 min read',
    tags: [] as string[]
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const categories = [
    { value: 'all', label: 'General' },
    { value: 'hr', label: 'Human Resources' },
    { value: 'engineering', label: 'Engineering' }, 
    { value: 'sales', label: 'Sales & Marketing' },
    { value: 'finance', label: 'Finance' },
    { value: 'operations', label: 'Operations' }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newContent.title || !newContent.author) {
      toast({
        title: "Missing required fields",
        description: "Please fill in title and author",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      await createArticle({
        ...newContent,
        description: newContent.description || newContent.content?.substring(0, 150) + '...' || ''
      });

      // Reset form
      setNewContent({
        title: '',
        description: '',
        content: '',
        category: 'all',
        author: '',
        read_time: '5 min read',
        tags: []
      });
      setSelectedFiles([]);
    } catch (error) {
      // Error is handled by the hook
    } finally {
      setIsUploading(false);
    }
  };

  const handleTagInput = (tagString: string) => {
    const tags = tagString.split(',').map(tag => tag.trim()).filter(tag => tag);
    setNewContent(prev => ({ ...prev, tags }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Folder className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add New Knowledge Base Content</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <Input
                  value={newContent.title}
                  onChange={(e) => setNewContent(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter content title..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author *
                </label>
                <Input
                  value={newContent.author}
                  onChange={(e) => setNewContent(prev => ({ ...prev, author: e.target.value }))}
                  placeholder="Your name..."
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <Select
                  value={newContent.category}
                  onValueChange={(value: any) => setNewContent(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Read Time
                </label>
                <Input
                  value={newContent.read_time}
                  onChange={(e) => setNewContent(prev => ({ ...prev, read_time: e.target.value }))}
                  placeholder="5 min read"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Input
                value={newContent.description}
                onChange={(e) => setNewContent(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the content..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <Input
                onChange={(e) => handleTagInput(e.target.value)}
                placeholder="onboarding, training, policy..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <Textarea
                value={newContent.content}
                onChange={(e) => setNewContent(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter the main content here... (Markdown supported)"
                className="min-h-[200px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attach Files (optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Upload files
                    </span>
                    <span className="mt-1 block text-sm text-gray-500">
                      PDF, DOC, images, etc.
                    </span>
                  </label>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    onChange={handleFileUpload}
                  />
                </div>
              </div>
              {selectedFiles.length > 0 && (
                <div className="mt-2 space-y-1">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                      <FileText className="h-4 w-4" />
                      <span>{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isUploading}
            >
              {isUploading ? 'Adding to Knowledge Base...' : 'Add to Knowledge Base'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentManager;
