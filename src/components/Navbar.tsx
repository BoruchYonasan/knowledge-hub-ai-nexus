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

// This component is now deprecated in favor of AppSidebar
// Keeping it for backward compatibility but it's no longer used
const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  isGlobalManaging,
  onGlobalManagingChange,
}) => {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">Company KB</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
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
    </nav>
  );
};

export default Navbar;
