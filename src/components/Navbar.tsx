
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Menu, X } from 'lucide-react';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isGlobalManaging?: boolean;
  onGlobalManagingChange?: (isManaging: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ 
  currentPage, 
  onNavigate, 
  isGlobalManaging = false, 
  onGlobalManagingChange 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '🏠', description: 'Overview & metrics' },
    { id: 'project-central', name: 'Project Central', icon: '📊', description: 'Projects & timelines' },
    { id: 'knowledge', name: 'Knowledge Base', icon: '📚', description: 'Documentation hub' },
    { id: 'company-hub', name: 'Company Hub', icon: '👥', description: 'Team & communications' },
    { id: 'product-development', name: 'Product Development', icon: '🔬', description: 'R&D & prototypes' },
    { id: 'business-operations', name: 'Business Operations', icon: '💼', description: 'Finance & operations' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('kb_authenticated');
    window.location.reload();
  };

  const handleGlobalManageToggle = () => {
    onGlobalManagingChange?.(!isGlobalManaging);
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-sm">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-3">
                <span className="text-xl font-bold text-navy-900">AeroMail</span>
                <div className="text-xs text-navy-500 -mt-1">Knowledge Base</div>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden xl:flex space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`group px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === item.id
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-navy-600 hover:text-navy-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-base">{item.icon}</span>
                    <div className="text-left">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs opacity-75">{item.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Simplified Desktop Navigation for smaller screens */}
            <div className="hidden md:flex xl:hidden space-x-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === item.id
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-navy-600 hover:text-navy-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2 text-base">{item.icon}</span>
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-3">
            {/* Global Manage Toggle */}
            <Button
              variant={isGlobalManaging ? 'default' : 'outline'}
              size="sm"
              onClick={handleGlobalManageToggle}
              className={`hidden sm:flex items-center space-x-2 transition-all duration-200 ${
                isGlobalManaging 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm' 
                  : 'text-navy-600 hover:text-navy-900 border-gray-300 hover:border-gray-400'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden md:inline">{isGlobalManaging ? 'Exit Manage' : 'Manage'}</span>
            </Button>

            {/* Logout Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-navy-600 hover:text-red-600 border-gray-300 hover:border-red-300 transition-all duration-200"
            >
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">🚪</span>
            </Button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-navy-600 hover:text-navy-900 hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center px-3 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                  currentPage === item.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-navy-600 hover:bg-gray-50 hover:text-navy-900'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                <div className="text-left">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs opacity-75">{item.description}</div>
                </div>
              </button>
            ))}
            
            {/* Mobile controls */}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              <button
                onClick={() => {
                  handleGlobalManageToggle();
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center px-3 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                  isGlobalManaging 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-navy-600 hover:bg-gray-50 hover:text-navy-900'
                }`}
              >
                <Settings className="w-5 h-5 mr-3" />
                {isGlobalManaging ? 'Exit Manage Mode' : 'Enter Manage Mode'}
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                <span className="mr-3 text-lg">🚪</span>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
