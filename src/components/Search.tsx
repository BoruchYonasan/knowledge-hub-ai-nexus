
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Mock search data
  const allContent = [
    {
      id: 1,
      title: 'Employee Onboarding Guide',
      type: 'knowledge',
      category: 'HR',
      content: 'Complete guide for new employee onboarding process including documentation, training, and first week activities.',
      author: 'Sarah Johnson',
      date: '2024-06-10',
    },
    {
      id: 2,
      title: 'API Development Standards',
      type: 'knowledge',
      category: 'Engineering',
      content: 'Best practices and standards for API development including REST conventions, authentication, and documentation.',
      author: 'Mike Chen',
      date: '2024-06-08',
    },
    {
      id: 3,
      title: 'Q4 Company All-Hands Meeting',
      type: 'update',
      category: 'Leadership',
      content: 'Join us for the quarterly all-hands meeting where we will discuss company performance and upcoming initiatives.',
      author: 'Sarah Johnson',
      date: '2024-06-10',
    },
    {
      id: 4,
      title: 'Customer Portal Redesign',
      type: 'project',
      category: 'Frontend',
      content: 'Complete redesign of the customer portal with improved UX/UI, faster loading times, and mobile responsiveness.',
      author: 'Alex Rodriguez',
      date: '2024-05-01',
    },
    {
      id: 5,
      title: 'Security Policy Updates',
      type: 'update',
      category: 'Security',
      content: 'Important changes to our security policies effective immediately. All employees must review and acknowledge.',
      author: 'Jennifer Adams',
      date: '2024-06-05',
    },
    {
      id: 6,
      title: 'Code Review Guidelines',
      type: 'knowledge',
      category: 'Engineering',
      content: 'Guidelines for effective code reviews including checklist items, best practices, and common issues to look for.',
      author: 'Alex Rodriguez',
      date: '2024-06-03',
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    // Simulate search delay
    setTimeout(() => {
      const results = allContent.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
      setIsSearching(false);
    }, 500);
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">{part}</mark>
      ) : part
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'knowledge':
        return '📚';
      case 'update':
        return '📰';
      case 'project':
        return '🚧';
      default:
        return '📄';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'knowledge':
        return 'Knowledge Base';
      case 'update':
        return 'Update';
      case 'project':
        return 'Project';
      default:
        return 'Document';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Search Knowledge Base</h1>
        <p className="text-gray-600">Find information across all documentation, updates, and projects.</p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4">
          <Input
            type="text"
            placeholder="Search for documents, updates, projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 text-lg py-3"
          />
          <Button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 px-6"
            disabled={isSearching}
          >
            {isSearching ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Searching...
              </div>
            ) : (
              'Search'
            )}
          </Button>
        </div>
      </form>

      {/* Search Results */}
      {hasSearched && (
        <div>
          {isSearching ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Searching knowledge base...</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  {searchResults.length === 0 
                    ? `No results found for "${searchQuery}"`
                    : `Found ${searchResults.length} result${searchResults.length !== 1 ? 's' : ''} for "${searchQuery}"`
                  }
                </p>
              </div>

              {searchResults.length > 0 ? (
                <div className="space-y-4">
                  {searchResults.map((result) => (
                    <Card key={result.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getTypeIcon(result.type)}</span>
                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                              {getTypeLabel(result.type)}
                            </span>
                            <span className="text-sm text-gray-500">
                              {result.category}
                            </span>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {highlightText(result.title, searchQuery)}
                        </h3>
                        
                        <p className="text-gray-700 mb-3">
                          {highlightText(result.content, searchQuery)}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>By {result.author}</span>
                          <span>{new Date(result.date).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : hasSearched && searchQuery && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your search terms or browse our categories.
                  </p>
                  <div className="flex justify-center space-x-2">
                    <Button variant="outline" onClick={() => setSearchQuery('')}>
                      Clear Search
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Search Suggestions */}
      {!hasSearched && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Popular Searches</h3>
          <div className="flex flex-wrap gap-2">
            {['onboarding', 'API documentation', 'security policy', 'code review', 'employee handbook'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setSearchQuery(suggestion);
                  handleSearch(new Event('submit') as any);
                }}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
