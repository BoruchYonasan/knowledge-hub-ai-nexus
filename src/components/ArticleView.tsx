
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, User, Calendar, Tag } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  description: string;
  content?: string;
  category: string;
  author: string;
  read_time: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface ArticleViewProps {
  article: Article;
  onBack: () => void;
}

const ArticleView: React.FC<ArticleViewProps> = ({ article, onBack }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="ghost" onClick={onBack} className="flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Knowledge Base
        </Button>
      </div>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Badge variant="secondary" className="text-xs">
                {article.category}
              </Badge>
              <CardTitle className="text-3xl font-bold leading-tight">
                {article.title}
              </CardTitle>
              {article.description && (
                <p className="text-lg text-gray-600 leading-relaxed">
                  {article.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 pt-4 border-t">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              <span>By {article.author}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{article.read_time}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{formatDate(article.created_at)}</span>
            </div>
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="flex items-center gap-2 pt-2">
              <Tag className="w-4 h-4 text-gray-400" />
              <div className="flex flex-wrap gap-1">
                {article.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="pt-0">
          <div className="prose prose-lg max-w-none">
            {article.content ? (
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {article.content}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>No content available for this article.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticleView;
