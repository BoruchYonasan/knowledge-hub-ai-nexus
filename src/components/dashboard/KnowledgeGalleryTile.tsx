
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, User } from 'lucide-react';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';

interface KnowledgeGalleryTileProps {
  onNavigate: (page: string, tab?: string) => void;
}

const KnowledgeGalleryTile: React.FC<KnowledgeGalleryTileProps> = ({ onNavigate }) => {
  const { articles } = useKnowledgeBase();

  // Get the most recent articles
  const recentArticles = articles.slice(0, 4);

  const getCategoryColor = (category: string) => {
    const colors = {
      'engineering': 'bg-blue-100 text-blue-800',
      'hr': 'bg-green-100 text-green-800',
      'sales': 'bg-purple-100 text-purple-800',
      'finance': 'bg-yellow-100 text-yellow-800',
      'operations': 'bg-red-100 text-red-800',
      'all': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onNavigate('knowledge')}
    >
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center justify-between">
          <div className="flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Recent Knowledge Base Uploads
          </div>
          <span className="text-sm font-normal text-blue-600">View All →</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentArticles.length > 0 ? (
          recentArticles.map((article) => (
            <div key={article.id} className="flex items-start space-x-3 p-2 rounded hover:bg-gray-50 transition-colors">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">
                    {article.title}
                  </p>
                  <Badge className={`text-xs ${getCategoryColor(article.category || 'all')}`}>
                    {article.category}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 line-clamp-2 mb-1">
                  {article.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    {article.author}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {article.read_time}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            <p className="text-sm">No articles available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KnowledgeGalleryTile;
