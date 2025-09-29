import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Grid3X3, 
  Sparkles, 
  Save, 
  Download, 
  Zap,
  Eye,
  Settings,
  Shapes,
  Repeat,
  RotateCw,
  Maximize2,
  Play,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { KolamRenderer } from "@/components/KolamRenderer";
import { GenerationParams as KolamGenerationParams } from "@/lib/kolam-generator";

const patternTypes = [
  { value: "radial", label: "Radial Pattern", description: "Central point with radiating elements" },
  { value: "linear", label: "Linear Pattern", description: "Sequential connected lines" },
  { value: "mandala", label: "Mandala Pattern", description: "Circular concentric design" },
  { value: "geometric", label: "Geometric Pattern", description: "Angular mathematical forms" },
  { value: "floral", label: "Floral Pattern", description: "Nature-inspired organic shapes" }
];

const shapeTypes = [
  { value: "circle", label: "Circles", icon: "○" },
  { value: "square", label: "Squares", icon: "□" },
  { value: "triangle", label: "Triangles", icon: "△" },
  { value: "diamond", label: "Diamonds", icon: "◇" },
  { value: "star", label: "Stars", icon: "✦" },
  { value: "lotus", label: "Lotus", icon: "❀" }
];

const templates = [
  {
    name: "Simple Grid",
    gridSize: 5,
    pattern: "radial",
    shapes: ["circle", "square"],
    complexity: "Beginner",
    preview: "5×5 Basic Grid"
  },
  {
    name: "Festival Mandala", 
    gridSize: 9,
    pattern: "mandala",
    shapes: ["circle", "lotus", "star"],
    complexity: "Intermediate",
    preview: "9×9 Mandala"
  },
  {
    name: "Temple Gateway",
    gridSize: 13,
    pattern: "geometric", 
    shapes: ["square", "diamond", "triangle"],
    complexity: "Advanced",
    preview: "13×13 Complex"
  }
];

interface GenerationParams {
  gridSize: number[];
  patternType: string;
  selectedShapes: string[];
  complexity: number[];
  symmetry: string;
  loops: number[];
  spacing: number[];
}

