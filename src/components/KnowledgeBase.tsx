
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface KnowledgeBaseProps {
  onNavigate?: (page: string, tab?: string) => void;
  onSelectArticle?: (articleId: string) => void;
  isManaging?: boolean;
}

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ onNavigate, onSelectArticle, isManaging = false }) => {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Knowledge Base</h1>
        <p className="text-gray-600">Access company knowledge and documentation</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Base</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Knowledge base implementation coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default KnowledgeBase;
