import { PatternAnalyzer } from "@/components/PatternAnalyzer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, BookOpen, Zap, Target } from "lucide-react";

const tips = [
  {
    icon: Target,
    title: "Best Image Quality",
    description: "Use clear, well-lit images with minimal background noise for accurate analysis"
  },
  {
    icon: Zap,
    title: "Pattern Recognition",
    description: "Our AI can identify over 50 different traditional kolam pattern types and variations"
  },
  {
    icon: BookOpen,
    title: "Cultural Context",
    description: "Each analysis includes historical significance and regional variations of the pattern"
  },
  {
    icon: Lightbulb,
    title: "Learning Insights",
    description: "Discover mathematical principles like symmetry, geometry, and proportional relationships"
  }
];

export default function Analyze() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-traditional font-bold text-primary">
          Pattern Analysis Studio
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Upload your kolam images and unlock the secrets of traditional South Indian geometric art. 
          Our AI analyzes dot patterns, symmetry, and cultural significance.
        </p>
      </div>

      {/* Main Analyzer */}
      <PatternAnalyzer />

      {/* Tips Section */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-traditional font-bold text-primary mb-4">
            Analysis Tips & Features
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get the most out of your kolam analysis with these helpful insights
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {tips.map((tip, index) => (
            <Card key={index} className="card-traditional">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                    <tip.icon className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg font-traditional">
                    {tip.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {tip.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Technical Details */}
      <section className="bg-primary/5 rounded-2xl p-8">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-traditional font-bold text-primary">
            Powered by Advanced AI
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our analysis engine uses state-of-the-art computer vision and machine learning models 
            trained on thousands of traditional kolam patterns from across South India.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">50+</p>
              <p className="text-sm text-muted-foreground">Pattern Types</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">94%</p>
              <p className="text-sm text-muted-foreground">Accuracy Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">&lt;5s</p>
              <p className="text-sm text-muted-foreground">Analysis Time</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">∞</p>
              <p className="text-sm text-muted-foreground">Cultural Insights</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}