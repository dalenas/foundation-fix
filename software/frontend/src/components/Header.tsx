import { Link, useLocation } from "react-router-dom";
import { Palette, User, Image } from "lucide-react";
import { Button } from "./ui/button";

const RaspberryPiIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M12 2C10.8954 2 10 2.89543 10 4V6H8V4C8 2.89543 7.10457 2 6 2C4.89543 2 4 2.89543 4 4V6H2V8H22V6H20V4C20 2.89543 19.1046 2 18 2C16.8954 2 16 2.89543 16 4V6H14V4C14 2.89543 13.1046 2 12 2ZM2 10V22H22V10H2ZM12 12C13.6569 12 15 13.3431 15 15C15 16.6569 13.6569 18 12 18C10.3431 18 9 16.6569 9 15C9 13.3431 10.3431 12 12 12Z" />
  </svg>
);

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
                <RaspberryPiIcon className="w-4 h-4" />
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
