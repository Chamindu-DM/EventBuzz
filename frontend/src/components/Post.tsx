import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { Heart, MessageCircle, Share, Clock } from 'lucide-react';

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

interface PostProps {
  post: PostData;
  onLike: (postId: string) => void;
  onComment: (postId: string, comment: string) => void;
  onVote: (postId: string, optionId: number) => void;
}

export function Post({ post, onLike, onComment, onVote }: PostProps) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');

  const handleComment = () => {
    if (newComment.trim()) {
      onComment(post.id, newComment);
      setNewComment('');
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  const getVotePercentage = (votes: number) => {
    if (!post.totalVotes || post.totalVotes === 0) return 0;
    return (votes / post.totalVotes) * 100;
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            <AvatarImage src={post.avatar} />
            <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium">{post.author}</p>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span className="text-sm">{formatTime(post.timestamp)}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        {post.type === 'poll' && post.pollQuestion && (
          <div className="mb-4">
            <h3 className="mb-3">{post.pollQuestion}</h3>
            <div className="space-y-2">
              {post.pollOptions?.map((option) => (
                <div key={option.id} className="space-y-1">
                  <Button
                    variant={post.userVoted === option.id ? "default" : "outline"}
                    className={`w-full justify-start h-auto p-3 ${post.userVoted === option.id ? 'bg-primary text-primary-foreground' : 'hover:border-primary/50'}`}
                    onClick={() => post.userVoted === undefined && onVote(post.id, option.id)}
                    disabled={post.userVoted !== undefined}
                  >
                    <div className="w-full text-left">
                      <div className="flex justify-between items-center">
                        <span>{option.text}</span>
                        {post.userVoted !== undefined && (
                          <span className="text-sm">
                            {option.votes} votes ({Math.round(getVotePercentage(option.votes))}%)
                          </span>
                        )}
                      </div>
                      {post.userVoted !== undefined && (
                        <Progress value={getVotePercentage(option.votes)} className="mt-2 h-2" />
                      )}
                    </div>
                  </Button>
                </div>
              ))}
            </div>
            {post.totalVotes !== undefined && post.totalVotes > 0 && (
              <p className="text-sm text-muted-foreground mt-2">
                {post.totalVotes} total votes
              </p>
            )}
          </div>
        )}

        {post.content && (
          <p className="mb-4 whitespace-pre-wrap">{post.content}</p>
        )}

        {post.type === 'image' && post.imageUrl && (
          <div className="mb-4">
            <img
              src={post.imageUrl}
              alt="Post image"
              className="w-full max-h-96 object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.src = "https://placehold.co/600x400?text=Image+Not+Found";
              }}
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 py-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike(post.id)}
            className={`flex items-center gap-2 ${post.userLiked ? 'text-primary hover:text-primary' : 'hover:text-primary'}`}
          >
            <Heart className={`w-4 h-4 ${post.userLiked ? 'fill-current' : ''}`} />
            {post.likes}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 hover:text-primary"
          >
            <MessageCircle className="w-4 h-4" />
            {post.comments.length}
          </Button>
          
          <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:text-primary">
            <Share className="w-4 h-4" />
            Share
          </Button>
        </div>

        {/* Comments */}
        {showComments && (
          <div className="border-t pt-4 mt-4">
            <div className="space-y-3 mb-4">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.avatar} />
                    <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-muted p-3 rounded-lg">
                      <p className="text-sm">{comment.author}</p>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTime(comment.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleComment()}
              />
              <Button onClick={handleComment} disabled={!newComment.trim()}>
                Post
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}