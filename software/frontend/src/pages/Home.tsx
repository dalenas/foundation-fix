import { useNavigate } from "react-router-dom";
import { Bluetooth, Image, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AboutSection from "@/components/AboutSection";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 bg-background border-b border-border">
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-semibold text-primary">Foundation Fix</span>
        </div>
        <div className="flex items-center gap-6">
          <Button 
            variant="ghost" 
            className="gap-2"
            onClick={() => navigate("/device")}
          >
            <Bluetooth className="w-4 h-4" />
            Device
          </Button>
          <Button 
            variant="ghost" 
            className="gap-2"
            onClick={() => navigate("/library")}
          >
            <Image className="w-4 h-4" />
            Library
          </Button>
          <Button 
            variant="ghost"
            onClick={() => navigate("/profile")}
          >
            Profile
          </Button>
        </div>
      </nav>

      {/* Hero Section - Your existing hero content */}
      <section className="py-20 px-4 text-center bg-gradient-to-b from-background to-secondary/20">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-8">
            <Palette className="w-4 h-4" />
            <span className="text-sm font-medium">Your Perfect Foundation Match</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-primary">Custom Foundation</span>
            <br />
            <span className="text-foreground">Crafted for You</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Experience the future of personalized beauty. Create, store, and perfect your
            custom foundation formulas with our intelligent blending system.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              className="gap-2 bg-primary hover:bg-primary/90"
              onClick={() => navigate("/device")}
            >
              <Bluetooth className="w-5 h-5" />
              Connect Device
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="gap-2"
              onClick={() => navigate("/library")}
            >
              <Image className="w-5 h-5" />
              View Library
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section - Your existing features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-2 border-border hover:border-primary/50 transition-all">
            <CardContent className="pt-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Palette className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Custom Formulas</h3>
              <p className="text-muted-foreground">
                Create and save unlimited custom foundation formulas tailored to your
                unique skin tone and preferences.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border hover:border-primary/50 transition-all">
            <CardContent className="pt-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Image className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Visual Library</h3>
              <p className="text-muted-foreground">
                Store photos and detailed notes for each formula. Track your perfect
                matches over time.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-border hover:border-primary/50 transition-all">
            <CardContent className="pt-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <Bluetooth className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Connection</h3>
              <p className="text-muted-foreground">
                Seamlessly sync with your foundation machine via Bluetooth for instant
                formula application.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* About Section - ADD THIS */}
      <AboutSection />
    </div>
  );
};

export default Home;