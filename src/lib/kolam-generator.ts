export interface KolamPoint {
  x: number;
  y: number;
  isDot: boolean;
  isConnected: boolean;
}

export interface KolamPath {
  points: KolamPoint[];
  isClosed: boolean;
  strokeWidth: number;
  color: string;
}

export interface KolamPattern {
  grid: KolamPoint[][];
  paths: KolamPath[];
  dots: KolamPoint[];
  gridSize: number;
  patternType: string;
  shapes: string[];
  complexity: number;
  symmetry: string;
}

export interface GenerationParams {
  gridSize: number;
  patternType: string;
  selectedShapes: string[];
  complexity: number;
  symmetry: string;
  loops: number;
  spacing: number;
}

// Mathematical utilities for kolam generation
export class KolamMath {
  static polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }

  static getSymmetryPoints(x: number, y: number, centerX: number, centerY: number, symmetryType: string): KolamPoint[] {
    const points: KolamPoint[] = [];
    
    switch (symmetryType) {
      case 'radial':
        // 4-fold radial symmetry
        for (let i = 0; i < 4; i++) {
          const angle = i * 90;
          const rotated = this.rotatePoint(x - centerX, y - centerY, angle);
          points.push({
            x: rotated.x + centerX,
            y: rotated.y + centerY,
            isDot: true,
            isConnected: false
          });
        }
        break;
      
      case 'bilateral':
        // Mirror across vertical and horizontal axes
        points.push(
          { x, y, isDot: true, isConnected: false },
          { x: 2 * centerX - x, y, isDot: true, isConnected: false },
          { x, y: 2 * centerY - y, isDot: true, isConnected: false },
          { x: 2 * centerX - x, y: 2 * centerY - y, isDot: true, isConnected: false }
        );
        break;
      
      case 'rotational':
        // 8-fold rotational symmetry
        for (let i = 0; i < 8; i++) {
          const angle = i * 45;
          const rotated = this.rotatePoint(x - centerX, y - centerY, angle);
          points.push({
            x: rotated.x + centerX,
            y: rotated.y + centerY,
            isDot: true,
            isConnected: false
          });
        }
        break;
      
      default:
        points.push({ x, y, isDot: true, isConnected: false });
    }
    
    return points;
  }

  static rotatePoint(x: number, y: number, angle: number) {
    const rad = angle * Math.PI / 180;
    return {
      x: x * Math.cos(rad) - y * Math.sin(rad),
      y: x * Math.sin(rad) + y * Math.cos(rad)
    };
  }

  static generateSpiral(centerX: number, centerY: number, loops: number, spacing: number): KolamPoint[] {
    const points: KolamPoint[] = [];
    const totalPoints = loops * 8; // 8 points per loop
    
    for (let i = 0; i < totalPoints; i++) {
      const angle = (i / totalPoints) * loops * 360;
      const radius = (i / totalPoints) * spacing * loops;
      const point = this.polarToCartesian(centerX, centerY, radius, angle);
      points.push({
        x: point.x,
        y: point.y,
        isDot: false,
        isConnected: true
      });
    }
    
    return points;
  }
}

