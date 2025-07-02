
import React, { useState } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AuthGuard from '@/components/AuthGuard';
import AppSidebar from '@/components/AppSidebar';
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

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isGlobalManaging, setIsGlobalManaging] = useState(false);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} isManaging={isGlobalManaging} />;
      case 'project-central':
        return <ProjectCentral onNavigate={handleNavigate} isManaging={isGlobalManaging} />;
      case 'knowledge':
        return <KnowledgeBase onNavigate={handleNavigate} isManaging={isGlobalManaging} />;
      case 'company-hub':
        return <CompanyHub onNavigate={handleNavigate} isManaging={isGlobalManaging} />;
      case 'product-development':
        return <ProductDevelopment onNavigate={handleNavigate} isManaging={isGlobalManaging} />;
      case 'business-operations':
        return <BusinessOperations onNavigate={handleNavigate} isManaging={isGlobalManaging} />;
      case 'latest-updates':
        return <LatestUpdates onNavigate={handleNavigate} isManaging={isGlobalManaging} />;
      case 'works-in-progress':
        return <WorksInProgress onNavigate={handleNavigate} isManaging={isGlobalManaging} />;
      case 'gantt-chart':
        return <GanttChart onNavigate={handleNavigate} isManaging={isGlobalManaging} />;
      case 'company-reports':
        return <CompanyReports onNavigate={handleNavigate} isManaging={isGlobalManaging} />;
      case 'search':
        return <Search onNavigate={handleNavigate} isManaging={isGlobalManaging} />;
      default:
        return <Dashboard onNavigate={handleNavigate} isManaging={isGlobalManaging} />;
    }
  };

  return (
    <AuthGuard>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar
            currentPage={currentPage}
            onNavigate={handleNavigate}
            isGlobalManaging={isGlobalManaging}
            onGlobalManagingChange={setIsGlobalManaging}
          />
          <SidebarInset className="flex-1">
            <main className="flex-1 overflow-auto">
              {renderCurrentPage()}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
};

export default Index;
