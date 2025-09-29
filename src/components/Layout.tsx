import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Scan,
  Palette,
  Users,
  GamepadIcon,
  Menu,
  X,
  Sparkles,
  Home,
} from "lucide-react";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Analyze", href: "/analyze", icon: Scan },
  { name: "Create", href: "/create", icon: Palette },
  { name: "Games", href: "/games", icon: GamepadIcon },
  { name: "Community", href: "/community", icon: Users },
];

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background kolam-pattern">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-primary/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center animate-kolam-glow">
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-traditional font-bold text-primary">
                  KOLAM AI
                </h1>
                <p className="text-xs text-muted-foreground font-medium">
                  by HeritageXtech
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn("nav-dashboard", isActive && "active")}
                  >
                    <item.icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile & Tablet menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-primary/5 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile & Tablet Navigation */}
          {mobileMenuOpen && (
            <nav className="lg:hidden py-4 border-t border-primary/10 animate-traditional-fade">
              <div className="space-y-2">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center px-4 py-3 rounded-lg font-medium transition-all",
                        isActive
                          ? "bg-gradient-to-r from-primary to-primary-light text-primary-foreground"
                          : "hover:bg-primary/5 hover:text-primary"
                      )}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-primary/5 border-t border-primary/10 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-traditional font-semibold text-primary text-lg">
                KOLAM AI
              </span>
            </div>
            <p className="text-muted-foreground mb-2">
              Preserving traditional heritage through modern AI technology
            </p>
            <p className="text-sm text-muted-foreground">
              Crafted with ♥ by{" "}
              <span className="font-semibold text-primary">HeritageXtech</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
