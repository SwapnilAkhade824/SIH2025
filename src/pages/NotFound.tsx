import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Home, 
  Search, 
  ArrowLeft, 
  Sparkles,
  Grid3X3,
  Star,
  RotateCcw
} from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-kolam-cream/30 to-background relative overflow-hidden">
      {/* Background Kolam Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="kolam-pattern w-full h-full"></div>
      </div>
      
      {/* Floating Kolam Elements */}
      <div className="absolute top-20 left-20 w-16 h-16 opacity-20">
        <svg viewBox="0 0 100 100" className="w-full h-full text-primary animate-spin" style={{ animationDuration: '20s' }}>
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2"/>
          <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="2"/>
          <circle cx="50" cy="50" r="10" fill="currentColor"/>
          <circle cx="50" cy="20" r="3" fill="currentColor"/>
          <circle cx="80" cy="50" r="3" fill="currentColor"/>
          <circle cx="50" cy="80" r="3" fill="currentColor"/>
          <circle cx="20" cy="50" r="3" fill="currentColor"/>
        </svg>
      </div>
      
      <div className="absolute top-40 right-32 w-12 h-12 opacity-15">
        <svg viewBox="0 0 100 100" className="w-full h-full text-accent animate-pulse">
          <path d="M50 10 L70 30 L90 50 L70 70 L50 90 L30 70 L10 50 L30 30 Z" 
                fill="none" stroke="currentColor" strokeWidth="3"/>
          <circle cx="50" cy="50" r="8" fill="currentColor"/>
        </svg>
      </div>
      
      <div className="absolute bottom-32 left-32 w-20 h-20 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full text-kolam-gold animate-bounce" style={{ animationDuration: '3s' }}>
          <path d="M50 5 L60 35 L90 35 L68 57 L78 87 L50 70 L22 87 L32 57 L10 35 L40 35 Z" 
                fill="currentColor"/>
        </svg>
      </div>

      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="card-traditional max-w-2xl w-full text-center relative">
          {/* Decorative border */}
          <div className="absolute inset-0 rounded-2xl border-4 border-primary/10 animate-pulse"></div>
          
          <CardContent className="p-12 space-y-8">
            {/* 404 with Kolam Design */}
            <div className="relative">
              <div className="text-8xl md:text-9xl font-traditional font-bold text-transparent bg-gradient-to-br from-primary via-accent to-kolam-gold bg-clip-text mb-4">
                404
              </div>
              
              {/* Kolam dots around 404 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* Top dots */}
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <div className="w-3 h-3 bg-kolam-gold rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  </div>
                  
                  {/* Side dots */}
                  <div className="absolute top-1/2 left-4 transform -translate-y-1/2 flex flex-col space-y-4">
                    <div className="w-3 h-3 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.7s' }}></div>
                  </div>
                  
                  <div className="absolute top-1/2 right-4 transform -translate-y-1/2 flex flex-col space-y-4">
                    <div className="w-3 h-3 bg-kolam-gold rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                    <div className="w-3 h-3 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.8s' }}></div>
                  </div>
                  
                  {/* Bottom dots */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                    <div className="w-3 h-3 bg-kolam-gold rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.9s' }}></div>
                    <div className="w-3 h-3 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                <h1 className="text-2xl md:text-3xl font-traditional font-bold text-primary">
                  Pattern Not Found
                </h1>
                <Sparkles className="w-6 h-6 text-accent animate-pulse" />
              </div>
              
              <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                Oops! It seems like this path doesn't lead to any kolam patterns. 
                The page you're looking for has wandered off like rice flour in the wind.
              </p>
              
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Grid3X3 className="w-4 h-4" />
                <span>Let's get you back to creating beautiful patterns</span>
                <Star className="w-4 h-4" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 relative z-10">
              <button 
                onClick={() => window.location.href = '/'}
                className="btn-hero min-w-[160px] flex items-center justify-center px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-primary via-primary-light to-accent text-primary-foreground shadow-[var(--shadow-kolam)] border border-primary/20 transition-[var(--transition-traditional)] hover:shadow-[var(--shadow-elevated)] hover:scale-105 active:scale-95"
              >
                <Home className="w-4 h-4 mr-2" />
                Return Home
              </button>
              
              <button 
                onClick={() => window.location.href = '/create'}
                className="min-w-[160px] flex items-center justify-center px-6 py-3 rounded-xl font-medium border border-primary/20 bg-background hover:bg-primary/5 transition-all duration-200"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Create Kolam
              </button>
              
              <button 
                onClick={() => window.location.href = '/community'}
                className="min-w-[160px] flex items-center justify-center px-6 py-3 rounded-xl font-medium border border-primary/20 bg-background hover:bg-accent/10 transition-all duration-200"
              >
                <Search className="w-4 h-4 mr-2" />
                Explore Community
              </button>
            </div>

            {/* Go Back Option */}
            <div className="pt-4 border-t border-primary/10">
              <Button 
                variant="ghost" 
                onClick={() => window.history.back()}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back to Previous Page
              </Button>
            </div>

            {/* Decorative Elements */}
            <div className="flex items-center justify-center space-x-8 pt-6 opacity-60">
              <div className="w-8 h-8 border-2 border-primary/30 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
              </div>
              <div className="w-1 h-8 bg-gradient-to-b from-primary/30 to-transparent"></div>
              <div className="w-8 h-8 border-2 border-accent/30 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
              </div>
              <div className="w-1 h-8 bg-gradient-to-b from-accent/30 to-transparent"></div>
              <div className="w-8 h-8 border-2 border-kolam-gold/30 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-kolam-gold rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional floating elements */}
      <div className="absolute bottom-20 right-20 w-14 h-14 opacity-10">
        <svg viewBox="0 0 100 100" className="w-full h-full text-primary animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
          <path d="M50 10 L90 50 L50 90 L10 50 Z" fill="none" stroke="currentColor" strokeWidth="2"/>
          <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="2"/>
          <circle cx="50" cy="50" r="5" fill="currentColor"/>
        </svg>
      </div>
    </div>
  );
};

export default NotFound;
