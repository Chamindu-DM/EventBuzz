import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { User, Camera, Plus, X, Code, Palette, Brain, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileSetupProps {
  onComplete: (data: any) => void;
  userData: any;
}

const skillCategories = {
  'Development': ['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'Go', 'Rust', 'Java'],
  'Design': ['UI/UX', 'Figma', 'Adobe Creative Suite', 'Sketch', 'Prototyping', 'User Research'],
  'Data': ['Machine Learning', 'Data Analysis', 'SQL', 'R', 'TensorFlow', 'PyTorch', 'Statistics'],
  'Business': ['Product Management', 'Marketing', 'Strategy', 'Finance', 'Operations', 'Analytics'],
  'Other': ['Project Management', 'Communication', 'Leadership', 'Research', 'Writing']
};

const yearOptions = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate', 'PhD', 'Other'];

export function ProfileSetup({ onComplete, userData }: ProfileSetupProps) {
  const [profileData, setProfileData] = useState({
    bio: '',
    year: '',
    major: '',
    skills: [] as string[],
    interests: '',
    githubUsername: '',
    linkedinUrl: '',
    portfolioUrl: '',
    profileImage: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const addSkill = (skill: string) => {
    if (skill && !profileData.skills.includes(skill)) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
    setNewSkill('');
  };

  const removeSkill = (skillToRemove: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // TODO: Replace with actual API call
      // const response = await updateUserProfile(userData.email, profileData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Profile setup completed!');
      onComplete(profileData);
    } catch (error) {
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = () => {
    // TODO: Implement image upload functionality
    // This would typically open a file picker and upload to cloud storage
    toast.info('Image upload feature coming soon!');
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-6 h-6 text-primary-foreground" />
        </div>
        <CardTitle>Complete Your Profile</CardTitle>
        <CardDescription>
          Tell us more about yourself to connect with the right people and opportunities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profileData.profileImage} />
              <AvatarFallback className="text-lg">
                {userData.firstName?.[0]}{userData.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleImageUpload}
              className="flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Upload Photo
            </Button>
          </div>

          {/* Academic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Academic Year</Label>
              <Select value={profileData.year} onValueChange={(value) => setProfileData(prev => ({ ...prev, year: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="major">Major/Field of Study</Label>
              <Input
                id="major"
                value={profileData.major}
                onChange={(e) => setProfileData(prev => ({ ...prev, major: e.target.value }))}
                placeholder="Computer Science"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={profileData.bio}
              onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell others about yourself, your interests, and what you're working on..."
              className="min-h-[100px]"
            />
          </div>

          {/* Skills */}
          <div className="space-y-4">
            <Label>Skills & Technologies</Label>
            
            {/* Skill Categories */}
            <div className="space-y-3">
              {Object.entries(skillCategories).map(([category, skills]) => (
                <div key={category} className="space-y-2">
                  <div className="flex items-center gap-2">
                    {category === 'Development' && <Code className="w-4 h-4 text-primary" />}
                    {category === 'Design' && <Palette className="w-4 h-4 text-primary" />}
                    {category === 'Data' && <Brain className="w-4 h-4 text-primary" />}
                    {category === 'Business' && <Zap className="w-4 h-4 text-primary" />}
                    {category === 'Other' && <Plus className="w-4 h-4 text-primary" />}
                    <span className="text-sm font-medium">{category}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Button
                        key={skill}
                        type="button"
                        variant={profileData.skills.includes(skill) ? "default" : "outline"}
                        size="sm"
                        onClick={() => profileData.skills.includes(skill) ? removeSkill(skill) : addSkill(skill)}
                        className="h-8 text-xs"
                      >
                        {skill}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Skill Input */}
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add custom skill..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill(newSkill))}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => addSkill(newSkill)}
                disabled={!newSkill}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Selected Skills */}
            {profileData.skills.length > 0 && (
              <div className="space-y-2">
                <span className="text-sm font-medium">Selected Skills:</span>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => removeSkill(skill)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interests */}
          <div className="space-y-2">
            <Label htmlFor="interests">Interests & Goals</Label>
            <Textarea
              id="interests"
              value={profileData.interests}
              onChange={(e) => setProfileData(prev => ({ ...prev, interests: e.target.value }))}
              placeholder="What are you passionate about? What do you hope to achieve?"
              className="min-h-[80px]"
            />
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <Label>Connect Your Profiles (Optional)</Label>
            <div className="space-y-3">
              <Input
                placeholder="GitHub username"
                value={profileData.githubUsername}
                onChange={(e) => setProfileData(prev => ({ ...prev, githubUsername: e.target.value }))}
              />
              <Input
                placeholder="LinkedIn profile URL"
                value={profileData.linkedinUrl}
                onChange={(e) => setProfileData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
              />
              <Input
                placeholder="Portfolio/website URL"
                value={profileData.portfolioUrl}
                onChange={(e) => setProfileData(prev => ({ ...prev, portfolioUrl: e.target.value }))}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Saving Profile...' : 'Complete Setup'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}