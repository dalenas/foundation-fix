import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Palette, Camera, Bluetooth } from "lucide-react";
import Header from "@/components/Header";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-accent opacity-40" />
          
          <div className="container mx-auto px-6 py-24 relative">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 backdrop-blur-sm border border-primary/20 mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Your Perfect Foundation Match</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                  Custom Foundation
                </span>
                <br />
                <span className="text-foreground">Crafted for You</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Experience the future of personalized beauty. Create, store, and perfect your custom foundation formulas with our intelligent blending system.
              </p>
              
              <div className="flex items-center justify-center gap-4 pt-4">
                <Link to="/device">
                  <Button variant="elegant" size="lg" className="gap-2">
                    <Bluetooth className="w-5 h-5" />
                    Connect Device
                  </Button>
                </Link>
                <Link to="/library">
                  <Button variant="outline" size="lg" className="gap-2">
                    <Camera className="w-5 h-5" />
                    View Library
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-gradient-to-b from-background to-secondary/20">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="group p-8 rounded-2xl bg-card border border-border hover:shadow-[var(--shadow-elegant)] transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Palette className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">Custom Formulas</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Create and save unlimited custom foundation formulas tailored to your unique skin tone and preferences.
                </p>
              </div>

              <div className="group p-8 rounded-2xl bg-card border border-border hover:shadow-[var(--shadow-elegant)] transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Camera className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">Visual Library</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Store photos and detailed notes for each formula. Track your perfect matches over time.
                </p>
              </div>

              <div className="group p-8 rounded-2xl bg-card border border-border hover:shadow-[var(--shadow-elegant)] transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Bluetooth className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">Smart Connection</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Seamlessly sync with your foundation machine via Bluetooth for instant formula application.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
