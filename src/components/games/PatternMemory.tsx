import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  EyeOff, 
  CheckCircle, 
  X, 
  Timer, 
  Brain,
  Home,
  Trophy,
  RotateCcw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PatternCell {
  id: number;
  active: boolean;
  userSelected: boolean;
}

interface PatternMemoryProps {
  onComplete: (score: number) => void;
  onExit: () => void;
}

export function PatternMemory({ onComplete, onExit }: PatternMemoryProps) {
  const [pattern, setPattern] = useState<PatternCell[]>([]);
  const [gamePhase, setGamePhase] = useState<'study' | 'recall' | 'result'>('study');
  const [studyTime, setStudyTime] = useState(5);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameComplete, setGameComplete] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const { toast } = useToast();

  const gridSize = Math.min(3 + Math.floor(level / 2), 6);
  const patternComplexity = Math.min(4 + level * 2, gridSize * gridSize / 2);

  // Generate a new kolam pattern
  const generatePattern = () => {
    const totalCells = gridSize * gridSize;
    const newPattern: PatternCell[] = [];
    
    // Initialize all cells
    for (let i = 0; i < totalCells; i++) {
      newPattern.push({
        id: i,
        active: false,
        userSelected: false
      });
    }
    
    // Create a symmetric kolam-like pattern
    const activeCells = new Set<number>();
    const centerRow = Math.floor(gridSize / 2);
    const centerCol = Math.floor(gridSize / 2);
    
    // Add center point
    const centerIndex = centerRow * gridSize + centerCol;
    activeCells.add(centerIndex);
    
    // Add symmetric patterns
    for (let i = 0; i < patternComplexity - 1; i++) {
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);
      const index = row * gridSize + col;
      
      activeCells.add(index);
      
      // Add symmetric counterparts for traditional kolam symmetry
      if (gridSize % 2 === 1) {
        // Radial symmetry
        const symRow = gridSize - 1 - row;
        const symCol = gridSize - 1 - col;
        const symIndex = symRow * gridSize + symCol;
        activeCells.add(symIndex);
        
        // Horizontal symmetry
        const hSymIndex = row * gridSize + (gridSize - 1 - col);
        activeCells.add(hSymIndex);
        
        // Vertical symmetry
        const vSymIndex = (gridSize - 1 - row) * gridSize + col;
        activeCells.add(vSymIndex);
      }
    }
    
    // Apply active cells to pattern
    activeCells.forEach(index => {
      if (newPattern[index]) {
        newPattern[index].active = true;
      }
    });
    
    setPattern(newPattern);
    setGamePhase('study');
    setStudyTime(Math.max(3, 8 - level));
  };

  // Study phase timer
  useEffect(() => {
    if (gamePhase === 'study' && studyTime > 0) {
      const timer = setTimeout(() => setStudyTime(studyTime - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gamePhase === 'study' && studyTime === 0) {
      setGamePhase('recall');
    }
  }, [gamePhase, studyTime]);

  // Initialize game
  useEffect(() => {
    generatePattern();
  }, [level]);

  const handleCellClick = (cellId: number) => {
    if (gamePhase !== 'recall') return;
    
    setPattern(prev => prev.map(cell => 
      cell.id === cellId 
        ? { ...cell, userSelected: !cell.userSelected }
        : cell
    ));
  };

  const checkAnswer = () => {
    let correct = 0;
    let total = 0;
    let mistakes = 0;
    
    pattern.forEach(cell => {
      if (cell.active) {
        total++;
        if (cell.userSelected) correct++;
      } else if (cell.userSelected) {
        mistakes++;
      }
    });
    
    const currentAccuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    const penaltyPoints = mistakes * 10;
    const baseScore = correct * 20 + (currentAccuracy === 100 ? level * 50 : 0);
    const levelScore = Math.max(0, baseScore - penaltyPoints);
    
    setAccuracy(currentAccuracy);
    setScore(prev => prev + levelScore);
    setGamePhase('result');
    
    if (currentAccuracy >= 80) {
      toast({
        title: "Great Memory!",
        description: `${currentAccuracy}% accuracy! +${levelScore} points`
      });
      
      setTimeout(() => {
        if (level < 10) {
          setLevel(prev => prev + 1);
        } else {
          endGame();
        }
      }, 2000);
    } else {
      setLives(prev => prev - 1);
      toast({
        title: "Not Quite Right",
        description: `${currentAccuracy}% accuracy. ${lives - 1} lives remaining.`,
        variant: "destructive"
      });
      
      if (lives <= 1) {
        endGame();
      } else {
        setTimeout(() => {
          generatePattern();
        }, 2000);
      }
    }
  };

  const endGame = () => {
    setGameComplete(true);
    onComplete(score);
  };

  const resetGame = () => {
    setLevel(1);
    setScore(0);
    setLives(3);
    setGameComplete(false);
    generatePattern();
  };

  const getCellColor = (cell: PatternCell) => {
    if (gamePhase === 'study') {
      return cell.active ? 'bg-gradient-to-br from-primary to-accent' : 'bg-muted';
    } else if (gamePhase === 'recall') {
      return cell.userSelected ? 'bg-gradient-to-br from-accent to-kolam-gold' : 'bg-muted hover:bg-muted/80';
    } else { // result phase
      if (cell.active && cell.userSelected) return 'bg-green-500'; // correct
      if (cell.active && !cell.userSelected) return 'bg-red-500'; // missed
      if (!cell.active && cell.userSelected) return 'bg-orange-500'; // wrong
      return 'bg-muted';
    }
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
          <div className="text-sm text-muted-foreground">Final Accuracy: {accuracy}%</div>
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
            <h1 className="text-2xl font-traditional font-bold text-primary">Pattern Memory</h1>
            <p className="text-muted-foreground">Study the pattern, then recreate it from memory</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Brain className="w-4 h-4" />
            <span>Level {level}</span>
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-1">
            <span>❤️ {lives}</span>
          </Badge>
          <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground">
            {score} pts
          </Badge>
        </div>
      </div>

      {/* Game Instructions */}
      <Card className="card-traditional">
        <CardContent className="p-4">
          <div className="text-center">
            {gamePhase === 'study' && (
              <div className="flex items-center justify-center space-x-2">
                <Eye className="w-5 h-5 text-primary" />
                <span className="text-lg font-medium">Study the pattern: {studyTime}s</span>
              </div>
            )}
            {gamePhase === 'recall' && (
              <div className="flex items-center justify-center space-x-2">
                <EyeOff className="w-5 h-5 text-accent" />
                <span className="text-lg font-medium">Recreate the pattern from memory</span>
              </div>
            )}
            {gamePhase === 'result' && (
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-lg font-medium">Accuracy: {accuracy}%</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Game Grid */}
      <Card className="card-traditional">
        <CardContent className="p-6">
          <div className="flex justify-center">
            <div 
              className="grid gap-2 p-4 bg-gradient-to-br from-kolam-cream to-background rounded-lg border border-primary/20"
              style={{ 
                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                maxWidth: '400px'
              }}
            >
              {pattern.map((cell) => (
                <button
                  key={cell.id}
                  onClick={() => handleCellClick(cell.id)}
                  disabled={gamePhase === 'study' || gamePhase === 'result'}
                  className={`
                    w-12 h-12 rounded-lg border-2 border-white transition-all duration-200
                    ${getCellColor(cell)}
                    ${gamePhase === 'recall' ? 'hover:scale-105 cursor-pointer' : 'cursor-default'}
                  `}
                />
              ))}
            </div>
          </div>
          
          {gamePhase === 'recall' && (
            <div className="flex justify-center mt-6">
              <Button onClick={checkAnswer} className="btn-hero">
                <CheckCircle className="w-4 h-4 mr-2" />
                Check Answer
              </Button>
            </div>
          )}
          
          {gamePhase === 'result' && (
            <div className="text-center mt-4 space-y-2">
              <div className="flex justify-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Correct</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>Missed</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  <span>Wrong</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
