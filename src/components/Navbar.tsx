import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Menu, X, HelpCircle, User, BookOpen, Calendar, ExternalLink, Bot, FileText } from 'lucide-react';

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
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'project-central', name: 'Project Central', icon: '📋' },
    { id: 'knowledge', name: 'Knowledge Base', icon: '📚' },
    { id: 'company-hub', name: 'Company Hub', icon: '👥' },
    { id: 'product-development', name: 'Product Development', icon: '🚀' },
    { id: 'business-operations', name: 'Business Operations', icon: '💼' },
  ];

  const navigationItems = [
    { id: 'knowledge', name: 'Knowledge Base', icon: BookOpen, type: 'internal' },
    { id: 'company-hub', name: 'Calendar', icon: Calendar, type: 'internal' },
    { id: 'aeromail-website', name: 'AeroMail Website', icon: ExternalLink, type: 'external', url: 'https://am.dev.narrative.studio/' },
    { id: 'ai-chatbot-guide', name: 'AI Chatbot Guide', icon: Bot, type: 'internal' },
    { id: 'company-reports', name: 'Company Reports', icon: FileText, type: 'internal' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('kb_authenticated');
    window.location.reload();
  };

  const handleNavigationClick = (item: typeof navigationItems[0]) => {
    if (item.type === 'external') {
      window.open(item.url, '_blank');
    } else if (item.type === 'internal') {
      onNavigate(item.id);
    }
    // For placeholder items, do nothing
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Header Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 h-16 z-50 flex items-center justify-between px-6">
        {/* Left side - empty to match reference */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        
        {/* Center - Search Bar */}
        <div className="flex-1 max-w-2xl mx-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full h-10 pl-10 pr-4 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              onClick={() => onNavigate('search')}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right side - Settings, Help and User */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => onGlobalManagingChange?.(!isGlobalManaging)}
            className={`p-2 rounded-lg ${
              isGlobalManaging 
                ? 'text-blue-600 bg-blue-100 hover:bg-blue-200' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Settings className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <HelpCircle className="w-5 h-5" />
          </button>
          <button onClick={handleLogout} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Left Sidebar */}
      <div className={`fixed left-0 top-16 bottom-0 w-64 bg-blue-600 text-white z-40 transform transition-transform duration-300 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Logo */}
        <div className="p-6 border-b border-blue-500">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white bg-opacity-20 rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </div>
            <span className="text-xl font-semibold">AeroMail</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                currentPage === item.id
                  ? 'bg-blue-700 text-white'
                  : 'text-blue-100 hover:bg-blue-500 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.name}</span>
            </button>
          ))}

          {/* Navigate Section */}
          <div className="mt-6">
            <div className="px-4 py-2 text-xs font-semibold text-blue-200 uppercase tracking-wider">
              NAVIGATE
            </div>
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigationClick(item)}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-left rounded-lg transition-colors ${
                  item.type === 'placeholder' 
                    ? 'text-blue-300 cursor-not-allowed opacity-75' 
                    : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                }`}
                disabled={item.type === 'placeholder'}
              >
                <item.icon className="w-4 h-4" />
                <span className="text-sm">{item.name}</span>
                {item.type === 'external' && <ExternalLink className="w-3 h-3 ml-auto" />}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;
