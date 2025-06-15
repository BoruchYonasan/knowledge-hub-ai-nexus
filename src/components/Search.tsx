
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SearchProps {
  onNavigate?: (page: string, tab?: string) => void;
}

const Search: React.FC<SearchProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Search</h1>
        <p className="text-gray-600">Search across all content and projects</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Search Functionality</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Search component implementation coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Search;
