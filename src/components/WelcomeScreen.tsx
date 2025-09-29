import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

interface WelcomeScreenProps {
  onComplete: () => void;
}

export function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300); // Allow fade out animation to complete
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-primary via-primary-dark to-accent flex items-center justify-center transition-opacity duration-300 opacity-0 pointer-events-none">
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-primary via-primary-dark to-accent flex items-center justify-center transition-opacity duration-300">
      <div className="text-center space-y-6 animate-traditional-fade">
        <div className="relative">
          <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center mx-auto animate-kolam-glow backdrop-blur-sm">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-traditional font-bold text-white">
            KOLAM AI
          </h1>
          <p className="text-xl text-white/80 font-medium">
            by HeritageXtech
          </p>
        </div>
        
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}