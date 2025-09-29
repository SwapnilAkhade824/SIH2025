import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  RotateCcw, 
  CheckCircle, 
  Timer, 
  Target,
  Home,
  Trophy
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Dot {
  x: number;
  y: number;
  id: number;
  connected: boolean;
}

interface Line {
  from: number;
  to: number;
}

interface DotConnectorProps {
  onComplete: (score: number) => void;
  onExit: () => void;
}

export function DotConnector({ onComplete, onExit }: DotConnectorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dots, setDots] = useState<Dot[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [currentPath, setCurrentPath] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [level, setLevel] = useState(1);
  const { toast } = useToast();

  // Generate dots in a grid pattern for kolam
  const generateDots = (level: number) => {
    const gridSize = Math.min(3 + level, 7);
    const spacing = 60;
    const offsetX = 50;
    const offsetY = 50;
    const newDots: Dot[] = [];
    
    let id = 0;
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        newDots.push({
          x: offsetX + col * spacing,
          y: offsetY + row * spacing,
          id: id++,
          connected: false
        });
      }
    }
    
    setDots(newDots);
    setLines([]);
    setCurrentPath([]);
    setIsDrawing(false);
  };

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !gameComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      endGame();
    }
  }, [timeLeft, gameComplete]);

  // Initialize game
  useEffect(() => {
    generateDots(level);
  }, [level]);

  // Draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background pattern
    ctx.strokeStyle = '#E5D5B7';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < canvas.width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    // Draw completed lines
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 3;
    lines.forEach(line => {
      const fromDot = dots.find(d => d.id === line.from);
      const toDot = dots.find(d => d.id === line.to);
      if (fromDot && toDot) {
        ctx.beginPath();
        ctx.moveTo(fromDot.x, fromDot.y);
        ctx.lineTo(toDot.x, toDot.y);
        ctx.stroke();
      }
    });

    // Draw current path
    if (currentPath.length > 1) {
      ctx.strokeStyle = '#FF8C00';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      for (let i = 0; i < currentPath.length - 1; i++) {
        const fromDot = dots.find(d => d.id === currentPath[i]);
        const toDot = dots.find(d => d.id === currentPath[i + 1]);
        if (fromDot && toDot) {
          ctx.beginPath();
          ctx.moveTo(fromDot.x, fromDot.y);
          ctx.lineTo(toDot.x, toDot.y);
          ctx.stroke();
        }
      }
      ctx.setLineDash([]);
    }

    // Draw dots
    dots.forEach(dot => {
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, 8, 0, 2 * Math.PI);
      ctx.fillStyle = dot.connected ? '#D4AF37' : '#8B4513';
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }, [dots, lines, currentPath]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || gameComplete) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find clicked dot
    const clickedDot = dots.find(dot => {
      const distance = Math.sqrt((x - dot.x) ** 2 + (y - dot.y) ** 2);
      return distance <= 15;
    });

    if (clickedDot) {
      if (!isDrawing) {
        // Start new path
        setCurrentPath([clickedDot.id]);
        setIsDrawing(true);
      } else {
        // Continue or complete path
        const lastDot = currentPath[currentPath.length - 1];
        if (clickedDot.id !== lastDot) {
          const newPath = [...currentPath, clickedDot.id];
          setCurrentPath(newPath);
          
          // Check if path forms a valid kolam pattern (closed loop)
          if (clickedDot.id === currentPath[0] && newPath.length > 3) {
            completePath(newPath);
          }
        }
      }
    }
  };

  const completePath = (path: number[]) => {
    // Add lines to completed lines
    const newLines: Line[] = [];
    for (let i = 0; i < path.length - 1; i++) {
      newLines.push({ from: path[i], to: path[i + 1] });
    }
    
    setLines(prev => [...prev, ...newLines]);
    
    // Mark dots as connected
    const updatedDots = dots.map(dot => ({
      ...dot,
      connected: path.includes(dot.id) ? true : dot.connected
    }));
    setDots(updatedDots);
    
    // Calculate score
    const pathScore = path.length * 10 + (timeLeft * 2);
    setScore(prev => prev + pathScore);
    
    // Reset current path
    setCurrentPath([]);
    setIsDrawing(false);
    
    // Check if all dots are connected
    if (updatedDots.every(dot => dot.connected)) {
      completeLevel();
    }
    
    toast({
      title: "Pattern Complete!",
      description: `+${pathScore} points`
    });
  };

  const completeLevel = () => {
    const levelBonus = level * 100;
    const timeBonus = timeLeft * 5;
    const totalScore = score + levelBonus + timeBonus;
    
    setScore(totalScore);
    
    toast({
      title: "Level Complete!",
      description: `Level ${level} completed! +${levelBonus + timeBonus} bonus points`
    });
    
    if (level < 5) {
      setTimeout(() => {
        setLevel(prev => prev + 1);
        setTimeLeft(60);
      }, 2000);
    } else {
      endGame();
    }
  };

  const endGame = () => {
    setGameComplete(true);
    onComplete(score);
  };

  const resetGame = () => {
    setLevel(1);
    setScore(0);
    setTimeLeft(60);
    setGameComplete(false);
    generateDots(1);
  };

  const resetCurrentPath = () => {
    setCurrentPath([]);
    setIsDrawing(false);
  };

  if (gameComplete) {
    return (
      <Card className="card-traditional max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-kolam-gold to-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-traditional">Game Complete!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-3xl font-bold text-primary">{score} Points</div>
          <div className="text-muted-foreground">Level {level} Reached</div>
          <div className="flex space-x-2 justify-center">
            <Button onClick={resetGame} className="btn-hero">
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
            <Button variant="outline" onClick={onExit}>
              <Home className="w-4 h-4 mr-2" />
              Back to Games
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Game Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onExit}>
            <Home className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-traditional font-bold text-primary">Dot Connector</h1>
            <p className="text-muted-foreground">Connect dots to form closed kolam patterns</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Timer className="w-4 h-4" />
            <span>{timeLeft}s</span>
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Target className="w-4 h-4" />
            <span>Level {level}</span>
          </Badge>
          <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
            {score} pts
          </Badge>
        </div>
      </div>

      {/* Game Canvas */}
      <Card className="card-traditional">
        <CardContent className="p-6">
          <div className="text-center mb-4">
            <p className="text-sm text-muted-foreground">
              Click dots to start a path, then click other dots to continue. 
              Complete a closed loop to form a kolam pattern!
            </p>
          </div>
          
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              onClick={handleCanvasClick}
              className="border border-primary/20 rounded-lg cursor-pointer bg-gradient-to-br from-kolam-cream to-background"
            />
          </div>
          
          <div className="flex justify-center mt-4 space-x-2">
            <Button variant="outline" onClick={resetCurrentPath} disabled={!isDrawing}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Path
            </Button>
            <Button variant="outline" onClick={() => generateDots(level)}>
              <Target className="w-4 h-4 mr-2" />
              New Pattern
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
