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
  const [isManagingUpdates, setIsManagingUpdates] = useState(false);
  const [isManagingProjects, setIsManagingProjects] = useState(false);
  const [isManagingGantt, setIsManagingGantt] = useState(false);
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
    deleteGanttItemFromAI
  } = useContentManager();

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'knowledge':
        return <KnowledgeBase onNavigate={setCurrentPage} />;
      case 'updates':
        return <LatestUpdates onManagingChange={setIsManagingUpdates} />;
      case 'progress':
        return <WorksInProgress onManagingChange={setIsManagingProjects} />;
      case 'gantt':
        return <GanttChart onManagingChange={setIsManagingGantt} />;
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
    
    if (isManagingUpdates) {
      context += " Currently in MANAGE MODE for Latest Updates - can create announcements and updates.";
    }
    
    if (isManagingProjects) {
      context += " Currently in MANAGE MODE for Works in Progress - can create new projects.";
    }

    if (isManagingGantt) {
      context += " Currently in MANAGE MODE for Gantt Chart - can create milestones, tasks, and subtasks.";
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
          onEditUpdate={editUpdateFromAI}
          onDeleteUpdate={deleteUpdateFromAI}
          onCreateProject={createProjectFromAI}
          onEditProject={editProjectFromAI}
          onDeleteProject={deleteProjectFromAI}
          onCreateGanttItem={createGanttItemFromAI}
          onEditGanttItem={editGanttItemFromAI}
          onDeleteGanttItem={deleteGanttItemFromAI}
          isManagingUpdates={isManagingUpdates}
          isManagingProjects={isManagingProjects}
          isManagingGantt={isManagingGantt}
          onNewMessage={() => setHasNewAIMessage(true)}
          hasNewMessage={hasNewAIMessage}
          onMessageRead={() => setHasNewAIMessage(false)}
        />
      </div>
    </AuthGuard>
  );
};

export default Index;