// Pattern generators for different kolam types
export class KolamPatternGenerator {
  static generateRadialPattern(params: GenerationParams): KolamPattern {
    const { gridSize, complexity, loops, spacing } = params;
    const center = gridSize / 2;
    const cellSize = 40;
    
    const grid: KolamPoint[][] = [];
    const dots: KolamPoint[] = [];
    const paths: KolamPath[] = [];
    
    // Initialize grid
    for (let i = 0; i < gridSize; i++) {
      grid[i] = [];
      for (let j = 0; j < gridSize; j++) {
        const point: KolamPoint = {
          x: j * cellSize + cellSize / 2,
          y: i * cellSize + cellSize / 2,
          isDot: true,
          isConnected: false
        };
        grid[i][j] = point;
        dots.push(point);
      }
    }
    
    // Generate radial paths
    const centerX = center * cellSize;
    const centerY = center * cellSize;
    
    for (let loop = 1; loop <= loops; loop++) {
      const radius = loop * spacing * cellSize / 2;
      const points: KolamPoint[] = [];
      
      // Create circular path
      for (let angle = 0; angle < 360; angle += 45) {
        const point = KolamMath.polarToCartesian(centerX, centerY, radius, angle);
        points.push({
          x: point.x,
          y: point.y,
          isDot: false,
          isConnected: true
        });
      }
      
      paths.push({
        points,
        isClosed: true,
        strokeWidth: 3 - (loop * 0.3),
        color: `hsl(${45 + loop * 30}, 70%, 50%)`
      });
    }
    
    // Add connecting lines based on complexity
    if (complexity > 5) {
      const spokes = Math.min(8, complexity);
      for (let i = 0; i < spokes; i++) {
        const angle = (i * 360) / spokes;
        const outerRadius = loops * spacing * cellSize / 2;
        const innerPoint = KolamMath.polarToCartesian(centerX, centerY, cellSize / 4, angle);
        const outerPoint = KolamMath.polarToCartesian(centerX, centerY, outerRadius, angle);
        
        paths.push({
          points: [
            { x: innerPoint.x, y: innerPoint.y, isDot: false, isConnected: true },
            { x: outerPoint.x, y: outerPoint.y, isDot: false, isConnected: true }
          ],
          isClosed: false,
          strokeWidth: 2,
          color: '#D4AF37'
        });
      }
    }
    
    return {
      grid,
      paths,
      dots,
      gridSize,
      patternType: 'radial',
      shapes: params.selectedShapes,
      complexity,
      symmetry: params.symmetry
    };
  }
  
  static generateMandalaPattern(params: GenerationParams): KolamPattern {
    const { gridSize, complexity, loops, spacing } = params;
    const center = gridSize / 2;
    const cellSize = 40;
    const centerX = center * cellSize;
    const centerY = center * cellSize;
    
    const grid: KolamPoint[][] = [];
    const dots: KolamPoint[] = [];
    const paths: KolamPath[] = [];
    
    // Initialize grid
    for (let i = 0; i < gridSize; i++) {
      grid[i] = [];
      for (let j = 0; j < gridSize; j++) {
        const point: KolamPoint = {
          x: j * cellSize + cellSize / 2,
          y: i * cellSize + cellSize / 2,
          isDot: true,
          isConnected: false
        };
        grid[i][j] = point;
        dots.push(point);
      }
    }
    
    // Generate concentric mandala layers
    for (let layer = 1; layer <= loops; layer++) {
      const radius = layer * spacing * cellSize / 3;
      const petals = Math.max(6, layer * 2); // More petals in outer layers
      
      // Create petal pattern
      const petalPoints: KolamPoint[] = [];
      for (let i = 0; i < petals; i++) {
        const angle = (i * 360) / petals;
        const petalTip = KolamMath.polarToCartesian(centerX, centerY, radius, angle);
        const petalBase1 = KolamMath.polarToCartesian(centerX, centerY, radius * 0.7, angle - 15);
        const petalBase2 = KolamMath.polarToCartesian(centerX, centerY, radius * 0.7, angle + 15);
        
        // Create petal shape
        paths.push({
          points: [
            { x: petalBase1.x, y: petalBase1.y, isDot: false, isConnected: true },
            { x: petalTip.x, y: petalTip.y, isDot: false, isConnected: true },
            { x: petalBase2.x, y: petalBase2.y, isDot: false, isConnected: true }
          ],
          isClosed: false,
          strokeWidth: 2.5 - (layer * 0.2),
          color: `hsl(${280 + layer * 20}, 60%, ${60 - layer * 5}%)`
        });
      }
      
      // Connect petals with circular base
      const circlePoints: KolamPoint[] = [];
      for (let angle = 0; angle < 360; angle += 10) {
        const point = KolamMath.polarToCartesian(centerX, centerY, radius * 0.6, angle);
        circlePoints.push({
          x: point.x,
          y: point.y,
          isDot: false,
          isConnected: true
        });
      }
      
      paths.push({
        points: circlePoints,
        isClosed: true,
        strokeWidth: 1.5,
        color: `hsl(${45}, 70%, 50%)`
      });
    }
    
    // Add center dot
    dots.push({
      x: centerX,
      y: centerY,
      isDot: true,
      isConnected: false
    });
    
    return {
      grid,
      paths,
      dots,
      gridSize,
      patternType: 'mandala',
      shapes: params.selectedShapes,
      complexity,
      symmetry: params.symmetry
    };
  }
  
