import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CalendarIcon, Clock, MapPin, User, FileText, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useAuth } from './auth/AuthContext';

interface EventCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventCreated?: (event: any) => void;
}

const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? '00' : '30';
  const period = hour < 12 ? 'AM' : 'PM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return {
    value: `${hour.toString().padStart(2, '0')}:${minute}`,
    label: `${displayHour}:${minute} ${period}`
  };
});

const eventTypes = [
  'Hackathon',
  'Workshop',
  'Networking',
  'Presentation',
  'Meeting',
  'Social',
  'Competition',
  'Other'
];

const venueOptions = [
  'Main Auditorium',
  'Conference Room A',
  'Conference Room B',
  'Workshop Space',
  'Innovation Lab',
  'Outdoor Pavilion',
  'Student Center',
  'Library Meeting Room',
  'Virtual/Online',
  'Other'
];

export function EventCreateModal({ open, onOpenChange, onEventCreated }: EventCreateModalProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: undefined as Date | undefined,
    startTime: '',
    endTime: '',
    venue: '',
    customVenue: '',
    eventType: '',
    maxParticipants: '',
    registrationRequired: false,
    tags: [] as string[],
    owner: user?.id || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newTag, setNewTag] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required';
    }

    if (!formData.date) {
      newErrors.date = 'Event date is required';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'End time must be after start time';
    }

    if (!formData.venue && !formData.customVenue) {
      newErrors.venue = 'Venue is required';
    }

    if (!formData.eventType) {
      newErrors.eventType = 'Event type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const eventData = {
        ...formData,
        venue: formData.venue === 'Other' ? formData.customVenue : formData.venue,
        owner: user?.id,
        ownerName: `${user?.firstName} ${user?.lastName}`,
        ownerEmail: user?.email,
        createdAt: new Date(),
        id: Date.now().toString() // In real app, this would come from backend
      };

      // TODO: Replace with actual API call
      // const response = await fetch('/api/events', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(eventData)
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to create event');
      // }
      // 
      // const createdEvent = await response.json();
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Event created successfully!');
      onEventCreated?.(eventData);
      onOpenChange(false);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        date: undefined,
        startTime: '',
        endTime: '',
        venue: '',
        customVenue: '',
        eventType: '',
        maxParticipants: '',
        registrationRequired: false,
        tags: [],
        owner: user?.id || ''
      });
      setErrors({});
    } catch (error) {
      toast.error('Failed to create event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      updateField('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateField('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Plus className="w-4 h-4 text-primary-foreground" />
            </div>
            Create New Event
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Event Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Enter event title"
              className={errors.title ? 'border-destructive' : ''}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          {/* Event Type */}
          <div className="space-y-2">
            <Label htmlFor="eventType">Event Type *</Label>
            <Select value={formData.eventType} onValueChange={(value) => updateField('eventType', value)}>
              <SelectTrigger className={errors.eventType ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.eventType && (
              <p className="text-sm text-destructive">{errors.eventType}</p>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Date */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Date *
              </Label>
              <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !formData.date ? 'text-muted-foreground' : ''
                    } ${errors.date ? 'border-destructive' : ''}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => {
                      updateField('date', date);
                      setCalendarOpen(false);
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date}</p>
              )}
            </div>

            {/* Start Time */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Start Time *
              </Label>
              <Select value={formData.startTime} onValueChange={(value) => updateField('startTime', value)}>
                <SelectTrigger className={errors.startTime ? 'border-destructive' : ''}>
                  <SelectValue placeholder="Start time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time.value} value={time.value}>
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.startTime && (
                <p className="text-sm text-destructive">{errors.startTime}</p>
              )}
            </div>

            {/* End Time */}
            <div className="space-y-2">
              <Label>End Time *</Label>
              <Select value={formData.endTime} onValueChange={(value) => updateField('endTime', value)}>
                <SelectTrigger className={errors.endTime ? 'border-destructive' : ''}>
                  <SelectValue placeholder="End time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time.value} value={time.value}>
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.endTime && (
                <p className="text-sm text-destructive">{errors.endTime}</p>
              )}
            </div>
          </div>

          {/* Venue */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Venue *
            </Label>
            <Select value={formData.venue} onValueChange={(value) => updateField('venue', value)}>
              <SelectTrigger className={errors.venue ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select venue" />
              </SelectTrigger>
              <SelectContent>
                {venueOptions.map((venue) => (
                  <SelectItem key={venue} value={venue}>{venue}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {formData.venue === 'Other' && (
              <Input
                value={formData.customVenue}
                onChange={(e) => updateField('customVenue', e.target.value)}
                placeholder="Enter custom venue"
                className="mt-2"
              />
            )}
            
            {errors.venue && (
              <p className="text-sm text-destructive">{errors.venue}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Describe your event, agenda, requirements, etc."
              className="min-h-[100px]"
            />
          </div>

          {/* Additional Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxParticipants">Max Participants (Optional)</Label>
              <Input
                id="maxParticipants"
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => updateField('maxParticipants', e.target.value)}
                placeholder="e.g., 50"
                min="1"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Event Owner
              </Label>
              <Input
                value={`${user?.firstName} ${user?.lastName}`}
                disabled
                className="bg-muted"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags (Optional)</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                Add
              </Button>
            </div>
            
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-primary hover:text-primary/70"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating Event...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}