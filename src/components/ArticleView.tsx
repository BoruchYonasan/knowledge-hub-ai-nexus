
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ArticleViewProps {
  article?: string | null;
  onNavigate?: (page: string, tab?: string) => void;
  onBack?: () => void;
}

const ArticleView: React.FC<ArticleViewProps> = ({ article, onNavigate, onBack }) => {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={onBack} className="flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Article View</h1>
          <p className="text-gray-600">View article details</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Article Content</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            {article ? `Viewing article: ${article}` : 'No article selected'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticleView;
