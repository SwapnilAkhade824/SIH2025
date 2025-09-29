import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; 
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Heart, 
  MessageCircle, 
  Share2, 
  Trophy, 
  Star,
  Upload,
  Filter,
  Search,
  Flame,
  TrendingUp,
  Crown
} from "lucide-react";
import { ShareDesign } from "@/components/community/ShareDesign";
import { PostDetails } from "@/components/community/PostDetails";
import { ChallengeModal } from "@/components/community/ChallengeModal";
import { useToast } from "@/hooks/use-toast";

const posts = [
  {
    id: 1,
    user: {
      name: "Priya Sharma",
      avatar: "P",
      level: "Master",
      location: "Chennai, Tamil Nadu"
    },
    image: "/api/placeholder/300/300",
    title: "Festival Kolam for Pongal",
    description: "Traditional 13-dot kolam with rice flour and colored powders. Took 2 hours to complete!",
    category: "Traditional",
    likes: 142,
    comments: 23,
    shares: 8,
    timeAgo: "2 hours ago",
    featured: true
  },
  {
    id: 2,
    user: {
      name: "Rajesh Kumar",
      avatar: "R", 
      level: "Intermediate",
      location: "Bangalore, Karnataka"
    },
    image: "/api/placeholder/300/300",
    title: "Digital Kolam Creation",
    description: "Created this geometric pattern using KOLAM AI tools. Perfect symmetry achieved!",
    category: "Digital",
    likes: 89,
    comments: 15,
    shares: 12,
    timeAgo: "5 hours ago",
    featured: false
  },
  {
    id: 3,
    user: {
      name: "Meena Iyer",
      avatar: "M",
      level: "Expert", 
      location: "Madurai, Tamil Nadu"
    },
    image: "/api/placeholder/300/300",
    title: "Competition Entry - Lotus Mandala",
    description: "My entry for the Monthly Pattern Challenge. 25-dot complex design with temple architecture inspiration.",
    category: "Competition",
    likes: 267,
    comments: 45,
    shares: 31,
    timeAgo: "1 day ago",
    featured: true
  }
];

const challenges = [
  {
    id: 1,
    title: "Monthly Pattern Challenge",
    description: "Create a kolam inspired by South Indian temples",
    longDescription: "Design a traditional kolam pattern that draws inspiration from the magnificent architecture of South Indian temples. Focus on geometric patterns, symmetrical designs, and incorporate elements like lotus motifs, temple pillars, or gopuram-inspired structures.",
    prize: "₹5000 + Featured Profile",
    participants: 156,
    daysLeft: 12,
    type: "Competition",
    difficulty: "Advanced",
    requirements: [
      "Original kolam design inspired by temple architecture",
      "Minimum 15-dot complexity",
      "High-quality image (1024x1024 pixels minimum)",
      "Description of temple inspiration source",
      "Traditional materials preferred (rice flour, colored powders)"
    ],
    rules: [
      "One submission per participant",
      "Must be original work created during challenge period",
      "No AI-generated content",
      "Voting by community members",
      "Winner announced after 3-day voting period"
    ]
  },
  {
    id: 2,
    title: "Beginner Friendly Week",
    description: "Simple 5-dot patterns for newcomers",
    longDescription: "Perfect for those just starting their kolam journey! Create beautiful yet simple patterns using basic 5-dot grids. Learn fundamental techniques and share your first kolam creations with our supportive community.",
    prize: "Recognition Badge + Learning Resources",
    participants: 89,
    daysLeft: 5,
    type: "Learning",
    difficulty: "Beginner",
    requirements: [
      "5-dot grid pattern",
      "Clear step-by-step photos",
      "Brief description of learning experience",
      "Any materials welcome"
    ],
    rules: [
      "Open to beginners only",
      "Multiple submissions allowed",
      "Focus on learning, not competition",
      "Community feedback encouraged"
    ]
  },
  {
    id: 3,
    title: "Innovation Contest",
    description: "Modern twist on traditional designs",
    longDescription: "Blend tradition with innovation! Create kolam patterns that respect traditional principles while incorporating modern elements, digital tools, or contemporary themes. Show how ancient art can evolve with the times.",
    prize: "AI Analysis Tool Access + Digital Art Kit",
    participants: 234,
    daysLeft: 20,
    type: "Innovation",
    difficulty: "Intermediate",
    requirements: [
      "Traditional kolam base with modern elements",
      "Digital or physical creation accepted",
      "Innovation explanation required",
      "Respect for traditional values"
    ],
    rules: [
      "Must maintain kolam essence",
      "Innovation clearly explained",
      "Digital tools allowed",
      "Judged on creativity and respect for tradition"
    ]
  }
];

