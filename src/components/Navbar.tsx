
import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, Settings, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isGlobalManaging: boolean;
  onGlobalManagingChange: (isManaging: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({
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
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">Company KB</h1>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    currentPage === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Global Manage Toggle */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">
                Manage Mode
              </label>
              <button
                onClick={() => onGlobalManagingChange(!isGlobalManaging)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  isGlobalManaging ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isGlobalManaging ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Search Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('search')}
              className="text-gray-600 hover:text-gray-900"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* User Menu */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <User className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="text-gray-600 hover:text-gray-900"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors duration-200 ${
                currentPage === item.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
