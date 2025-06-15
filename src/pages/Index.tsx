
import React, { useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import Navbar from '@/components/Navbar';
import Dashboard from '@/components/Dashboard';
import KnowledgeBase from '@/components/KnowledgeBase';
import LatestUpdates from '@/components/LatestUpdates';
import WorksInProgress from '@/components/WorksInProgress';
import GanttChart from '@/components/GanttChart';
import Search from '@/components/Search';
import ContentManager from '@/components/ContentManager';
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
      case 'knowledge':
        return <KnowledgeBase onNavigate={setCurrentPage} isManaging={isGlobalManaging} />;
      case 'updates':
        return <LatestUpdates isManaging={isGlobalManaging} />;
      case 'progress':
        return <WorksInProgress isManaging={isGlobalManaging} />;
      case 'gantt':
        return <GanttChart isManaging={isGlobalManaging} />;
      case 'search':
        return <Search />;
      case 'content-manager':
        return <ContentManager />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  const getKnowledgeBaseContext = () => {
    let context = `Current page: ${currentPage}. Available sections: Dashboard, Knowledge Base, Latest Updates, Works in Progress, Gantt Chart, Search, Content Manager.`;
    
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
