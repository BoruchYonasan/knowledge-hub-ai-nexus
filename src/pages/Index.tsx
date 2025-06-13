
import React, { useState } from 'react';
import AuthGuard from '@/components/AuthGuard';
import Navbar from '@/components/Navbar';
import Dashboard from '@/components/Dashboard';
import KnowledgeBase from '@/components/KnowledgeBase';
import LatestUpdates from '@/components/LatestUpdates';
import WorksInProgress from '@/components/WorksInProgress';
import Search from '@/components/Search';

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
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
        <main>
          {renderCurrentPage()}
        </main>
      </div>
    </AuthGuard>
  );
};

export default Index;
