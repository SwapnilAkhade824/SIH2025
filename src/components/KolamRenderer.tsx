import React, { useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Maximize2, RotateCw, Palette } from 'lucide-react';
import { KolamPattern, KolamPath, KolamPoint, GenerationParams, KolamPatternGenerator } from '@/lib/kolam-generator';

interface KolamRendererProps {
  params: GenerationParams;
  className?: string;
  showControls?: boolean;
  animated?: boolean;
}

export function KolamRenderer({ params, className = '', showControls = true, animated = false }: KolamRendererProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  
  const pattern = useMemo(() => {
    if (!params.patternType || params.selectedShapes.length === 0) {
      return null;
    }
    return KolamPatternGenerator.generatePattern(params);
  }, [params]);

  const svgSize = useMemo(() => {
    if (!pattern) return { width: 400, height: 400 };
    const size = pattern.gridSize * 40 + 40; // cellSize * gridSize + padding
    return { width: size, height: size };
  }, [pattern]);

  const renderDots = (dots: KolamPoint[]) => {
    return dots.map((dot, index) => (
      <circle
        key={`dot-${index}`}
        cx={dot.x}
        cy={dot.y}
        r="3"
        fill="#8B4513"
        stroke="#654321"
        strokeWidth="0.5"
        className={animated ? "animate-pulse" : ""}
        style={{
          animationDelay: animated ? `${index * 50}ms` : undefined
        }}
      />
    ));
  };

  const renderPaths = (paths: KolamPath[]) => {
    return paths.map((path, pathIndex) => {
      const pathData = generateSVGPath(path);
      
      return (
        <g key={`path-${pathIndex}`}>
          <path
            d={pathData}
            fill="none"
            stroke={path.color}
            strokeWidth={path.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={animated ? "animate-draw" : ""}
            style={{
              strokeDasharray: animated ? "1000" : undefined,
              strokeDashoffset: animated ? "1000" : undefined,
              animationDelay: animated ? `${pathIndex * 200}ms` : undefined,
              animationDuration: animated ? "2s" : undefined,
              animationFillMode: "forwards"
            }}
          />
          {/* Add glow effect for enhanced visual appeal */}
          <path
            d={pathData}
            fill="none"
            stroke={path.color}
            strokeWidth={path.strokeWidth + 2}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.3"
            filter="blur(2px)"
          />
        </g>
      );
    });
  };

  const generateSVGPath = (path: KolamPath): string => {
    if (path.points.length === 0) return '';
    
    let pathData = `M ${path.points[0].x} ${path.points[0].y}`;
    
    for (let i = 1; i < path.points.length; i++) {
      const point = path.points[i];
      pathData += ` L ${point.x} ${point.y}`;
    }
    
    if (path.isClosed) {
      pathData += ' Z';
    }
    
    return pathData;
  };

  const downloadSVG = () => {
    if (!svgRef.current) return;
    
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `kolam-${params.patternType}-${Date.now()}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
  };

  const downloadPNG = async () => {
    if (!svgRef.current) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const img = new Image();
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      canvas.width = svgSize.width * 2; // Higher resolution
      canvas.height = svgSize.height * 2;
      ctx.scale(2, 2);
      ctx.fillStyle = '#FFFEF7'; // Cream background
      ctx.fillRect(0, 0, svgSize.width, svgSize.height);
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const downloadLink = document.createElement('a');
          downloadLink.href = URL.createObjectURL(blob);
          downloadLink.download = `kolam-${params.patternType}-${Date.now()}.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }
      });
      
      URL.revokeObjectURL(url);
    };
    
    img.src = url;
  };

  if (!pattern) {
    return (
      <Card className={`${className} card-traditional`}>
        <CardContent className="p-8">
          <div className="aspect-square bg-gradient-to-br from-background to-kolam-cream/30 rounded-xl border-2 border-dashed border-primary/20 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto">
                <Palette className="w-8 h-8 text-primary/60" />
              </div>
              <div>
                <h3 className="text-lg font-traditional font-semibold text-primary mb-2">
                  Configure Parameters
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Select a pattern type and shapes to generate your kolam design
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <Card className="card-traditional overflow-hidden">
        <CardContent className="p-4">
          <div className="relative bg-gradient-to-br from-kolam-cream to-background rounded-xl overflow-hidden">
            <svg
              ref={svgRef}
              width={svgSize.width}
              height={svgSize.height}
              viewBox={`0 0 ${svgSize.width} ${svgSize.height}`}
              className="w-full h-auto max-h-96"
              style={{ background: 'linear-gradient(135deg, #FFFEF7 0%, #FFF8E7 100%)' }}
            >
              {/* Background pattern */}
              <defs>
                <pattern id="dotGrid" patternUnits="userSpaceOnUse" width="40" height="40">
                  <circle cx="20" cy="20" r="1" fill="#E5D5B7" opacity="0.3" />
                </pattern>
                
                {/* Gradient definitions for enhanced visuals */}
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="100%" stopColor="#B8860B" />
                </linearGradient>
                
                <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFD700" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
                </radialGradient>
              </defs>
              
              {/* Background grid */}
              <rect width="100%" height="100%" fill="url(#dotGrid)" />
              
              {/* Center glow effect */}
              <circle 
                cx={svgSize.width / 2} 
                cy={svgSize.height / 2} 
                r={Math.min(svgSize.width, svgSize.height) / 3}
                fill="url(#centerGlow)"
              />
              
              {/* Render the kolam pattern */}
              {renderPaths(pattern.paths)}
              {renderDots(pattern.dots)}
              
              {/* Pattern info overlay */}
              <text
                x="10"
                y={svgSize.height - 10}
                fontSize="10"
                fill="#8B4513"
                opacity="0.7"
                fontFamily="monospace"
              >
                {pattern.patternType.toUpperCase()} • {pattern.gridSize}×{pattern.gridSize} • {pattern.shapes.join('+')}
              </text>
            </svg>
          </div>
        </CardContent>
      </Card>

      {showControls && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" onClick={() => window.location.reload()}>
              <RotateCw className="w-4 h-4 mr-2" />
              Regenerate
            </Button>
            <Button size="sm" variant="outline">
              <Maximize2 className="w-4 h-4 mr-2" />
              Full View
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" onClick={downloadSVG}>
              <Download className="w-4 h-4 mr-2" />
              SVG
            </Button>
            <Button size="sm" className="btn-hero" onClick={downloadPNG}>
              <Download className="w-4 h-4 mr-2" />
              PNG
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}

// Animation styles to be added to your CSS
export const kolamAnimationStyles = `
@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

.animate-draw {
  animation: draw 2s ease-in-out forwards;
}

@keyframes kolam-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(212, 175, 55, 0.6);
  }
}

.animate-kolam-glow {
  animation: kolam-glow 2s ease-in-out infinite;
}
`;
