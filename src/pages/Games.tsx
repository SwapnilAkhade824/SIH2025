import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  GamepadIcon, 
  Target, 
  Zap, 
  Brain, 
  Trophy, 
  Star,
  Play,
  Lock,
  CheckCircle
} from "lucide-react";
import { DotConnector } from "@/components/games/DotConnector";
import { PatternMemory } from "@/components/games/PatternMemory";
import { SymmetryMaster } from "@/components/games/SymmetryMaster";
import { useToast } from "@/hooks/use-toast";

interface Game {
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  points: number;
  icon: React.ComponentType<{ className?: string }>;
  status: "available" | "locked" | "completed";
  players: number;
}

const games: Game[] = [
  {
    title: "Dot Connector",
    description: "Connect dots to form traditional kolam patterns. Master the art of continuous lines and create beautiful geometric designs.",
    difficulty: "Easy",
    points: 100,
    icon: Target,
    status: "available",
    players: 1247
  },
  {
    title: "Pattern Memory",
    description: "Study complex kolam designs and recreate them from memory. Test your visual recall and understanding of traditional patterns.",
    difficulty: "Medium", 
    points: 250,
    icon: Brain,
    status: "available",
    players: 892
  },
  {
    title: "Symmetry Master",
    description: "Create perfectly symmetrical patterns under time pressure. Master the mathematical precision of traditional kolam art.",
    difficulty: "Hard",
    points: 500,
    icon: Zap,
    status: "available",
    players: 456
  }
];

const achievements = [
  { name: "First Steps", description: "Complete your first game", icon: Star, earned: true },
  { name: "Pattern Explorer", description: "Play 5 different games", icon: Target, earned: true },
  { name: "Speed Demon", description: "Complete a pattern in under 30 seconds", icon: Zap, earned: false },
  { name: "Perfectionist", description: "Achieve 100% accuracy in 3 games", icon: CheckCircle, earned: false }
];

