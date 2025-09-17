import { useState } from 'react';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader } from './ui/card';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ScrollArea } from './ui/scroll-area';
import logo from '../assets/Eventbuzz_logo.png';
import { Separator } from './ui/separator';
import { 
  Bell, 
  Home, 
  Calendar, 
  Users, 
  Settings, 
  LogOut,
  User,
  MessageSquare,
  Heart,
  TrendingUp
} from 'lucide-react';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  unreadNotifications: number;
}

// Mock notification data
const mockNotifications = [
  {
    id: '1',
    type: 'like',
    message: 'Sarah Chen liked your post',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b6b0f66d?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '2',
    type: 'comment',
    message: 'Alex Rivera commented on your poll',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    read: false,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '3',
    type: 'mention',
    message: 'You were mentioned in a post by Tech Team Alpha',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '4',
    type: 'event',
    message: 'Presentation schedule has been updated',
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    read: true,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
  }
];

export function Navigation({ currentView, onViewChange, unreadNotifications }: NavigationProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const formatNotificationTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like': return <Heart className="w-4 h-4 text-primary" />;
      case 'comment': return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'mention': return <User className="w-4 h-4 text-green-500" />;
      case 'event': return <Calendar className="w-4 h-4 text-orange-500" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'trending', label: 'Trending', icon: TrendingUp }
  ];

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Application Logo" 
              className="w-full max-h-12 object-cover rounded-lg"
              />
            </div>

            {/* Navigation Items */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={currentView === item.id ? "secondary" : "ghost"}
                    onClick={() => onViewChange(item.id)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Right side - Notifications and Profile */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                    >
                      {unreadNotifications}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Notifications</h3>
                      <Button variant="ghost" size="sm" className="text-primary">
                        Mark all read
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-80">
                      <div className="space-y-1">
                        {mockNotifications.map((notification, index) => (
                          <div key={notification.id}>
                            <div className={`p-3 hover:bg-muted/50 cursor-pointer ${!notification.read ? 'bg-primary/5' : ''}`}>
                              <div className="flex gap-3">
                                <Avatar className="w-8 h-8">
                                  <AvatarImage src={notification.avatar} />
                                  <AvatarFallback>
                                    {getNotificationIcon(notification.type)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm">{notification.message}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatNotificationTime(notification.timestamp)}
                                  </p>
                                </div>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                                )}
                              </div>
                            </div>
                            {index < mockNotifications.length - 1 && <Separator />}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </PopoverContent>
            </Popover>

            {/* Profile */}
            <Popover open={profileOpen} onOpenChange={setProfileOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block">John Doe</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0" align="end">
                <Card>
                  <CardContent className="p-2">
                    <div className="space-y-1">
                      <div className="px-2 py-2">
                        <p className="font-medium">John Doe</p>
                        <p className="text-sm text-muted-foreground">john.doe@university.edu</p>
                      </div>
                      <Separator />
                      <Button variant="ghost" className="w-full justify-start gap-2">
                        <User className="w-4 h-4" />
                        Profile
                      </Button>
                      <Button variant="ghost" className="w-full justify-start gap-2">
                        <Settings className="w-4 h-4" />
                        Settings
                      </Button>
                      <Separator />
                      <Button variant="ghost" className="w-full justify-start gap-2 text-destructive">
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-border">
        <div className="flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={currentView === item.id ? "secondary" : "ghost"}
                onClick={() => onViewChange(item.id)}
                className="flex-1 flex-col gap-1 h-16 rounded-none"
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}