import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { CheckCircle, Sparkles, Users, Calendar, TrendingUp, ArrowRight } from 'lucide-react';

interface WelcomeScreenProps {
  onComplete: () => void;
  userData: any;
}

const features = [
  {
    icon: Users,
    title: 'Connect with Peers',
    description: 'Find teammates and collaborators for your projects'
  },
  {
    icon: Calendar,
    title: 'Discover Events',
    description: 'Stay updated on hackathons, workshops, and networking opportunities'
  },
  {
    icon: TrendingUp,
    title: 'Share Your Journey',
    description: 'Post updates, photos, and polls to engage with the community'
  }
];

const tips = [
  'Complete your profile to get better team recommendations',
  'Join conversations by commenting and liking posts',
  'Share your project progress to inspire others',
  'Use polls to gather feedback from the community'
];

export function WelcomeScreen({ onComplete, userData }: WelcomeScreenProps) {
  const [currentTip, setCurrentTip] = useState(0);

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % tips.length);
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-primary-foreground" />
        </div>
        <CardTitle className="text-2xl">Welcome to EventWall!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Info Summary */}
        <div className="text-center space-y-3">
          <Avatar className="w-20 h-20 mx-auto">
            <AvatarImage src={userData.profileImage} />
            <AvatarFallback className="text-lg">
              {userData.firstName?.[0]}{userData.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">
              {userData.firstName} {userData.lastName}
            </h3>
            <p className="text-muted-foreground">
              {userData.year && userData.major ? `${userData.year} • ${userData.major}` : userData.university}
            </p>
            <p className="text-sm text-muted-foreground">{userData.university}</p>
          </div>
          
          {userData.skills && userData.skills.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1 mt-3">
              {userData.skills.slice(0, 4).map((skill: string) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {userData.skills.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{userData.skills.length - 4} more
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Welcome Features */}
        <div className="space-y-4">
          <h4 className="text-center font-semibold">What you can do on EventWall:</h4>
          <div className="space-y-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-primary/5">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">{feature.title}</h5>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="space-y-3">
          <h4 className="text-center font-semibold">Quick Tips:</h4>
          <div className="p-4 bg-muted/30 rounded-lg border-l-4 border-primary">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <p className="text-sm">{tips[currentTip]}</p>
            </div>
            <div className="flex justify-between items-center mt-3">
              <div className="flex gap-1">
                {tips.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentTip ? 'bg-primary' : 'bg-primary/20'
                    }`}
                  />
                ))}
              </div>
              <Button variant="ghost" size="sm" onClick={nextTip}>
                Next tip
              </Button>
            </div>
          </div>
        </div>

        {/* Setup Complete Badge */}
        <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
          <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-green-700 dark:text-green-400">
            Your profile is all set up!
          </p>
          <p className="text-xs text-green-600 dark:text-green-500 mt-1">
            You're ready to start connecting and collaborating
          </p>
        </div>

        {/* Call to Action */}
        <Button onClick={onComplete} className="w-full" size="lg">
          Start Exploring
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          You can always update your profile later in settings
        </p>
      </CardContent>
    </Card>
  );
}