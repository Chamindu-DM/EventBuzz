import { useState, useEffect } from 'react';
import { PostForm } from './PostForm';
import { Post } from './Post';
import { EventHeader } from './EventHeader';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';
import { RefreshCw } from 'lucide-react';

// Define interfaces for our data structure
interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: Date;
}

interface PollOption {
  id: number;
  text: string;
  votes: number;
}

interface PostData {
  id: string;
  author: string;
  avatar: string;
  timestamp: Date;
  content: string;
  type: 'text' | 'image' | 'poll';
  imageUrl?: string;
  pollQuestion?: string;
  pollOptions?: PollOption[];
  totalVotes?: number;
  likes: number;
  comments: Comment[];
  userLiked?: boolean;
  userVoted?: number;
}

// Mock initial posts data
const initialPosts = [
  {
    id: '1',
    author: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b6b0f66d?w=100&h=100&fit=crop&crop=face',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    content: 'Just submitted our project! 🎉 Working on an AI-powered sustainability tracker. Super excited to present tomorrow!',
    type: 'text' as const,
    likes: 12,
    comments: [
      {
        id: 'c1',
        author: 'Mike Johnson',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        content: 'Awesome work Sarah! Can\'t wait to see the demo',
        timestamp: new Date(Date.now() - 1000 * 60 * 10)
      }
    ],
    userLiked: false
  },
  {
    id: '2',
    author: 'Tech Team Alpha',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
    content: 'Our workspace is getting intense! Coffee count: ☕☕☕☕☕',
    type: 'image' as const,
    imageUrl: 'https://images.unsplash.com/photo-1565687981296-535f09db714e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWNrYXRob24lMjBjb2RpbmclMjBldmVudHxlbnwxfHx8fDE3NTgxMDcyODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    likes: 8,
    comments: [],
    userLiked: true
  },
  {
    id: '3',
    author: 'Event Organizers',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    timestamp: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
    content: '',
    type: 'poll' as const,
    pollQuestion: 'What\'s your biggest challenge so far?',
    pollOptions: [
      { id: 0, text: 'Technical implementation', votes: 15 },
      { id: 1, text: 'Team coordination', votes: 8 },
      { id: 2, text: 'Time management', votes: 23 },
      { id: 3, text: 'Scope creep', votes: 4 }
    ],
    totalVotes: 50,
    likes: 5,
    comments: [
      {
        id: 'c2',
        author: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face',
        content: 'Time management is definitely the hardest part!',
        timestamp: new Date(Date.now() - 1000 * 60 * 80)
      }
    ],
    userLiked: false,
    userVoted: 2
  }
];

interface HomeFeedProps {
  onNewNotification?: () => void;
}

export function HomeFeed({ onNewNotification }: HomeFeedProps) {
  const [posts, setPosts] = useState<PostData[]>(initialPosts);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update likes or add comments to simulate activity
      setPosts(currentPosts => 
        currentPosts.map(post => {
          if (Math.random() < 0.1) { // 10% chance per post per interval
            const wasLiked = post.likes;
            const newLikes = post.likes + (Math.random() < 0.5 ? 1 : 0);
            
            // Trigger notification if someone liked your post
            if (newLikes > wasLiked && onNewNotification) {
              onNewNotification();
            }
            
            return {
              ...post,
              likes: newLikes
            };
          }
          return post;
        })
      );
    }, 15000); // Every 15 seconds

    return () => clearInterval(interval);
  }, [onNewNotification]);

  const handleNewPost = (newPost: PostData) => {
    setPosts([newPost, ...posts]);
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes: post.userLiked ? post.likes - 1 : post.likes + 1,
            userLiked: !post.userLiked 
          }
        : post
    ));
  };

  const handleComment = (postId: string, commentText: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      author: 'Current User',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      content: commentText,
      timestamp: new Date()
    };

    setPosts(prevPosts => prevPosts.map(post => 
      post.id === postId 
        ? { ...post, comments: [...post.comments, newComment] }
        : post
    ));
  };

  const handleVote = (postId: string, optionId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId && post.type === 'poll' && post.pollOptions) {
        const updatedOptions = post.pollOptions.map(option =>
          option.id === optionId
            ? { ...option, votes: option.votes + 1 }
            : option
        );
        
        return {
          ...post,
          pollOptions: updatedOptions,
          totalVotes: (post.totalVotes || 0) + 1,
          userVoted: optionId
        };
      }
      return post;
    }));
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <EventHeader 
        eventName="TechHacks 2025"
        eventDate="March 15-17, 2025"
        location="University Innovation Center"
        participantCount={156}
      />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-primary">Live Feed</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="border-primary/30 text-primary hover:bg-primary/10"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <PostForm onPost={handleNewPost} />

      <ScrollArea className="h-[calc(100vh-300px)]">
        <div className="space-y-4">
          {posts.map(post => (
            <Post
              key={post.id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
              onVote={handleVote}
            />
          ))}
        </div>
      </ScrollArea>

      <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg text-center">
        <p className="text-sm text-primary/80">
          🔄 Feed updates automatically • Last updated: {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}