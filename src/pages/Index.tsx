
import React, { useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import Navbar from '@/components/Navbar';
import Dashboard from '@/components/Dashboard';
import KnowledgeBase from '@/components/KnowledgeBase';
import ProjectCentral from '@/components/ProjectCentral';
import CompanyHub from '@/components/CompanyHub';
import ProductDevelopment from '@/components/ProductDevelopment';
import BusinessOperations from '@/components/BusinessOperations';
import Search from '@/components/Search';
import ContentManager from '@/components/ContentManager';
import LatestUpdates from '@/components/LatestUpdates';
import AIAssistant from '@/components/AIAssistant';
import { useContentManager } from '@/hooks/useContentManager';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isGlobalManaging, setIsGlobalManaging] = useState(false);
  const [hasNewAIMessage, setHasNewAIMessage] = useState(false);
  
  const { 
    createUpdateFromAI, 
    editUpdateFromAI, 
    deleteUpdateFromAI,
    createProjectFromAI, 
    editProjectFromAI, 
    deleteProjectFromAI,
    createGanttItemFromAI,
    editGanttItemFromAI,
    deleteGanttItemFromAI,
    createArticleFromAI,
    editArticleFromAI,
    deleteArticleFromAI
  } = useContentManager();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'project-central':
        return (
          <div className="pt-16 pl-0 lg:pl-64">
            <ProjectCentral isManaging={isGlobalManaging} />
          </div>
        );
      case 'knowledge':
        return (
          <div className="pt-16 pl-0 lg:pl-64">
            <KnowledgeBase onNavigate={setCurrentPage} isManaging={isGlobalManaging} />
          </div>
        );
      case 'company-hub':
        return (
          <div className="pt-16 pl-0 lg:pl-64">
            <CompanyHub isManaging={isGlobalManaging} />
          </div>
        );
      case 'product-development':
        return (
          <div className="pt-16 pl-0 lg:pl-64">
            <ProductDevelopment isManaging={isGlobalManaging} />
          </div>
        );
      case 'business-operations':
        return (
          <div className="pt-16 pl-0 lg:pl-64">
            <BusinessOperations isManaging={isGlobalManaging} />
          </div>
        );
      case 'search':
        return (
          <div className="pt-16 pl-0 lg:pl-64">
            <Search />
          </div>
        );
      case 'content-manager':
        return (
          <div className="pt-16 pl-0 lg:pl-64">
            <ContentManager />
          </div>
        );
      case 'latest-updates':
        return (
          <div className="pt-16 pl-0 lg:pl-64">
            <LatestUpdates isManaging={isGlobalManaging} />
          </div>
        );
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  const getKnowledgeBaseContext = () => {
    let context = `Current page: ${currentPage}. Available sections: Dashboard, Project Central, Knowledge Base, Company Hub, Product Development, Business Operations, Search, Content Manager, Latest Updates.`;
    
    if (isGlobalManaging) {
      context += " Currently in GLOBAL MANAGE MODE - can create, edit, and delete content across all sections.";
    }
    
    return context;
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Navbar 
          currentPage={currentPage} 
          onNavigate={setCurrentPage}
          isGlobalManaging={isGlobalManaging}
          onGlobalManagingChange={setIsGlobalManaging}
        />
        <main>
          {renderCurrentPage()}
        </main>
        <AIAssistant 
          knowledgeBaseContext={getKnowledgeBaseContext()}
          onNavigate={setCurrentPage}
          onCreateUpdate={createUpdateFromAI}
          onEditUpdate={editUpdateFromAI}
          onDeleteUpdate={deleteUpdateFromAI}
          onCreateProject={createProjectFromAI}
          onEditProject={editProjectFromAI}
          onDeleteProject={deleteProjectFromAI}
          onCreateGanttItem={createGanttItemFromAI}
          onEditGanttItem={editGanttItemFromAI}
          onDeleteGanttItem={deleteGanttItemFromAI}
          onCreateArticle={createArticleFromAI}
          onEditArticle={editArticleFromAI}
          onDeleteArticle={deleteArticleFromAI}
          isManagingUpdates={isGlobalManaging}
          isManagingProjects={isGlobalManaging}
          isManagingGantt={isGlobalManaging}
          isManagingKnowledge={isGlobalManaging}
          onNewMessage={() => setHasNewAIMessage(true)}
          hasNewMessage={hasNewAIMessage}
          onMessageRead={() => setHasNewAIMessage(false)}
        />
      </div>
    </AuthGuard>
  );
};

export default Index;
