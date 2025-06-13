
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Plus, FileText, Folder } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContentItem {
  id: string;
  title: string;
  content: string;
  category: string;
  subcategory?: string;
  type: 'article' | 'guide' | 'policy' | 'procedure';
  tags: string[];
  author: string;
  lastUpdated: string;
  files?: File[];
}

const ContentManager: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [newContent, setNewContent] = useState<Partial<ContentItem>>({
    title: '',
    content: '',
    category: '',
    type: 'article',
    tags: [],
    author: ''
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const categories = [
    'Human Resources',
    'Engineering', 
    'Sales & Marketing',
    'Finance',
    'Operations',
    'Legal & Compliance',
    'IT & Security',
    'Product Management'
  ];

  const contentTypes = [
    { value: 'article', label: 'Knowledge Article' },
    { value: 'guide', label: 'Step-by-Step Guide' },
    { value: 'policy', label: 'Company Policy' },
    { value: 'procedure', label: 'Standard Procedure' }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      // Here you would typically send to your backend API
      console.log('Uploading content:', newContent);
      console.log('Attached files:', selectedFiles);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Content uploaded successfully",
        description: `${newContent.title} has been added to the knowledge base.`
      });

      // Reset form
      setNewContent({
        title: '',
        content: '',
        category: '',
        type: 'article',
        tags: [],
        author: ''
      });
      setSelectedFiles([]);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your content. Please try again.",
        variant: "destructive"
      });
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
                  value={newContent.title || ''}
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
                  value={newContent.author || ''}
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
                  value={newContent.category || ''}
                  onValueChange={(value) => setNewContent(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Type *
                </label>
                <Select
                  value={newContent.type || 'article'}
                  onValueChange={(value: 'article' | 'guide' | 'policy' | 'procedure') => 
                    setNewContent(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                Content *
              </label>
              <Textarea
                value={newContent.content || ''}
                onChange={(e) => setNewContent(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Enter the main content here... (Markdown supported)"
                className="min-h-[200px]"
                required
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
              {isUploading ? 'Uploading...' : 'Add to Knowledge Base'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentManager;