export default function Games() {
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [playerStats, setPlayerStats] = useState({
    totalPoints: 1250,
    gamesPlayed: 12,
    avgAccuracy: 87,
    globalRank: 156
  });
  const { toast } = useToast();

  const handleGameComplete = (gameTitle: string, score: number) => {
    setPlayerStats(prev => ({
      ...prev,
      totalPoints: prev.totalPoints + score,
      gamesPlayed: prev.gamesPlayed + 1,
      avgAccuracy: Math.round((prev.avgAccuracy + (score > 500 ? 95 : score > 200 ? 85 : 75)) / 2)
    }));
    
    toast({
      title: "Game Complete!",
      description: `You earned ${score} points in ${gameTitle}!`
    });
    
    setCurrentGame(null);
  };

  const handleGameStart = (gameTitle: string) => {
    setCurrentGame(gameTitle);
  };

  const handleGameExit = () => {
    setCurrentGame(null);
  };

  // Render individual games
  if (currentGame === "Dot Connector") {
    return (
      <div className="container mx-auto px-4 py-6">
        <DotConnector 
          onComplete={(score) => handleGameComplete("Dot Connector", score)}
          onExit={handleGameExit}
        />
      </div>
    );
  }

  if (currentGame === "Pattern Memory") {
    return (
      <div className="container mx-auto px-4 py-6">
        <PatternMemory 
          onComplete={(score) => handleGameComplete("Pattern Memory", score)}
          onExit={handleGameExit}
        />
      </div>
    );
  }

  if (currentGame === "Symmetry Master") {
    return (
      <div className="container mx-auto px-4 py-6">
        <SymmetryMaster 
          onComplete={(score) => handleGameComplete("Symmetry Master", score)}
          onExit={handleGameExit}
        />
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-700";
      case "Medium": return "bg-yellow-100 text-yellow-700"; 
      case "Hard": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available": return <Play className="w-5 h-5" />;
      case "locked": return <Lock className="w-5 h-5" />;
      case "completed": return <CheckCircle className="w-5 h-5" />;
      default: return <Play className="w-5 h-5" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-traditional font-bold text-primary">
          Kolam Games
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
          Learn traditional kolam principles through engaging games. Build your skills, 
          earn points, and compete with fellow pattern enthusiasts.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="analysis-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary mb-1">{playerStats.totalPoints.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Points</div>
          </CardContent>
        </Card>
        <Card className="analysis-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary mb-1">{playerStats.gamesPlayed}</div>
            <div className="text-sm text-muted-foreground">Games Played</div>
          </CardContent>
        </Card>
        <Card className="analysis-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary mb-1">{playerStats.avgAccuracy}%</div>
            <div className="text-sm text-muted-foreground">Avg Accuracy</div>
          </CardContent>
        </Card>
        <Card className="analysis-card text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary mb-1">#{playerStats.globalRank}</div>
            <div className="text-sm text-muted-foreground">Global Rank</div>
          </CardContent>
        </Card>
      </div>

      {/* Games Grid */}
      <section className="space-y-6">
        <h2 className="text-2xl font-traditional font-bold text-primary">
          Available Games
        </h2>
        
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {games.map((game, index) => (
            <Card key={index} className="card-traditional group hover:scale-[1.02] transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    game.status === "available" ? "bg-gradient-to-br from-primary to-accent" :
                    game.status === "completed" ? "bg-gradient-to-br from-green-500 to-green-600" :
                    "bg-gradient-to-br from-gray-400 to-gray-500"
                  }`}>
                    <game.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(game.difficulty)}`}>
                      {game.difficulty}
                    </span>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <span>{game.players}</span>
                      <span>players</span>
                    </div>
                  </div>
                </div>
                
                <CardTitle className="text-lg font-traditional group-hover:text-primary transition-colors">
                  {game.title}
                </CardTitle>
                <CardDescription>
                  {game.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-kolam-gold" />
                    <span className="font-medium text-primary">{game.points} pts</span>
                  </div>
                  
                  <Button 
                    size="sm"
                    variant={game.status === "available" ? "default" : "outline"}
                    disabled={game.status === "locked"}
                    onClick={() => handleGameStart(game.title)}
                    className={game.status === "available" ? "bg-gradient-to-r from-primary to-accent text-primary-foreground" : ""}
                  >
                    {getStatusIcon(game.status)}
                    <span className="ml-2">
                      {game.status === "available" && "Play"}
                      {game.status === "locked" && "Locked"}
                      {game.status === "completed" && "Replay"}
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Achievements */}
      <section className="space-y-6">
        <h2 className="text-2xl font-traditional font-bold text-primary">
          Achievements
        </h2>
        
        <div className="grid md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <Card key={index} className={`p-4 ${achievement.earned ? "card-traditional" : "opacity-60"}`}>
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  achievement.earned 
                    ? "bg-gradient-to-br from-kolam-gold to-accent" 
                    : "bg-gray-200"
                }`}>
                  <achievement.icon className={`w-5 h-5 ${
                    achievement.earned ? "text-white" : "text-gray-400"
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-primary">
                    {achievement.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                </div>
                {achievement.earned && (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Leaderboard Preview */}
      <section className="bg-primary/5 rounded-2xl p-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-traditional font-bold text-primary mb-2">
            Global Leaderboard
          </h3>
          <p className="text-muted-foreground">
            Compete with kolam enthusiasts worldwide
          </p>
        </div>
        
        <div className="space-y-3 max-w-md mx-auto">
          {[
            { rank: 1, name: "KolamMaster2024", points: 15420, country: "🇮🇳" },
            { rank: 2, name: "PatternPro", points: 14890, country: "🇺🇸" },
            { rank: 3, name: "GeometryGuru", points: 13750, country: "🇸🇬" },
            { rank: playerStats.globalRank, name: "You", points: playerStats.totalPoints, country: "🇮🇳", highlight: true }
          ].map((player, index) => (
            <div 
              key={index} 
              className={`flex items-center justify-between p-3 rounded-lg ${
                player.highlight 
                  ? "bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20" 
                  : "bg-background"
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                  player.rank <= 3 
                    ? "bg-gradient-to-br from-kolam-gold to-accent text-white" 
                    : "bg-muted text-muted-foreground"
                }`}>
                  {player.rank}
                </span>
                <span className="text-lg">{player.country}</span>
                <span className={`font-medium ${player.highlight ? "text-primary" : ""}`}>
                  {player.name}
                </span>
              </div>
              <span className="font-semibold text-primary">
                {player.points.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}