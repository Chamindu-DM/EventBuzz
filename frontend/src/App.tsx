import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { HomeFeed } from './components/HomeFeed';
import { PlaceholderView } from './components/PlaceholderView';
import { AuthProvider, useAuth } from './components/auth/AuthContext';
import { AuthWrapper } from './components/auth/AuthWrapper';
import { Toaster } from './components/ui/sonner';
import TeamsView from './components/TeamsView';

function AppContent() {
  const { isAuthenticated, isLoading, createUser } = useAuth();
  const [currentView, setCurrentView] = useState('home');
  const [unreadNotifications, setUnreadNotifications] = useState(2);

  const handleNewNotification = () => {
    setUnreadNotifications(prev => prev + 1);
  };

  const handleAuthComplete = (userData: any) => {
    createUser(userData);
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading EventWall...</p>
        </div>
      </div>
    );
  }

  // Show authentication flow if user is not authenticated
  if (!isAuthenticated) {
    return <AuthWrapper onAuthComplete={handleAuthComplete} />;
  }

  // Main application for authenticated users


const renderView = () => {
  switch (currentView) {
    case 'home':
      return <HomeFeed onNewNotification={handleNewNotification} />;
    case 'events':
    case 'trending':
      return <PlaceholderView view={currentView} />;
    case 'teams':
      return <TeamsView />;  // <-- use the real Teams page here
    default:
      return <HomeFeed onNewNotification={handleNewNotification} />;
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5">
      <Navigation 
        currentView={currentView}
        onViewChange={setCurrentView}
        unreadNotifications={unreadNotifications}
      />
      
      <main className="pb-4">
        {renderView()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
}