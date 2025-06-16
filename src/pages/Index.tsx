
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
import GanttChart from '@/components/GanttChart';
import CompanyReports from '@/components/CompanyReports';
import Search from '@/components/Search';
import ContentManager from '@/components/ContentManager';
import ArticleView from '@/components/ArticleView';
import AIChatbotGuide from '@/components/AIChatbotGuide';
import AeroMailAi from '@/components/AeroMailAi';
import AIAssistant from '@/components/AIAssistant';
import UpdateDetail from '@/components/UpdateDetail';
import ReportDetail from '@/components/ReportDetail';
import { useContentManager } from '@/hooks/useContentManager';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [currentTab, setCurrentTab] = useState('');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [selectedDetailData, setSelectedDetailData] = useState<any>(null);
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

  const handleNavigate = (page: string, tab?: string, data?: any) => {
    setCurrentPage(page);
    if (page === 'project-central') {
      // If no specific tab is provided, default to 'overview'
      setCurrentTab(tab || 'overview');
    } else {
      // Reset currentTab when navigating to other pages
      setCurrentTab('');
    }
    
    // Store detail data for detail pages
    if (data) {
      setSelectedDetailData(data);
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
            initialTab={currentTab || 'overview'}
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
        return <CompanyHub onNavigate={handleNavigate} isManaging={isGlobalManaging} />;
      case 'product-development':
        return <ProductDevelopment onNavigate={handleNavigate} />;
      case 'business-operations':
        return <BusinessOperations onNavigate={handleNavigate} isManaging={isGlobalManaging} />;
      case 'latest-updates':
        return (
          <LatestUpdates
            onNavigate={handleNavigate}
            isManaging={isGlobalManaging}
          />
        );
      case 'update-detail':
        return (
          <UpdateDetail
            update={selectedDetailData}
            onBack={() => handleNavigate('latest-updates')}
          />
        );
      case 'works-in-progress':
        return <WorksInProgress onNavigate={handleNavigate} isManaging={isGlobalManaging} />;
      case 'gantt-chart':
        return (
          <GanttChart
            isManaging={isGlobalManaging}
          />
        );
      case 'company-reports':
        return <CompanyReports onNavigate={handleNavigate} isManaging={isGlobalManaging} />;
      case 'report-detail':
        return (
          <ReportDetail
            report={selectedDetailData}
            onBack={() => handleNavigate('company-reports')}
          />
        );
      case 'search':
        return <Search onNavigate={handleNavigate} />;
      case 'content-manager':
        return <ContentManager onNavigate={handleNavigate} />;
      case 'article-view':
        return (
          <ArticleView
            article={selectedArticleId}
            onNavigate={handleNavigate}
            onBack={() => handleNavigate('knowledge')}
          />
        );
      case 'ai-chatbot-guide':
        return <AIChatbotGuide onNavigate={handleNavigate} />;
      case 'aeromail-ai':
        return (
          <AeroMailAi
            onNavigate={handleNavigate}
            isManagingUpdates={isGlobalManaging}
            isManagingProjects={isGlobalManaging}
            isManagingGantt={isGlobalManaging}
            isManagingKnowledge={isGlobalManaging}
          />
        );
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

  // Don't show AIAssistant on the aeromail-ai page
  const showAIAssistant = currentPage !== 'aeromail-ai';

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
        {showAIAssistant && (
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
        )}
      </div>
    </AuthGuard>
  );
};

export default Index;