  static generateGeometricPattern(params: GenerationParams): KolamPattern {
    const { gridSize, complexity, selectedShapes } = params;
    const cellSize = 40;
    
    const grid: KolamPoint[][] = [];
    const dots: KolamPoint[] = [];
    const paths: KolamPath[] = [];
    
    // Initialize grid
    for (let i = 0; i < gridSize; i++) {
      grid[i] = [];
      for (let j = 0; j < gridSize; j++) {
        const point: KolamPoint = {
          x: j * cellSize + cellSize / 2,
          y: i * cellSize + cellSize / 2,
          isDot: true,
          isConnected: false
        };
        grid[i][j] = point;
        dots.push(point);
      }
    }
    
    // Generate geometric shapes based on selected shapes
    selectedShapes.forEach((shape, index) => {
      const color = `hsl(${index * 60}, 70%, 50%)`;
      
      switch (shape) {
        case 'square':
          this.addSquarePattern(paths, gridSize, cellSize, color, complexity);
          break;
        case 'triangle':
          this.addTrianglePattern(paths, gridSize, cellSize, color, complexity);
          break;
        case 'diamond':
          this.addDiamondPattern(paths, gridSize, cellSize, color, complexity);
          break;
        case 'circle':
          this.addCirclePattern(paths, gridSize, cellSize, color, complexity);
          break;
      }
    });
    
    return {
      grid,
      paths,
      dots,
      gridSize,
      patternType: 'geometric',
      shapes: selectedShapes,
      complexity,
      symmetry: params.symmetry
    };
  }
  
  private static addSquarePattern(paths: KolamPath[], gridSize: number, cellSize: number, color: string, complexity: number) {
    const center = gridSize / 2;
    const centerX = center * cellSize;
    const centerY = center * cellSize;
    
    for (let i = 1; i <= Math.min(3, complexity / 2); i++) {
      const size = i * cellSize;
      const half = size / 2;
      
      paths.push({
        points: [
          { x: centerX - half, y: centerY - half, isDot: false, isConnected: true },
          { x: centerX + half, y: centerY - half, isDot: false, isConnected: true },
          { x: centerX + half, y: centerY + half, isDot: false, isConnected: true },
          { x: centerX - half, y: centerY + half, isDot: false, isConnected: true }
        ],
        isClosed: true,
        strokeWidth: 2.5 - (i * 0.3),
        color
      });
    }
  }
  
  private static addTrianglePattern(paths: KolamPath[], gridSize: number, cellSize: number, color: string, complexity: number) {
    const center = gridSize / 2;
    const centerX = center * cellSize;
    const centerY = center * cellSize;
    
    for (let i = 1; i <= Math.min(3, complexity / 2); i++) {
      const radius = i * cellSize * 0.8;
      
      const points: KolamPoint[] = [];
      for (let j = 0; j < 3; j++) {
        const angle = j * 120;
        const point = KolamMath.polarToCartesian(centerX, centerY, radius, angle);
        points.push({
          x: point.x,
          y: point.y,
          isDot: false,
          isConnected: true
        });
      }
      
      paths.push({
        points,
        isClosed: true,
        strokeWidth: 2.5 - (i * 0.3),
        color
      });
    }
  }
  
  private static addDiamondPattern(paths: KolamPath[], gridSize: number, cellSize: number, color: string, complexity: number) {
    const center = gridSize / 2;
    const centerX = center * cellSize;
    const centerY = center * cellSize;
    
    for (let i = 1; i <= Math.min(3, complexity / 2); i++) {
      const size = i * cellSize * 0.7;
      
      paths.push({
        points: [
          { x: centerX, y: centerY - size, isDot: false, isConnected: true },
          { x: centerX + size, y: centerY, isDot: false, isConnected: true },
          { x: centerX, y: centerY + size, isDot: false, isConnected: true },
          { x: centerX - size, y: centerY, isDot: false, isConnected: true }
        ],
        isClosed: true,
        strokeWidth: 2.5 - (i * 0.3),
        color
      });
    }
  }
  
