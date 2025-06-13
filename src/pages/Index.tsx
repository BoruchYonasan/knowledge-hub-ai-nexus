
import React, { useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import Navbar from '@/components/Navbar';
import Dashboard from '@/components/Dashboard';
import KnowledgeBase from '@/components/KnowledgeBase';
import LatestUpdates from '@/components/LatestUpdates';
import WorksInProgress from '@/components/WorksInProgress';
import Search from '@/components/Search';
import ContentManager from '@/components/ContentManager';
import AIAssistant from '@/components/AIAssistant';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'knowledge':
        return <KnowledgeBase />;
      case 'updates':
        return <LatestUpdates />;
      case 'progress':
        return <WorksInProgress />;
      case 'search':
        return <Search />;
      case 'content-manager':
        return <ContentManager />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  const getKnowledgeBaseContext = () => {
    return `Current page: ${currentPage}. Available sections: Dashboard, Knowledge Base, Latest Updates, Works in Progress, Search, Content Manager.`;
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
        <main>
          {renderCurrentPage()}
        </main>
        <AIAssistant 
          knowledgeBaseContext={getKnowledgeBaseContext()}
          onNavigate={setCurrentPage}
        />
      </div>
    </AuthGuard>
  );
};

export default Index;
