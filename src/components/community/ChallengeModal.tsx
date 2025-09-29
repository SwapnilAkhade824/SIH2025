import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  X, 
  Trophy, 
  Users, 
  Calendar, 
  Target,
  Star,
  CheckCircle,
  Upload,
  Crown,
  Gift
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Challenge {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  prize: string;
  participants: number;
  daysLeft: number;
  type: string;
  difficulty: string;
  requirements: string[];
  rules: string[];
  examples: string[];
  progress?: number;
  isParticipating?: boolean;
}

interface ChallengeModalProps {
  challenge: Challenge;
  onClose: () => void;
  onParticipate: (challengeId: number) => void;
}

export function ChallengeModal({ challenge, onClose, onParticipate }: ChallengeModalProps) {
  const [isParticipating, setIsParticipating] = useState(challenge.isParticipating || false);
  const [showSubmission, setShowSubmission] = useState(false);
  const { toast } = useToast();

  const handleParticipate = () => {
    setIsParticipating(true);
    onParticipate(challenge.id);
    
    toast({
      title: "Joined Challenge!",
      description: `You're now participating in "${challenge.title}"`
    });
  };

  const handleSubmit = () => {
    toast({
      title: "Submission Received!",
      description: "Your entry has been submitted successfully"
    });
    setShowSubmission(false);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Competition": return "bg-purple-100 text-purple-700";
      case "Learning": return "bg-green-100 text-green-700";
      case "Innovation": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-700";
      case "Intermediate": return "bg-yellow-100 text-yellow-700";
      case "Advanced": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="card-traditional w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b border-primary/10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">{challenge.title}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getTypeColor(challenge.type)}>
                      {challenge.type}
                    </Badge>
                    <Badge className={getDifficultyColor(challenge.difficulty)}>
                      {challenge.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-primary mb-3">Challenge Description</h3>
                <p className="text-muted-foreground mb-4">{challenge.longDescription || challenge.description}</p>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="text-lg font-semibold text-primary mb-3">Requirements</h3>
                <ul className="space-y-2">
                  {(challenge.requirements || [
                    "Original kolam design created by you",
                    "High-quality image (minimum 1024x1024 pixels)",
                    "Brief description of inspiration and technique",
                    "Follow traditional kolam principles"
                  ]).map((req, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Rules */}
              <div>
                <h3 className="text-lg font-semibold text-primary mb-3">Rules & Guidelines</h3>
                <ul className="space-y-2">
                  {(challenge.rules || [
                    "One submission per participant",
                    "Submissions must be original work",
                    "No AI-generated content allowed",
                    "Respect traditional kolam values",
                    "Voting period: 3 days after submission deadline"
                  ]).map((rule, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Target className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Examples */}
              <div>
                <h3 className="text-lg font-semibold text-primary mb-3">Inspiration Examples</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2].map((example) => (
                    <div key={example} className="aspect-square bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border border-primary/10 flex items-center justify-center">
                      <div className="text-center">
                        <Star className="w-8 h-8 text-primary/40 mx-auto mb-2" />
                        <p className="text-sm text-primary/60">Example Design {example}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Challenge Stats */}
              <Card className="analysis-card">
                <CardContent className="p-4 space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-1">{challenge.daysLeft}</div>
                    <div className="text-sm text-muted-foreground">Days Remaining</div>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xl font-bold text-accent mb-1">{challenge.participants}</div>
                    <div className="text-sm text-muted-foreground">Participants</div>
                  </div>

                  {challenge.progress !== undefined && (
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{challenge.progress}%</span>
                      </div>
                      <Progress value={challenge.progress} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Prize */}
              <Card className="analysis-card">
                <CardContent className="p-4">
                  <div className="text-center">
                    <Gift className="w-8 h-8 text-kolam-gold mx-auto mb-2" />
                    <h4 className="font-semibold text-primary mb-2">Prize</h4>
                    <p className="text-sm text-muted-foreground">{challenge.prize}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                {!isParticipating ? (
                  <Button onClick={handleParticipate} className="w-full btn-hero">
                    <Trophy className="w-4 h-4 mr-2" />
                    Join Challenge
                  </Button>
                ) : (
                  <>
                    <Button 
                      onClick={() => setShowSubmission(true)} 
                      className="w-full btn-hero"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Submit Entry
                    </Button>
                    <div className="flex items-center justify-center space-x-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>You're participating!</span>
                    </div>
                  </>
                )}
                
                <Button variant="outline" className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  View Participants
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Star className="w-4 h-4 mr-2" />
                  View Submissions
                </Button>
              </div>

              {/* Leaderboard Preview */}
              <Card className="analysis-card">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-primary mb-3 flex items-center space-x-2">
                    <Crown className="w-4 h-4 text-kolam-gold" />
                    <span>Top Entries</span>
                  </h4>
                  <div className="space-y-2">
                    {[
                      { name: "Priya S.", votes: 89, rank: 1 },
                      { name: "Rajesh K.", votes: 76, rank: 2 },
                      { name: "Meena I.", votes: 65, rank: 3 }
                    ].map((entry) => (
                      <div key={entry.rank} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="w-5 h-5 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-xs">
                            {entry.rank}
                          </span>
                          <span>{entry.name}</span>
                        </div>
                        <span className="text-muted-foreground">{entry.votes} votes</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submission Modal */}
      {showSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
          <Card className="card-traditional w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="w-5 h-5 text-primary" />
                <span>Submit Your Entry</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-primary/20 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-primary/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">Upload your kolam design</p>
                <Button variant="outline" size="sm">Choose File</Button>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setShowSubmission(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSubmit} className="flex-1 btn-hero">
                  Submit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