const categories = ["All", "Traditional", "Digital", "Competition", "Learning", "Innovation"];

export default function Community() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [communityPosts, setCommunityPosts] = useState(posts);
  const [communityStats, setCommunityStats] = useState({
    activeMembers: 15200,
    designsShared: 3400,
    activeContests: 28,
    totalLikes: 89000
  });
  const { toast } = useToast();

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

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "Master": return <Crown className="w-4 h-4 text-kolam-gold" />;
      case "Expert": return <Star className="w-4 h-4 text-purple-600" />;
      case "Intermediate": return <TrendingUp className="w-4 h-4 text-blue-600" />;
      default: return <Users className="w-4 h-4 text-green-600" />;
    }
  };

  const handleShareDesign = (newDesign: any) => {
    setCommunityPosts(prev => [newDesign, ...prev]);
    setCommunityStats(prev => ({
      ...prev,
      designsShared: prev.designsShared + 1
    }));
  };

  const handleLikePost = (postId: number) => {
    setCommunityPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
    setCommunityStats(prev => ({
      ...prev,
      totalLikes: prev.totalLikes + 1
    }));
  };

  const handleJoinChallenge = (challengeId: number) => {
    toast({
      title: "Challenge Joined!",
      description: "You're now participating in this challenge"
    });
  };

  const filteredPosts = communityPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-traditional font-bold text-primary">
          Community Hub
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Connect with kolam enthusiasts worldwide. Share your creations, participate in challenges, 
          and celebrate the beauty of traditional South Indian art.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="analysis-card text-center">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold text-primary">{(communityStats.activeMembers / 1000).toFixed(1)}K</span>
            </div>
            <div className="text-sm text-muted-foreground">Active Members</div>
          </CardContent>
        </Card>
        <Card className="analysis-card text-center">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Upload className="w-5 h-5 text-accent" />
              <span className="text-2xl font-bold text-primary">{(communityStats.designsShared / 1000).toFixed(1)}K</span>
            </div>
            <div className="text-sm text-muted-foreground">Designs Shared</div>
          </CardContent>
        </Card>
        <Card className="analysis-card text-center">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Trophy className="w-5 h-5 text-kolam-gold" />
              <span className="text-2xl font-bold text-primary">{communityStats.activeContests}</span>
            </div>
            <div className="text-sm text-muted-foreground">Active Contests</div>
          </CardContent>
        </Card>
        <Card className="analysis-card text-center">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="text-2xl font-bold text-primary">{(communityStats.totalLikes / 1000).toFixed(0)}K</span>
            </div>
            <div className="text-sm text-muted-foreground">Total Likes</div>
          </CardContent>
        </Card>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-gradient-to-r from-primary to-accent text-primary-foreground" : ""}
            >
              {category}
            </Button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Search posts, users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button size="sm" variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-primary to-accent text-primary-foreground"
            onClick={() => setShowShareModal(true)}
          >
            <Upload className="w-4 h-4 mr-2" />
            Share Design
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-traditional font-bold text-primary flex items-center space-x-2">
            <Flame className="w-6 h-6 text-orange-500" />
            <span>Community Feed</span>
          </h2>

          {filteredPosts.map((post) => (
            <Card key={post.id} className="card-traditional">
              {post.featured && (
                <div className="bg-gradient-to-r from-kolam-gold to-accent p-2 rounded-t-2xl">
                  <p className="text-center text-white font-medium text-sm flex items-center justify-center space-x-2">
                    <Star className="w-4 h-4" />
                    <span>Featured Post</span>
                  </p>
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-semibold">
                      {post.user.avatar}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-primary">{post.user.name}</h3>
                        {getLevelIcon(post.user.level)}
                      </div>
                      <p className="text-sm text-muted-foreground">{post.user.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getCategoryColor(post.category)}>
                      {post.category}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{post.timeAgo}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Image Placeholder */}
                <div className="aspect-square bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-primary/10 flex items-center justify-center">
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-primary/40 mx-auto mb-2" />
                    <p className="text-primary/60 font-medium">{post.title}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-primary mb-2">{post.title}</h3>
                  <p className="text-muted-foreground">{post.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-primary/10">
                  <div className="flex items-center space-x-6">
                    <button 
                      onClick={() => handleLikePost(post.id)}
                      className="flex items-center space-x-2 hover:text-red-500 transition-colors"
                    >
                      <Heart className="w-5 h-5" />
                      <span>{post.likes}</span>
                    </button>
                    <button 
                      onClick={() => setSelectedPost(post)}
                      className="flex items-center space-x-2 hover:text-blue-500 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span>{post.comments}</span>
                    </button>
                    <button className="flex items-center space-x-2 hover:text-green-500 transition-colors">
                      <Share2 className="w-5 h-5" />
                      <span>{post.shares}</span>
                    </button>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setSelectedPost(post)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Active Challenges */}
          <Card className="card-traditional">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-primary" />
                <span>Active Challenges</span>
              </CardTitle>
              <CardDescription>
                Participate and win exciting prizes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {challenges.map((challenge, index) => (
                <div 
                  key={index} 
                  className="p-3 border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer"
                  onClick={() => setSelectedChallenge(challenge)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-primary text-sm">{challenge.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {challenge.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {challenge.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{challenge.participants} participants</span>
                    <span>{challenge.daysLeft} days left</span>
                  </div>
                  <p className="text-sm font-medium text-kolam-gold mt-1">
                    Prize: {challenge.prize}
                  </p>
                </div>
              ))}
              <Button size="sm" className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground">
                View All Challenges
              </Button>
            </CardContent>
          </Card>

          {/* Top Contributors */}
          <Card className="card-traditional">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-kolam-gold" />
                <span>Top Contributors</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "Lakshmi Devi", posts: 89, likes: "12.4K", level: "Master" },
                { name: "Arjun Pillai", posts: 67, likes: "9.8K", level: "Expert" },
                { name: "Kavya Menon", posts: 54, likes: "7.2K", level: "Expert" }
              ].map((user, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-primary/5">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {user.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-sm">{user.name}</p>
                      {getLevelIcon(user.level)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {user.posts} posts • {user.likes} likes
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="card-traditional">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button size="sm" variant="outline" className="w-full justify-start">
                <Upload className="w-4 h-4 mr-2" />
                Share Your Design
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start">
                <Trophy className="w-4 h-4 mr-2" />
                Join Challenge
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Find Friends
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start">
                <MessageCircle className="w-4 h-4 mr-2" />
                Join Discussion
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      {showShareModal && (
        <ShareDesign
          onClose={() => setShowShareModal(false)}
          onShare={handleShareDesign}
        />
      )}

      {selectedPost && (
        <PostDetails
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}

      {selectedChallenge && (
        <ChallengeModal
          challenge={selectedChallenge}
          onClose={() => setSelectedChallenge(null)}
          onParticipate={handleJoinChallenge}
        />
      )}
    </div>
  );
}