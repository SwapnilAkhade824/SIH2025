import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Timer, 
  CheckCircle, 
  RotateCcw,
  Home,
  Trophy,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GridCell {
  id: number;
  active: boolean;
  isTemplate: boolean;
  row: number;
  col: number;
}

interface SymmetryMasterProps {
  onComplete: (score: number) => void;
  onExit: () => void;
}

type SymmetryType = 'horizontal' | 'vertical' | 'diagonal' | 'radial';

export function SymmetryMaster({ onComplete, onExit }: SymmetryMasterProps) {
  const [grid, setGrid] = useState<GridCell[]>([]);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameComplete, setGameComplete] = useState(false);
  const [currentSymmetry, setCurrentSymmetry] = useState<SymmetryType>('horizontal');
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  const gridSize = Math.min(5 + Math.floor(level / 3), 9);
  const timeLimit = Math.max(15, 35 - level * 2);

  // Generate a new symmetry challenge
  const generateChallenge = () => {
    const totalCells = gridSize * gridSize;
    const newGrid: GridCell[] = [];
    
    // Initialize grid
    for (let i = 0; i < totalCells; i++) {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      newGrid.push({
        id: i,
        active: false,
        isTemplate: false,
        row,
        col
      });
    }
    
    // Choose symmetry type
    const symmetryTypes: SymmetryType[] = ['horizontal', 'vertical', 'diagonal', 'radial'];
    const symmetryType = symmetryTypes[Math.floor(Math.random() * symmetryTypes.length)];
    setCurrentSymmetry(symmetryType);
    
    // Generate template pattern on one side
    const templateCells = Math.floor((gridSize * gridSize) / 4) + level;
    const usedCells = new Set<number>();
    
    for (let i = 0; i < templateCells; i++) {
      let cellIndex;
      let attempts = 0;
      
      do {
        if (symmetryType === 'horizontal') {
          // Only generate on top half
          const row = Math.floor(Math.random() * Math.floor(gridSize / 2));
          const col = Math.floor(Math.random() * gridSize);
          cellIndex = row * gridSize + col;
        } else if (symmetryType === 'vertical') {
          // Only generate on left half
          const row = Math.floor(Math.random() * gridSize);
          const col = Math.floor(Math.random() * Math.floor(gridSize / 2));
          cellIndex = row * gridSize + col;
        } else if (symmetryType === 'diagonal') {
          // Only generate below main diagonal
          let row, col;
          do {
            row = Math.floor(Math.random() * gridSize);
            col = Math.floor(Math.random() * gridSize);
          } while (col >= row);
          cellIndex = row * gridSize + col;
        } else { // radial
          // Only generate in one quadrant
          const row = Math.floor(Math.random() * Math.floor(gridSize / 2));
          const col = Math.floor(Math.random() * Math.floor(gridSize / 2));
          cellIndex = row * gridSize + col;
        }
        attempts++;
      } while (usedCells.has(cellIndex) && attempts < 50);
      
      if (!usedCells.has(cellIndex)) {
        usedCells.add(cellIndex);
        newGrid[cellIndex].active = true;
        newGrid[cellIndex].isTemplate = true;
      }
    }
    
    setGrid(newGrid);
    setTimeLeft(timeLimit);
    setIsChecking(false);
  };

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !gameComplete && !isChecking) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      checkSymmetry();
    }
  }, [timeLeft, gameComplete, isChecking]);

  // Initialize game
  useEffect(() => {
    generateChallenge();
  }, [level]);

  const handleCellClick = (cellId: number) => {
    if (isChecking || gameComplete) return;
    
    const cell = grid.find(c => c.id === cellId);
    if (!cell || cell.isTemplate) return;
    
    setGrid(prev => prev.map(c => 
      c.id === cellId ? { ...c, active: !c.active } : c
    ));
  };

  const getSymmetricCell = (row: number, col: number, symmetryType: SymmetryType): { row: number, col: number } => {
    switch (symmetryType) {
      case 'horizontal':
        return { row: gridSize - 1 - row, col };
      case 'vertical':
        return { row, col: gridSize - 1 - col };
      case 'diagonal':
        return { row: col, col: row };
      case 'radial':
        return { row: gridSize - 1 - row, col: gridSize - 1 - col };
      default:
        return { row, col };
    }
  };

  const checkSymmetry = () => {
    setIsChecking(true);
    
    let correct = 0;
    let total = 0;
    let mistakes = 0;
    
    // Check each template cell has its symmetric counterpart
    grid.forEach(cell => {
      if (cell.isTemplate && cell.active) {
        total++;
        const symmetric = getSymmetricCell(cell.row, cell.col, currentSymmetry);
        const symmetricCell = grid.find(c => c.row === symmetric.row && c.col === symmetric.col);
        
        if (symmetricCell && symmetricCell.active && !symmetricCell.isTemplate) {
          correct++;
        }
      }
    });
    
    // Check for extra cells that shouldn't be there
    grid.forEach(cell => {
      if (cell.active && !cell.isTemplate) {
        const symmetric = getSymmetricCell(cell.row, cell.col, currentSymmetry);
        const symmetricCell = grid.find(c => c.row === symmetric.row && c.col === symmetric.col);
        
        if (!symmetricCell || (!symmetricCell.active && !symmetricCell.isTemplate)) {
          mistakes++;
        }
      }
    });
    
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    const timeBonus = timeLeft * 5;
    const accuracyBonus = accuracy === 100 ? level * 100 : 0;
    const penaltyPoints = mistakes * 20;
    const levelScore = Math.max(0, correct * 50 + timeBonus + accuracyBonus - penaltyPoints);
    
    setScore(prev => prev + levelScore);
    
    if (accuracy >= 90) {
      toast({
        title: "Perfect Symmetry!",
        description: `${accuracy}% accuracy! +${levelScore} points`
      });
      
      setTimeout(() => {
        if (level < 15) {
          setLevel(prev => prev + 1);
        } else {
          endGame();
        }
      }, 2000);
    } else {
      toast({
        title: "Not Quite Symmetric",
        description: `${accuracy}% accuracy. Try again!`,
        variant: "destructive"
      });
      
      setTimeout(() => {
        generateChallenge();
      }, 2000);
    }
  };

  const endGame = () => {
    setGameComplete(true);
    onComplete(score);
  };

  const resetGame = () => {
    setLevel(1);
    setScore(0);
    setGameComplete(false);
    generateChallenge();
  };

  const getCellColor = (cell: GridCell) => {
    if (cell.isTemplate) {
      return 'bg-gradient-to-br from-primary to-accent border-primary';
    } else if (cell.active) {
      return 'bg-gradient-to-br from-accent to-kolam-gold border-accent';
    } else {
      return 'bg-muted border-muted hover:bg-muted/80';
    }
  };

  const getSymmetryDescription = (type: SymmetryType) => {
    switch (type) {
      case 'horizontal': return 'Mirror the pattern horizontally (top ↔ bottom)';
      case 'vertical': return 'Mirror the pattern vertically (left ↔ right)';
      case 'diagonal': return 'Mirror the pattern diagonally (swap rows ↔ columns)';
      case 'radial': return 'Mirror the pattern radially (180° rotation)';
      default: return '';
    }
  };

  if (gameComplete) {
    return (
      <Card className="card-traditional max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-kolam-gold to-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-traditional">Symmetry Master!</CardTitle>
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
            <h1 className="text-2xl font-traditional font-bold text-primary">Symmetry Master</h1>
            <p className="text-muted-foreground">Create perfect symmetrical patterns</p>
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

      {/* Game Instructions */}
      <Card className="card-traditional">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Zap className="w-5 h-5 text-primary" />
              <span className="text-lg font-medium capitalize">{currentSymmetry} Symmetry</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {getSymmetryDescription(currentSymmetry)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Game Grid */}
      <Card className="card-traditional">
        <CardContent className="p-6">
          <div className="flex justify-center">
            <div 
              className="grid gap-1 p-4 bg-gradient-to-br from-kolam-cream to-background rounded-lg border border-primary/20"
              style={{ 
                gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
                maxWidth: '400px'
              }}
            >
              {grid.map((cell) => (
                <button
                  key={cell.id}
                  onClick={() => handleCellClick(cell.id)}
                  disabled={cell.isTemplate || isChecking}
                  className={`
                    w-8 h-8 rounded border-2 transition-all duration-200
                    ${getCellColor(cell)}
                    ${!cell.isTemplate && !isChecking ? 'hover:scale-105 cursor-pointer' : 'cursor-default'}
                  `}
                />
              ))}
            </div>
          </div>
          
          <div className="flex justify-center mt-6 space-x-2">
            <Button onClick={checkSymmetry} disabled={isChecking} className="btn-hero">
              <CheckCircle className="w-4 h-4 mr-2" />
              Check Symmetry
            </Button>
            <Button variant="outline" onClick={generateChallenge} disabled={isChecking}>
              <RotateCcw className="w-4 h-4 mr-2" />
              New Pattern
            </Button>
          </div>
          
          <div className="text-center mt-4 space-y-2">
            <div className="flex justify-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-gradient-to-br from-primary to-accent rounded border border-primary"></div>
                <span>Template</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-gradient-to-br from-accent to-kolam-gold rounded border border-accent"></div>
                <span>Your Pattern</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
