import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, MapPin, Users, Wifi } from "lucide-react";

interface EventHeaderProps {
  eventName: string;
  eventDate: string;
  location: string;
  participantCount: number;
}

export function EventHeader({
  eventName,
  eventDate,
  location,
  participantCount,
}: EventHeaderProps) {
  return (
    <Card className="mb-6 bg-gradient-to-r from-primary/10 to-blue-50 border-primary/20">
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <div>
            <h1 className="text-3xl font-bold">{eventName}</h1>
            <div className="flex items-center justify-center gap-4 mt-2 text-primary/70">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{eventDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{participantCount} participants</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            <Badge className="flex items-center gap-1 bg-primary text-primary-foreground">
              <Wifi className="w-3 h-3" />
              Live Feed
            </Badge>
            <Badge
              variant="outline"
              className="border-primary/30 text-primary"
            >
              Real-time Updates
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}