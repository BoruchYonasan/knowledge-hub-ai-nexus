
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const KnowledgeBase: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Categories', icon: '📚', count: 42 },
    { id: 'hr', name: 'Human Resources', icon: '👥', count: 12 },
    { id: 'engineering', name: 'Engineering', icon: '⚙️', count: 15 },
    { id: 'sales', name: 'Sales & Marketing', icon: '💼', count: 8 },
    { id: 'finance', name: 'Finance', icon: '💰', count: 7 },
  ];

  const articles = [
    {
      id: 1,
      title: 'Employee Onboarding Guide',
      category: 'hr',
      description: 'Complete guide for new employee onboarding process',
      lastUpdated: '2024-06-10',
      author: 'Sarah Johnson',
      readTime: '5 min read',
    },
    {
      id: 2,
      title: 'API Development Standards',
      category: 'engineering',
      description: 'Best practices and standards for API development',
      lastUpdated: '2024-06-08',
      author: 'Mike Chen',
      readTime: '8 min read',
    },
    {
      id: 3,
      title: 'Sales Process Documentation',
      category: 'sales',
      description: 'Step-by-step guide to our sales process',
      lastUpdated: '2024-06-05',
      author: 'Jennifer Adams',
      readTime: '6 min read',
    },
    {
      id: 4,
      title: 'Code Review Guidelines',
      category: 'engineering',
      description: 'Guidelines for effective code reviews',
      lastUpdated: '2024-06-03',
      author: 'Alex Rodriguez',
      readTime: '4 min read',
    },
    {
      id: 5,
      title: 'Expense Reporting Policy',
      category: 'finance',
      description: 'How to submit and manage expense reports',
      lastUpdated: '2024-06-01',
      author: 'Emily Watson',
      readTime: '3 min read',
    },
    {
      id: 6,
      title: 'Remote Work Guidelines',
      category: 'hr',
      description: 'Best practices for remote work productivity',
      lastUpdated: '2024-05-28',
      author: 'David Kim',
      readTime: '7 min read',
    },
  ];

  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Knowledge Base</h1>
        <p className="text-gray-600">Browse our comprehensive collection of documentation and guides.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Categories</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                      selectedCategory === category.id ? 'bg-blue-50 border-r-2 border-blue-600' : ''
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-lg mr-3">{category.icon}</span>
                      <span className="font-medium text-gray-900">{category.name}</span>
                    </div>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">
                      {article.title}
                    </CardTitle>
                    <span className={`px-2 py-1 text-xs rounded-full ml-2 flex-shrink-0 ${
                      article.category === 'hr' ? 'bg-green-100 text-green-800' :
                      article.category === 'engineering' ? 'bg-blue-100 text-blue-800' :
                      article.category === 'sales' ? 'bg-purple-100 text-purple-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {categories.find(cat => cat.id === article.category)?.name || article.category}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{article.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span>By {article.author}</span>
                      <span>{article.readTime}</span>
                    </div>
                    <span>{new Date(article.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600">No articles match the selected category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
