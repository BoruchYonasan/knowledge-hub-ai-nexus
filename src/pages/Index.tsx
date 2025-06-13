
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
import { useContentManager } from '@/hooks/useContentManager';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isManagingUpdates, setIsManagingUpdates] = useState(false);
  const [isManagingProjects, setIsManagingProjects] = useState(false);
  
  const { createUpdateFromAI, createProjectFromAI } = useContentManager();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'knowledge':
        return <KnowledgeBase />;
      case 'updates':
        return <LatestUpdates onManagingChange={setIsManagingUpdates} />;
      case 'progress':
        return <WorksInProgress onManagingChange={setIsManagingProjects} />;
      case 'search':
        return <Search />;
      case 'content-manager':
        return <ContentManager />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  const getKnowledgeBaseContext = () => {
    let context = `Current page: ${currentPage}. Available sections: Dashboard, Knowledge Base, Latest Updates, Works in Progress, Search, Content Manager.`;
    
    if (isManagingUpdates) {
      context += " Currently in MANAGE MODE for Latest Updates - can create announcements and updates.";
    }
    
    if (isManagingProjects) {
      context += " Currently in MANAGE MODE for Works in Progress - can create new projects.";
    }
    
    return context;
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
          onCreateUpdate={createUpdateFromAI}
          onCreateProject={createProjectFromAI}
          isManagingUpdates={isManagingUpdates}
          isManagingProjects={isManagingProjects}
        />
      </div>
    </AuthGuard>
  );
};

export default Index;
