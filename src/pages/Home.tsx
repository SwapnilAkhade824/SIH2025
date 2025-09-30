import { Link } from "react-router-dom";
import { PatternAnalyzer } from "@/components/PatternAnalyzer";
import {
  Scan,
  Palette,
  Users,
  GamepadIcon,
  Sparkles,
  ArrowRight,
  Eye,
  Brain,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: Scan,
    title: "Pattern Analysis",
    description:
      "AI-powered analysis of traditional kolam patterns with detailed insights",
    href: "/analyze",
    color: "from-primary to-primary-light",
  },
  {
    icon: Palette,
    title: "Recreation Tools",
    description:
      "Create beautiful kolam designs with digital tools and templates",
    href: "/create",
    color: "from-accent to-kolam-gold",
  },
  {
    icon: GamepadIcon,
    title: "Interactive Games",
    description: "Learn kolam principles through engaging dot-connecting games",
    href: "/games",
    color: "from-sacred-red to-primary",
  },
  {
    icon: Users,
    title: "Community Hub",
    description: "Share designs, compete with others, and celebrate heritage",
    href: "/community",
    color: "from-kolam-gold to-accent",
  },
];

const stats = [
  { label: "Patterns Analyzed", value: "2,500+", icon: Eye },
  { label: "AI Accuracy", value: "94.2%", icon: Brain },
  { label: "Active Users", value: "15K+", icon: Users },
  { label: "Cultural Insights", value: "∞", icon: Zap },
];

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8 sm:py-12">
        <div className="text-center space-y-6 sm:space-y-8 max-w-4xl mx-auto p-4">
          <div className="animate-traditional-fade">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-traditional font-bold bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent mb-4 sm:mb-6 p-4">
              Heritage Meets AI
              {/* <br /> */}
              <span className="relative">
                <div className="absolute -top-4 -right-8 animate-kolam-glow">
                  <Sparkles className="w-8 h-8 text-accent opacity-80" />
                </div>
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Discover the mathematical beauty and cultural significance of
              traditional kolam patterns through cutting-edge AI analysis and
              recreation tools.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-traditional-fade">
            <Link to="/analyze">
              <Button className="btn-hero">
                <Scan className="w-5 h-5 mr-2" />
                Start Analyzing
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/create">
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 border-primary/30 hover:bg-primary/5"
              >
                <Palette className="w-5 h-5 mr-2" />
                Create Patterns
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary/5 py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center space-y-2 animate-traditional-fade"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full mb-2">
                  <stat.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <p className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Pattern Analyzer */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-traditional font-bold text-primary mb-4">
            Analyze Your Kolam
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload an image of any kolam pattern and discover its hidden
            mathematical principles, symmetry patterns, and cultural
            significance powered by advanced AI.
          </p>
        </div>

        <PatternAnalyzer />
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-traditional font-bold text-primary mb-4">
            Explore Kolam Heritage
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Dive deep into the world of traditional South Indian art with our
            comprehensive suite of tools
          </p>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <Link key={index} to={feature.href} className="group">
              <Card className="card-traditional h-full group-hover:scale-[1.02] transition-all duration-300">
                <CardHeader>
                  <div
                    className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl mb-4`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-traditional group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-primary font-medium group-hover:translate-x-2 transition-transform">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 py-12 sm:py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-traditional font-bold text-primary">
              Join the Heritage Revolution
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              Be part of preserving and celebrating traditional South Indian art
              through modern technology. Start your journey with KOLAM AI today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/community">
                <Button className="btn-hero">
                  <Users className="w-5 h-5 mr-2" />
                  Join Community
                </Button>
              </Link>
              <Link to="/games">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 border-primary/30 hover:bg-primary/5"
                >
                  <GamepadIcon className="w-5 h-5 mr-2" />
                  Play Games
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
