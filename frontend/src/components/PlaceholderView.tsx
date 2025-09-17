import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Calendar, Users, TrendingUp, Plus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface PlaceholderViewProps {
  view: string;
}

export function PlaceholderView({ view }: PlaceholderViewProps) {
  const getViewConfig = (viewType: string) => {
    const configs: Record<string, { icon: LucideIcon; title: string; description: string; action: string; comingSoon: boolean }> = {
      events: {
        icon: Calendar,
        title: 'Events',
        description: 'Discover and join upcoming hackathons, workshops, and networking sessions.',
        action: 'Browse Events',
        comingSoon: true,
      },
      teams: {
        icon: Users,
        title: 'Teams',
        description: 'Find teammates for your projects or join existing teams looking for your skills.',
        action: 'Find Teams',
        comingSoon: true,
      },
      trending: {
        icon: TrendingUp,
        title: 'Trending',
        description: "See what's popular right now - trending posts, hot topics, and viral content.",
        action: 'Explore Trending',
        comingSoon: true,
      },
    };

    return configs[viewType] || {
      icon: Calendar,
      title: 'Coming Soon',
      description: 'This feature is under development.',
      action: 'Stay Tuned',
      comingSoon: true,
    };
  };

  const config = getViewConfig(view);
  const Icon = config.icon;

  const handleCreateEventClick = () => {
    // TODO: Implement modal opening logic
    console.log('Create Event button clicked');
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="mt-8">
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Icon className="w-8 h-8 text-primary" />
            </div>
            
            <div className="space-y-2 flex flex-col items-center">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold">{config.title}</h2>
                {view === 'events'}
              </div>
              <Button size="sm" onClick={handleCreateEventClick}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
              <p className="text-muted-foreground max-w-md mx-auto">
                {config.description}
              </p>
            </div>

           

            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                💡 Have suggestions for this feature? Share them in the main feed!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Cards for Different Features */}
      {view === 'events' && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold">Upcoming Features</h3>
          <div className="grid gap-4">
            <Card className="opacity-50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Event Calendar</p>
                    <p className="text-sm text-muted-foreground">View all events in a calendar format</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="opacity-50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Event Registration</p>
                    <p className="text-sm text-muted-foreground">Sign up for events and manage attendance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {view === 'teams' && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold">Team Features Preview</h3>
          <div className="grid gap-4">
            <Card className="opacity-50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Team Matching</p>
                    <p className="text-sm text-muted-foreground">AI-powered team recommendations based on skills</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="opacity-50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <Plus className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium">Create Teams</p>
                    <p className="text-sm text-muted-foreground">Start your own team and recruit members</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}