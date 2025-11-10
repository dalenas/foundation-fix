import { Link, useLocation } from "react-router-dom";
import { Palette, User, Image, Bluetooth } from "lucide-react";
import { Button } from "./ui/button";

const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-[var(--shadow-soft)] group-hover:shadow-[var(--shadow-medium)] transition-all duration-300">
              <Palette className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Foundation Fix
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link to="/device">
              <Button
                variant={isActive("/device") ? "default" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <Bluetooth className="w-4 h-4" />
                Device
              </Button>
            </Link>
            <Link to="/library">
              <Button
                variant={isActive("/library") ? "default" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <Image className="w-4 h-4" />
                Library
              </Button>
            </Link>
            <Link to="/profile">
              <Button
                variant={isActive("/profile") ? "default" : "ghost"}
                size="sm"
                className="gap-2"
              >
                <User className="w-4 h-4" />
                Profile
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
