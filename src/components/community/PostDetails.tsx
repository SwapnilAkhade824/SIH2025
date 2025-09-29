import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  X, 
  Heart, 
  MessageCircle, 
  Share2, 
  Send,
  Star,
  Crown,
  TrendingUp,
  Users,
  Clock,
  MapPin,
  Tag
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: number;
  user: {
    name: string;
    avatar: string;
    level: string;
  };
  content: string;
  timeAgo: string;
  likes: number;
}

interface PostDetailsProps {
  post: any;
  onClose: () => void;
}

export function PostDetails({ post, onClose }: PostDetailsProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      user: { name: "Anita Krishnan", avatar: "A", level: "Expert" },
      content: "Absolutely beautiful! The symmetry is perfect. How long did this take you?",
      timeAgo: "2 hours ago",
      likes: 12
    },
    {
      id: 2,
      user: { name: "Ravi Shankar", avatar: "R", level: "Master" },
      content: "This reminds me of the kolams my grandmother used to make. Traditional yet elegant!",
      timeAgo: "4 hours ago",
      likes: 8
    },
    {
      id: 3,
      user: { name: "Deepika Nair", avatar: "D", level: "Intermediate" },
      content: "Could you share the technique for getting such clean lines? I'm still learning.",
      timeAgo: "6 hours ago",
      likes: 5
    }
  ]);
  const { toast } = useToast();

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "Master": return <Crown className="w-4 h-4 text-kolam-gold" />;
      case "Expert": return <Star className="w-4 h-4 text-purple-600" />;
      case "Intermediate": return <TrendingUp className="w-4 h-4 text-blue-600" />;
      default: return <Users className="w-4 h-4 text-green-600" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Traditional": return "bg-primary/10 text-primary";
      case "Digital": return "bg-blue-100 text-blue-700";
      case "Competition": return "bg-purple-100 text-purple-700";
      case "Learning": return "bg-green-100 text-green-700";
      case "Innovation": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    
    toast({
      title: isLiked ? "Removed Like" : "Liked!",
      description: isLiked ? "You unliked this post" : "You liked this post"
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(`Check out this amazing kolam: ${post.title}`);
    toast({
      title: "Link Copied!",
      description: "Post link copied to clipboard"
    });
  };

  const handleComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: comments.length + 1,
      user: { name: "You", avatar: "Y", level: "Intermediate" },
      content: newComment,
      timeAgo: "Just now",
      likes: 0
    };

    setComments(prev => [comment, ...prev]);
    setNewComment("");
    
    toast({
      title: "Comment Added!",
      description: "Your comment has been posted"
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="card-traditional w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b border-primary/10">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <span>{post.title}</span>
              {post.featured && <Star className="w-5 h-5 text-kolam-gold" />}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <div className="grid md:grid-cols-2 h-[calc(90vh-120px)]">
          {/* Image Section */}
          <div className="relative bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-traditional font-semibold text-primary mb-2">
                {post.title}
              </h3>
              <p className="text-muted-foreground">
                Beautiful kolam pattern
              </p>
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col">
            {/* Post Info */}
            <div className="p-6 border-b border-primary/10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold">
                    {post.user.avatar}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-primary">{post.user.name}</h3>
                      {getLevelIcon(post.user.level)}
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{post.user.location}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getCategoryColor(post.category)}>
                    {post.category}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{post.timeAgo}</span>
                  </p>
                </div>
              </div>

              <p className="text-muted-foreground mb-4">{post.description}</p>

              {/* Tags */}
              {post.tags && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={handleLike}
                    className={`flex items-center space-x-2 transition-colors ${
                      isLiked ? 'text-red-500' : 'hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{likeCount}</span>
                  </button>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <MessageCircle className="w-5 h-5" />
                    <span>{comments.length}</span>
                  </div>
                  <button 
                    onClick={handleShare}
                    className="flex items-center space-x-2 hover:text-green-500 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                </div>
                
                {post.difficulty && (
                  <Badge variant="outline">
                    {post.difficulty}
                  </Badge>
                )}
              </div>
            </div>

            {/* Comments Section */}
            <div className="flex-1 flex flex-col">
              <div className="p-4 border-b border-primary/10">
                <h4 className="font-semibold text-primary mb-3">Comments ({comments.length})</h4>
                
                {/* Add Comment */}
                <div className="flex space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    Y
                  </div>
                  <div className="flex-1 flex space-x-2">
                    <Input
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                    />
                    <Button size="sm" onClick={handleComment} disabled={!newComment.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-sm font-semibold">
                      {comment.user.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">{comment.user.name}</span>
                        {getLevelIcon(comment.user.level)}
                        <span className="text-xs text-muted-foreground">{comment.timeAgo}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{comment.content}</p>
                      <div className="flex items-center space-x-2">
                        <button className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-red-500 transition-colors">
                          <Heart className="w-3 h-3" />
                          <span>{comment.likes}</span>
                        </button>
                        <button className="text-xs text-muted-foreground hover:text-primary transition-colors">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
