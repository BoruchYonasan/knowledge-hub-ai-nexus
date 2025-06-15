import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import AuthGuard from '@/components/AuthGuard';
import Navbar from '@/components/Navbar';
import Dashboard from '@/components/Dashboard';
import ProjectCentral from '@/components/ProjectCentral';
import KnowledgeBase from '@/components/KnowledgeBase';
import CompanyHub from '@/components/CompanyHub';
import ProductDevelopment from '@/components/ProductDevelopment';
import BusinessOperations from '@/components/BusinessOperations';
import LatestUpdates from '@/components/LatestUpdates';
import WorksInProgress from '@/components/WorksInProgress';
import GanttChartView from '@/components/GanttChartView';
import CompanyReports from '@/components/CompanyReports';
import Search from '@/components/Search';
import ContentManager from '@/components/ContentManager';
import ArticleView from '@/components/ArticleView';
import AIChatbotGuide from '@/components/AIChatbotGuide';
import AIAssistant from '@/components/AIAssistant';
import { useContentManager } from '@/hooks/useContentManager';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [currentTab, setCurrentTab] = useState('');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [isGlobalManaging, setIsGlobalManaging] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const { toast } = useToast();

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

  useEffect(() => {
    // Add any necessary side effects here
  }, []);

  const handleNavigate = (page: string, tab?: string) => {
    setCurrentPage(page);
    if (page === 'project-central' && tab) {
      setCurrentTab(tab);
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'project-central':
        return (
          <ProjectCentral
            onNavigate={handleNavigate}
            initialTab={currentTab}
            isManaging={isGlobalManaging}
          />
        );
      case 'knowledge':
        return (
          <KnowledgeBase
            onNavigate={handleNavigate}
            onSelectArticle={setSelectedArticleId}
            isManaging={isGlobalManaging}
          />
        );
      case 'company-hub':
        return <CompanyHub onNavigate={handleNavigate} />;
      case 'product-development':
        return <ProductDevelopment onNavigate={handleNavigate} />;
      case 'business-operations':
        return <BusinessOperations onNavigate={handleNavigate} />;
      case 'latest-updates':
        return (
          <LatestUpdates
            onNavigate={handleNavigate}
            isManaging={isGlobalManaging}
          />
        );
      case 'works-in-progress':
        return <WorksInProgress onNavigate={handleNavigate} />;
      case 'gantt-chart':
        return (
          <GanttChartView
            onNavigate={handleNavigate}
            isManaging={isGlobalManaging}
          />
        );
      case 'company-reports':
        return <CompanyReports onNavigate={handleNavigate} />;
      case 'search':
        return <Search onNavigate={handleNavigate} />;
      case 'content-manager':
        return <ContentManager onNavigate={handleNavigate} />;
      case 'article-view':
        return (
          <ArticleView
            articleId={selectedArticleId}
            onNavigate={handleNavigate}
            onBack={() => handleNavigate('knowledge')}
          />
        );
      case 'ai-chatbot-guide':
        return <AIChatbotGuide onNavigate={handleNavigate} />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  const getKnowledgeBaseContext = () => {
    let context = `Current page: ${currentPage}. Available sections: Dashboard, Project Central, Knowledge Base, Company Hub, Product Development, Business Operations, Search, Content Manager, Latest Updates, Company Reports.`;
    
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
          onNewMessage={() => setHasNewMessage(true)}
          hasNewMessage={hasNewMessage}
          onMessageRead={() => setHasNewMessage(false)}
        />
      </div>
    </AuthGuard>
  );
};

export default Index;
