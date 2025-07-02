
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, Settings, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';

interface AppSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isGlobalManaging: boolean;
  onGlobalManagingChange: (isManaging: boolean) => void;
}

const AppSidebar: React.FC<AppSidebarProps> = ({
  currentPage,
  onNavigate,
  isGlobalManaging,
  onGlobalManagingChange,
}) => {
  const { user, signOut } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'project-central', label: 'Project Central', icon: '🎯' },
    { id: 'knowledge', label: 'Knowledge Base', icon: '📚' },
    { id: 'company-hub', label: 'Company Hub', icon: '🏢' },
    { id: 'product-development', label: 'Product Dev', icon: '🛠️' },
    { id: 'business-operations', label: 'Business Ops', icon: '⚙️' },
    { id: 'latest-updates', label: 'Latest Updates', icon: '📢' },
    { id: 'works-in-progress', label: 'Works in Progress', icon: '🚧' },
    { id: 'gantt-chart', label: 'Gantt Chart', icon: '📈' },
    { id: 'company-reports', label: 'Company Reports', icon: '📄' },
  ];

  return (
    <Sidebar className="w-64 border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">✉️</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">AeroMail</h1>
            <p className="text-xs text-gray-500">Company KB</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onNavigate(item.id)}
                    isActive={currentPage === item.id}
                    className="w-full justify-start"
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => onNavigate('search')}
                  isActive={currentPage === 'search'}
                  className="w-full justify-start"
                >
                  <Search className="mr-3 h-4 w-4" />
                  Search
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm font-medium text-gray-700">
                    Manage Mode
                  </span>
                  <button
                    onClick={() => onGlobalManagingChange(!isGlobalManaging)}
                    className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      isGlobalManaging ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isGlobalManaging ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center space-x-3 mb-3">
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <User className="h-4 w-4" />
            <span className="truncate">{user?.email}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={signOut}
          className="w-full justify-start text-gray-600 hover:text-gray-900"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
