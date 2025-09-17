import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { ImagePlus, BarChart3, Send } from 'lucide-react';

interface PostFormProps {
  onPost: (post: any) => void;
}

export function PostForm({ onPost }: PostFormProps) {
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('text');
  const [imageUrl, setImageUrl] = useState('');
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() && postType === 'text') return;
    if (postType === 'poll' && (!pollQuestion.trim() || pollOptions.some(opt => !opt.trim()))) return;

    const newPost = {
      id: Date.now().toString(),
      author: 'Current User',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      timestamp: new Date(),
      likes: 0,
      comments: [],
      type: postType,
      content: content,
      ...(postType === 'image' && imageUrl && { imageUrl }),
      ...(postType === 'poll' && {
        pollQuestion,
        pollOptions: pollOptions.map((option, index) => ({
          id: index,
          text: option,
          votes: 0
        })),
        totalVotes: 0
      })
    };

    onPost(newPost);
    setContent('');
    setImageUrl('');
    setPollQuestion('');
    setPollOptions(['', '']);
    setPostType('text');
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit}>
          <Tabs value={postType} onValueChange={setPostType}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="text">Text</TabsTrigger>
              <TabsTrigger value="image"><ImagePlus className="w-4 h-4 mr-2" />Photo</TabsTrigger>
              <TabsTrigger value="poll"><BarChart3 className="w-4 h-4 mr-2" />Poll</TabsTrigger>
            </TabsList>

            <TabsContent value="text" className="space-y-4">
              <Textarea
                placeholder="What's happening at the event?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px]"
              />
            </TabsContent>

            <TabsContent value="image" className="space-y-4">
              <Textarea
                placeholder="Share a photo from the event..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[80px]"
              />
              <Input
                placeholder="Image URL (or upload functionality would go here)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              {imageUrl && (
                <div className="mt-4">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full max-w-md h-48 object-cover rounded-lg"
                  />
                </div>
              )}
            </TabsContent>

            <TabsContent value="poll" className="space-y-4">
              <Input
                placeholder="Ask a question..."
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
              />
              <div className="space-y-2">
                {pollOptions.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => updatePollOption(index, e.target.value)}
                    />
                    {pollOptions.length > 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removePollOption(index)}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
                {pollOptions.length < 4 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addPollOption}
                    className="w-full"
                  >
                    Add Option
                  </Button>
                )}
              </div>
              <Textarea
                placeholder="Additional context (optional)"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[60px]"
              />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-4">
            <Button type="submit" className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Post
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}