  private static addCirclePattern(paths: KolamPath[], gridSize: number, cellSize: number, color: string, complexity: number) {
    const center = gridSize / 2;
    const centerX = center * cellSize;
    const centerY = center * cellSize;
    
    for (let i = 1; i <= Math.min(3, complexity / 2); i++) {
      const radius = i * cellSize * 0.6;
      const points: KolamPoint[] = [];
      
      for (let angle = 0; angle < 360; angle += 10) {
        const point = KolamMath.polarToCartesian(centerX, centerY, radius, angle);
        points.push({
          x: point.x,
          y: point.y,
          isDot: false,
          isConnected: true
        });
      }
      
      paths.push({
        points,
        isClosed: true,
        strokeWidth: 2.5 - (i * 0.3),
        color
      });
    }
  }
  
  static generateLinearPattern(params: GenerationParams): KolamPattern {
    const { gridSize, complexity, spacing } = params;
    const cellSize = 40;
    
    const grid: KolamPoint[][] = [];
    const dots: KolamPoint[] = [];
    const paths: KolamPath[] = [];
    
    // Initialize grid
    for (let i = 0; i < gridSize; i++) {
      grid[i] = [];
      for (let j = 0; j < gridSize; j++) {
        const point: KolamPoint = {
          x: j * cellSize + cellSize / 2,
          y: i * cellSize + cellSize / 2,
          isDot: true,
          isConnected: false
        };
        grid[i][j] = point;
        dots.push(point);
      }
    }
    
    // Generate linear connecting patterns
    const step = Math.max(1, Math.floor(gridSize / spacing));
    
    // Horizontal lines
    for (let i = 0; i < gridSize; i += step) {
      const points: KolamPoint[] = [];
      for (let j = 0; j < gridSize; j++) {
        points.push({
          x: j * cellSize + cellSize / 2,
          y: i * cellSize + cellSize / 2,
          isDot: false,
          isConnected: true
        });
      }
      
      paths.push({
        points,
        isClosed: false,
        strokeWidth: 2,
        color: '#D4AF37'
      });
    }
    
    // Vertical lines
    for (let j = 0; j < gridSize; j += step) {
      const points: KolamPoint[] = [];
      for (let i = 0; i < gridSize; i++) {
        points.push({
          x: j * cellSize + cellSize / 2,
          y: i * cellSize + cellSize / 2,
          isDot: false,
          isConnected: true
        });
      }
      
      paths.push({
        points,
        isClosed: false,
        strokeWidth: 2,
        color: '#D4AF37'
      });
    }
    
    // Add diagonal connections for higher complexity
    if (complexity > 6) {
      // Main diagonals
      const diag1: KolamPoint[] = [];
      const diag2: KolamPoint[] = [];
      
      for (let i = 0; i < gridSize; i++) {
        diag1.push({
          x: i * cellSize + cellSize / 2,
          y: i * cellSize + cellSize / 2,
          isDot: false,
          isConnected: true
        });
        
        diag2.push({
          x: i * cellSize + cellSize / 2,
          y: (gridSize - 1 - i) * cellSize + cellSize / 2,
          isDot: false,
          isConnected: true
        });
      }
      
      paths.push({
        points: diag1,
        isClosed: false,
        strokeWidth: 2.5,
        color: '#FF6B35'
      });
      
      paths.push({
        points: diag2,
        isClosed: false,
        strokeWidth: 2.5,
        color: '#FF6B35'
      });
    }
    
    return {
      grid,
      paths,
      dots,
      gridSize,
      patternType: 'linear',
      shapes: params.selectedShapes,
      complexity,
      symmetry: params.symmetry
    };
  }
  
