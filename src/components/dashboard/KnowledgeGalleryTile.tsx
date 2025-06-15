
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, User, Clock } from 'lucide-react';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';

interface KnowledgeGalleryTileProps {
  onNavigate: (page: string, tab?: string) => void;
}

const KnowledgeGalleryTile: React.FC<KnowledgeGalleryTileProps> = ({ onNavigate }) => {
  const { articles, loading } = useKnowledgeBase();

  // Get the latest 3 articles
  const recentArticles = articles
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  const getCategoryColor = (category: string) => {
    const colors = {
      'hr': 'bg-purple-100 text-purple-800',
      'engineering': 'bg-blue-100 text-blue-800',
      'sales': 'bg-green-100 text-green-800',
      'finance': 'bg-yellow-100 text-yellow-800',
      'operations': 'bg-red-100 text-red-800',
      'all': 'bg-gray-100 text-gray-800'
    };
    return colors[category as keyof typeof colors] || colors.all;
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
            Knowledge Gallery
          </div>
          <span className="text-sm font-normal text-blue-600">View All →</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        ) : recentArticles.length > 0 ? (
          recentArticles.map((article) => (
            <div key={article.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{article.title}</h4>
                <Badge className={`text-xs ${getCategoryColor(article.category)}`}>
                  {article.category}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 line-clamp-2 mb-2">{article.description}</p>
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
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No articles available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KnowledgeGalleryTile;