export default function Create() {
  const [params, setParams] = useState<GenerationParams>({
    gridSize: [7],
    patternType: "",
    selectedShapes: [],
    complexity: [5],
    symmetry: "radial",
    loops: [3],
    spacing: [2]
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [showVisualPattern, setShowVisualPattern] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [savedParams, setSavedParams] = useState<GenerationParams[]>([]);
  const [patternVariants, setPatternVariants] = useState<KolamGenerationParams[]>([]);
  const { toast } = useToast();

  // Load saved parameters from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('kolamParams');
    if (saved) {
      try {
        const parsedSaved = JSON.parse(saved);
        setSavedParams(parsedSaved);
      } catch (error) {
        console.error('Failed to load saved parameters:', error);
      }
    }
  }, []);

  const handleShapeToggle = (shape: string) => {
    setParams(prev => ({
      ...prev,
      selectedShapes: prev.selectedShapes.includes(shape)
        ? prev.selectedShapes.filter(s => s !== shape)
        : [...prev.selectedShapes, shape]
    }));
  };

  const handleTemplateSelect = (template: typeof templates[0]) => {
    setParams({
      gridSize: [template.gridSize],
      patternType: template.pattern,
      selectedShapes: template.shapes,
      complexity: [template.gridSize > 9 ? 8 : template.gridSize > 5 ? 6 : 4],
      symmetry: template.pattern === "mandala" ? "radial" : "bilateral",
      loops: [Math.floor(template.gridSize / 3)],
      spacing: [2]
    });
    setShowVisualPattern(true);
  };

  // Convert local params to kolam generation params
  const getKolamParams = (): KolamGenerationParams => ({
    gridSize: params.gridSize[0],
    patternType: params.patternType,
    selectedShapes: params.selectedShapes,
    complexity: params.complexity[0],
    symmetry: params.symmetry,
    loops: params.loops[0],
    spacing: params.spacing[0]
  });

  const handlePreview = () => {
    if (!params.patternType || params.selectedShapes.length === 0) {
      toast({
        title: "Missing Parameters",
        description: "Please select pattern type and at least one shape to preview",
        variant: "destructive"
      });
      return;
    }
    
    const newPreviewState = !showPreview;
    setShowPreview(newPreviewState);
    setShowVisualPattern(newPreviewState);
    
    if (newPreviewState) {
      toast({
        title: "Preview Enabled",
        description: "Pattern preview is now visible"
      });
    } else {
      toast({
        title: "Preview Hidden",
        description: "Pattern preview has been hidden"
      });
    }
  };

  const generateVariants = () => {
    if (!params.patternType || params.selectedShapes.length === 0) {
      toast({
        title: "Missing Parameters",
        description: "Please configure parameters first",
        variant: "destructive"
      });
      return;
    }

    const baseParams = getKolamParams();
    const variants: KolamGenerationParams[] = [];

    // Generate 3 variants with different parameters
    for (let i = 0; i < 3; i++) {
      variants.push({
        ...baseParams,
        complexity: Math.max(1, Math.min(10, baseParams.complexity + (i - 1) * 2)),
        loops: Math.max(1, Math.min(8, baseParams.loops + (i - 1))),
        symmetry: i === 0 ? 'radial' : i === 1 ? 'bilateral' : 'rotational'
      });
    }

    setPatternVariants(variants);
    toast({
      title: "Variants Generated!",
      description: "3 pattern variants created with different settings"
    });

    // Scroll to variants section
    setTimeout(() => {
      const variantsSection = document.getElementById('variants-section');
      if (variantsSection) {
        variantsSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }, 100);
  };

  const saveParameters = () => {
    if (!params.patternType || params.selectedShapes.length === 0) {
      toast({
        title: "Nothing to Save",
        description: "Please configure parameters first",
        variant: "destructive"
      });
      return;
    }

    const newSaved = [...savedParams, { ...params }];
    setSavedParams(newSaved);
    localStorage.setItem('kolamParams', JSON.stringify(newSaved));
    
    toast({
      title: "Parameters Saved!",
      description: "Your kolam configuration has been saved locally"
    });
  };

  const loadSavedParams = (savedParam: GenerationParams) => {
    setParams(savedParam);
    setShowVisualPattern(true);
    toast({
      title: "Parameters Loaded!",
      description: "Configuration restored successfully"
    });
  };

  const generateKolam = () => {
    if (!params.patternType || params.selectedShapes.length === 0) {
      toast({
        title: "Missing Parameters",
        description: "Please select pattern type and at least one shape",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setShowVisualPattern(true);
    
    // Simulate brief generation time for better UX
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Kolam Generated!",
        description: "Your custom kolam pattern has been created successfully"
      });
    }, 800);
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
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-6 mb-12">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl blur-3xl"></div>
          <div className="relative bg-gradient-to-br from-background to-kolam-cream/30 rounded-2xl p-8 border border-primary/20 shadow-[var(--shadow-traditional)]">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-4xl md:text-5xl font-traditional font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Kolam Recreation Studio
              </h1>
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-kolam-gold rounded-xl flex items-center justify-center shadow-lg">
                <Grid3X3 className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Create beautiful kolam patterns by configuring mathematical parameters. 
              Generate <span className="font-semibold text-primary">visual patterns</span> instantly, 
              explore <span className="font-semibold text-accent">cultural significance</span>, 
              and export your designs in high quality.
            </p>
            <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>5 Pattern Types</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>Real-time Generation</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-kolam-gold rounded-full"></div>
                <span>Export Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Parameters Panel */}
        <div className="space-y-6">
          {/* Grid Configuration */}
          <Card className="card-traditional">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Grid3X3 className="w-5 h-5 text-primary" />
                <span>Grid Configuration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Grid Size</Label>
                <div className="mt-2">
                  <Slider
                    value={params.gridSize}
                    onValueChange={(value) => setParams(prev => ({...prev, gridSize: value}))}
                    max={15}
                    min={3}
                    step={2}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>3×3</span>
                    <span className="font-medium text-primary">{params.gridSize[0]}×{params.gridSize[0]}</span>
                    <span>15×15</span>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Dot Spacing</Label>
                <div className="mt-2">
                  <Slider
                    value={params.spacing}
                    onValueChange={(value) => setParams(prev => ({...prev, spacing: value}))}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Spacing: {params.spacing[0]}x units
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pattern Type */}
          <Card className="card-traditional">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shapes className="w-5 h-5 text-primary" />
                <span>Pattern Type</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={params.patternType} onValueChange={(value) => setParams(prev => ({...prev, patternType: value}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select pattern style" />
                </SelectTrigger>
                <SelectContent>
                  {patternTypes.map((pattern) => (
                    <SelectItem key={pattern.value} value={pattern.value}>
                      <div>
                        <div className="font-medium">{pattern.label}</div>
                        <div className="text-xs text-muted-foreground">{pattern.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Shape Selection */}
          <Card className="card-traditional">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span>Shape Elements</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {shapeTypes.map((shape) => (
                  <Button
                    key={shape.value}
                    variant={params.selectedShapes.includes(shape.value) ? "default" : "outline"}
                    size="sm"
                    className={`justify-start ${
                      params.selectedShapes.includes(shape.value) 
                        ? "bg-gradient-to-r from-primary to-accent text-primary-foreground" 
                        : ""
                    }`}
                    onClick={() => handleShapeToggle(shape.value)}
                  >
                    <span className="mr-2 text-lg">{shape.icon}</span>
                    <span className="text-xs">{shape.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Advanced Parameters */}
          <Card className="card-traditional">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-primary" />
                <span>Advanced Settings</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Complexity Level</Label>
                <div className="mt-2">
                  <Slider
                    value={params.complexity}
                    onValueChange={(value) => setParams(prev => ({...prev, complexity: value}))}
                    max={10}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Level: {params.complexity[0]}/10
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Loop Count</Label>
                <div className="mt-2">
                  <Slider
                    value={params.loops}
                    onValueChange={(value) => setParams(prev => ({...prev, loops: value}))}
                    max={8}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Loops: {params.loops[0]} concentric layers
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Symmetry Type</Label>
                <div className="mt-2">
                  <Select value={params.symmetry} onValueChange={(value) => setParams(prev => ({...prev, symmetry: value}))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="radial">Radial Symmetry</SelectItem>
                      <SelectItem value="bilateral">Bilateral Symmetry</SelectItem>
                      <SelectItem value="rotational">Rotational Symmetry</SelectItem>
                      <SelectItem value="asymmetric">Asymmetric Flow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Generation Area */}
        <div className="generation-canvas space-y-6">
          {/* Controls */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-traditional font-bold text-primary">
              Generation Canvas
            </h2>
            <div className="flex items-center space-x-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handlePreview}
                disabled={!params.patternType || params.selectedShapes.length === 0}
                className="transition-all duration-200 hover:bg-primary/5"
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? 'Hide Preview' : 'Preview'}
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={generateVariants}
                disabled={!params.patternType || params.selectedShapes.length === 0}
                className="transition-all duration-200 hover:bg-accent/10"
              >
                <RotateCw className="w-4 h-4 mr-2" />
                Variants
              </Button>
            </div>
          </div>

          {/* Canvas */}
          {showVisualPattern && params.patternType && params.selectedShapes.length > 0 ? (
            <KolamRenderer 
              params={getKolamParams()} 
              animated={true}
              showControls={true}
            />
          ) : (
            <Card className="card-traditional">
              <CardContent className="p-8">
                <div className="aspect-square bg-gradient-to-br from-background to-kolam-cream/30 rounded-xl border-2 border-dashed border-primary/20 flex items-center justify-center dot-pattern">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto">
                      <Zap className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="text-xl font-traditional font-semibold text-primary mb-2">
                        Ready to Generate
                      </h3>
                      <p className="text-muted-foreground max-w-sm">
                        Configure your parameters and click generate to create a custom kolam pattern
                      </p>
                    </div>
                    <Button 
                      className="btn-hero" 
                      onClick={generateKolam}
                      disabled={isGenerating || !params.patternType || params.selectedShapes.length === 0}
                    >
                      {isGenerating ? (
                        <>
                          <Repeat className="w-4 h-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Generate Kolam
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}


          {/* Pattern Stats */}
          {showVisualPattern && (
            <div className="grid grid-cols-4 gap-4">
              <Card className="analysis-card">
                <CardContent className="flex flex-col items-center justify-center h-20 p-4">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {params.gridSize[0] * params.gridSize[0]}
                  </div>
                  <div className="text-sm text-muted-foreground text-center">Dots</div>
                </CardContent>
              </Card>
              <Card className="analysis-card">
                <CardContent className="flex flex-col items-center justify-center h-20 p-4">
                  <div className="text-2xl font-bold text-accent mb-1">
                    {params.loops[0] * 4}
                  </div>
                  <div className="text-sm text-muted-foreground text-center">Paths</div>
                </CardContent>
              </Card>
              <Card className="analysis-card">
                <CardContent className="flex flex-col items-center justify-center h-20 p-4">
                  <div className="text-2xl font-bold text-kolam-gold mb-1">
                    {params.complexity[0]}
                  </div>
                  <div className="text-sm text-muted-foreground text-center">Level</div>
                </CardContent>
              </Card>
              <Card className="analysis-card">
                <CardContent className="flex flex-col items-center justify-center h-20 p-4">
                  <div className="text-lg font-bold text-sacred-red mb-1 capitalize">
                    {params.symmetry}
                  </div>
                  <div className="text-sm text-muted-foreground text-center">Symmetry</div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Templates & Quick Actions */}
        <div className="space-y-6">
          {/* Quick Templates */}
          <Card className="card-traditional">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-primary" />
                <span>Quick Templates</span>
              </CardTitle>
              <CardDescription>
                Pre-configured parameter sets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {templates.map((template, index) => (
                <div 
                  key={index}
                  className="p-3 border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors cursor-pointer"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-primary text-sm">{template.name}</h4>
                    <Badge className={getDifficultyColor(template.complexity)}>
                      {template.complexity}
                    </Badge>
                  </div>
                  
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Grid: {template.gridSize}×{template.gridSize}</div>
                    <div>Pattern: {template.pattern}</div>
                    <div>Shapes: {template.shapes.join(', ')}</div>
                  </div>
                  
                  <Button size="sm" variant="outline" className="w-full mt-2 h-6 text-xs">
                    Load Template
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="card-traditional">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-primary" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full justify-start transition-all duration-200 hover:bg-primary/5"
                onClick={saveParameters}
                disabled={!params.patternType || params.selectedShapes.length === 0}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Parameters
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full justify-start transition-all duration-200 hover:bg-accent/10"
                disabled={!showVisualPattern}
                onClick={() => {
                  if (showVisualPattern) {
                    toast({
                      title: "Export Available",
                      description: "Use the download buttons in the pattern view above"
                    });
                  }
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Pattern
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full justify-start transition-all duration-200 hover:bg-kolam-gold/10"
                onClick={generateVariants}
                disabled={!params.patternType || params.selectedShapes.length === 0}
              >
                <Repeat className="w-4 h-4 mr-2" />
                Generate Variants
              </Button>
            </CardContent>
          </Card>

          {/* Parameter Summary */}
          <Card className="card-traditional">
            <CardHeader>
              <CardTitle className="text-lg">Current Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Grid:</span>
                <span className="font-medium">{params.gridSize[0]}×{params.gridSize[0]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pattern:</span>
                <span className="font-medium">{params.patternType || "Not selected"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shapes:</span>
                <span className="font-medium">{params.selectedShapes.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Complexity:</span>
                <span className="font-medium">{params.complexity[0]}/10</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Symmetry:</span>
                <span className="font-medium">{params.symmetry}</span>
              </div>
            </CardContent>
          </Card>


          {/* Saved Parameters */}
          {savedParams.length > 0 && (
            <Card className="card-traditional">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Save className="w-5 h-5 text-primary" />
                  <span>Saved Configurations</span>
                </CardTitle>
                <CardDescription>
                  Your previously saved kolam parameters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {savedParams.map((saved, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors"
                    >
                      <div className="text-sm">
                        <div className="font-medium">{saved.patternType} Pattern</div>
                        <div className="text-muted-foreground">
                          {saved.gridSize[0]}×{saved.gridSize[0]} • {saved.selectedShapes.join(', ')}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => loadSavedParams(saved)}
                        >
                          Load
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            const newSaved = savedParams.filter((_, i) => i !== index);
                            setSavedParams(newSaved);
                            localStorage.setItem('kolamParams', JSON.stringify(newSaved));
                            toast({
                              title: "Configuration Deleted",
                              description: "Saved parameters removed"
                            });
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Full-Width Pattern Variants Section */}
      {patternVariants.length > 0 && (
        <div id="variants-section" className="mt-12 animate-traditional-fade">
          <Card className="card-traditional">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-3 text-3xl font-traditional">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Pattern Variants
                </span>
                <div className="w-10 h-10 bg-gradient-to-br from-accent to-kolam-gold rounded-xl flex items-center justify-center">
                  <RotateCw className="w-5 h-5 text-primary-foreground" />
                </div>
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Explore different variations of your kolam pattern with adjusted parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {patternVariants.map((variant, index) => (
                  <div key={index} className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-kolam-gold/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                    <Card className="relative bg-gradient-to-br from-background to-kolam-cream/30 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-[var(--shadow-elevated)] hover:-translate-y-2">
                      <CardHeader className="text-center pb-4">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <Badge 
                            variant="outline" 
                            className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-none px-4 py-1"
                          >
                            Variant {index + 1}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {variant.symmetry} • Complexity {variant.complexity}/10
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="relative overflow-hidden rounded-xl">
                          <KolamRenderer 
                            params={variant}
                            showControls={false}
                            animated={false}
                          />
                        </div>
                        
                        <div className="grid grid-cols-4 gap-2">
                          <div className="flex flex-col items-center justify-center p-3 bg-primary/5 rounded-lg border border-primary/10 h-16">
                            <div className="text-lg font-bold text-primary">{variant.gridSize * variant.gridSize}</div>
                            <div className="text-xs text-muted-foreground text-center">Dots</div>
                          </div>
                          <div className="flex flex-col items-center justify-center p-3 bg-accent/5 rounded-lg border border-accent/10 h-16">
                            <div className="text-lg font-bold text-accent">{variant.loops * 4}</div>
                            <div className="text-xs text-muted-foreground text-center">Paths</div>
                          </div>
                          <div className="flex flex-col items-center justify-center p-3 bg-kolam-gold/5 rounded-lg border border-kolam-gold/10 h-16">
                            <div className="text-lg font-bold text-kolam-gold">{variant.complexity}</div>
                            <div className="text-xs text-muted-foreground text-center">Level</div>
                          </div>
                          <div className="flex flex-col items-center justify-center p-3 bg-sacred-red/5 rounded-lg border border-sacred-red/10 h-16">
                            <div className="text-sm font-bold text-sacred-red capitalize">{variant.symmetry}</div>
                            <div className="text-xs text-muted-foreground text-center">Symmetry</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Button 
                            className="w-full btn-hero"
                            onClick={() => {
                              setParams({
                                gridSize: [variant.gridSize],
                                patternType: variant.patternType,
                                selectedShapes: variant.selectedShapes,
                                complexity: [variant.complexity],
                                symmetry: variant.symmetry,
                                loops: [variant.loops],
                                spacing: [variant.spacing]
                              });
                              setShowVisualPattern(true);
                              toast({
                                title: "Variant Applied!",
                                description: `Variant ${index + 1} parameters loaded successfully`
                              });
                              // Scroll back to generation area
                              setTimeout(() => {
                                const generationArea = document.querySelector('.generation-canvas');
                                if (generationArea) {
                                  generationArea.scrollIntoView({ 
                                    behavior: 'smooth', 
                                    block: 'center' 
                                  });
                                }
                              }, 100);
                            }}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Use This Variant
                          </Button>
                          
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => {
                                // Create a temporary KolamRenderer for export
                                const tempDiv = document.createElement('div');
                                tempDiv.style.position = 'absolute';
                                tempDiv.style.left = '-9999px';
                                document.body.appendChild(tempDiv);
                                
                                toast({
                                  title: "Export Feature",
                                  description: "Apply variant first, then use export buttons in the main canvas"
                                });
                                
                                document.body.removeChild(tempDiv);
                              }}
                            >
                              <Download className="w-3 h-3 mr-1" />
                              Export
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => {
                                const variantParams = {
                                  gridSize: [variant.gridSize],
                                  patternType: variant.patternType,
                                  selectedShapes: variant.selectedShapes,
                                  complexity: [variant.complexity],
                                  symmetry: variant.symmetry,
                                  loops: [variant.loops],
                                  spacing: [variant.spacing]
                                };
                                
                                const newSaved = [...savedParams, variantParams];
                                setSavedParams(newSaved);
                                localStorage.setItem('kolamParams', JSON.stringify(newSaved));
                                
                                toast({
                                  title: "Variant Saved!",
                                  description: `Variant ${index + 1} saved to your configurations`
                                });
                              }}
                            >
                              <Save className="w-3 h-3 mr-1" />
                              Save
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex items-center justify-center space-x-4">
                <Button 
                  variant="outline" 
                  onClick={generateVariants}
                  className="transition-all duration-200 hover:bg-accent/10"
                >
                  <RotateCw className="w-4 h-4 mr-2" />
                  Generate New Variants
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setPatternVariants([]);
                    toast({
                      title: "Variants Cleared",
                      description: "All pattern variants have been removed"
                    });
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear All Variants
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}