  static generateFloralPattern(params: GenerationParams): KolamPattern {
    const { gridSize, complexity, loops } = params;
    const cellSize = 40;
    const center = gridSize / 2;
    const centerX = center * cellSize;
    const centerY = center * cellSize;
    
    const grid: KolamPoint[][] = [];
    const dots: KolamPoint[] = [];
    const paths: KolamPath[] = [];
    
    // Initialize grid
    for (let i = 0; i < gridSize; i++) {
      grid[i] = [];
      for (let j = 0; j < gridSize; j++) {
        const point: KolamPoint = {
          x: j * cellSize + cellSize / 2,
          y: i * cellSize + cellSize / 2,
          isDot: true,
          isConnected: false
        };
        grid[i][j] = point;
        dots.push(point);
      }
    }
    
    // Generate flower petals
    const petalCount = Math.max(6, complexity);
    const petalRadius = Math.min(centerX, centerY) * 0.6;
    
    for (let i = 0; i < petalCount; i++) {
      const angle = (i * 360) / petalCount;
      const petalCenter = KolamMath.polarToCartesian(centerX, centerY, petalRadius * 0.5, angle);
      
      // Create petal shape using bezier-like curves
      const petalPoints: KolamPoint[] = [];
      
      // Petal tip
      const tip = KolamMath.polarToCartesian(centerX, centerY, petalRadius, angle);
      
      // Petal sides
      const side1 = KolamMath.polarToCartesian(centerX, centerY, petalRadius * 0.7, angle - 20);
      const side2 = KolamMath.polarToCartesian(centerX, centerY, petalRadius * 0.7, angle + 20);
      const base = KolamMath.polarToCartesian(centerX, centerY, petalRadius * 0.3, angle);
      
      petalPoints.push(
        { x: base.x, y: base.y, isDot: false, isConnected: true },
        { x: side1.x, y: side1.y, isDot: false, isConnected: true },
        { x: tip.x, y: tip.y, isDot: false, isConnected: true },
        { x: side2.x, y: side2.y, isDot: false, isConnected: true }
      );
      
      paths.push({
        points: petalPoints,
        isClosed: true,
        strokeWidth: 2,
        color: `hsl(${120 + i * 15}, 60%, 50%)`
      });
    }
    
    // Add flower center
    const centerCircle: KolamPoint[] = [];
    const centerRadius = cellSize * 0.8;
    
    for (let angle = 0; angle < 360; angle += 15) {
      const point = KolamMath.polarToCartesian(centerX, centerY, centerRadius, angle);
      centerCircle.push({
        x: point.x,
        y: point.y,
        isDot: false,
        isConnected: true
      });
    }
    
    paths.push({
      points: centerCircle,
      isClosed: true,
      strokeWidth: 3,
      color: '#FFD700'
    });
    
    // Add leaves for higher complexity
    if (complexity > 7) {
      const leafCount = Math.floor(petalCount / 2);
      for (let i = 0; i < leafCount; i++) {
        const angle = (i * 360) / leafCount + 30; // Offset from petals
        const leafBase = KolamMath.polarToCartesian(centerX, centerY, petalRadius * 0.8, angle);
        const leafTip = KolamMath.polarToCartesian(centerX, centerY, petalRadius * 1.2, angle);
        const leafSide1 = KolamMath.polarToCartesian(centerX, centerY, petalRadius * 1.0, angle - 10);
        const leafSide2 = KolamMath.polarToCartesian(centerX, centerY, petalRadius * 1.0, angle + 10);
        
        paths.push({
          points: [
            { x: leafBase.x, y: leafBase.y, isDot: false, isConnected: true },
            { x: leafSide1.x, y: leafSide1.y, isDot: false, isConnected: true },
            { x: leafTip.x, y: leafTip.y, isDot: false, isConnected: true },
            { x: leafSide2.x, y: leafSide2.y, isDot: false, isConnected: true }
          ],
          isClosed: true,
          strokeWidth: 1.5,
          color: '#228B22'
        });
      }
    }
    
    return {
      grid,
      paths,
      dots,
      gridSize,
      patternType: 'floral',
      shapes: params.selectedShapes,
      complexity,
      symmetry: params.symmetry
    };
  }
  
  static generatePattern(params: GenerationParams): KolamPattern {
    switch (params.patternType) {
      case 'radial':
        return this.generateRadialPattern(params);
      case 'mandala':
        return this.generateMandalaPattern(params);
      case 'geometric':
        return this.generateGeometricPattern(params);
      case 'linear':
        return this.generateLinearPattern(params);
      case 'floral':
        return this.generateFloralPattern(params);
      default:
        return this.generateRadialPattern(params);
    }
  }
}
