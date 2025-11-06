import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, Heart, Edit } from "lucide-react";
import Header from "@/components/Header";

interface Formula {
  id: number;
  name: string;
  date: string;
  shade: string;
  coverage: string;
  finish: string;
  favorite: boolean;
}

const Library = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [formulas] = useState<Formula[]>([
    {
      id: 1,
      name: "Summer Glow",
      date: "2024-01-15",
      shade: "Medium Beige",
      coverage: "Light",
      finish: "Dewy",
      favorite: true,
    },
    {
      id: 2,
      name: "Evening Out",
      date: "2024-01-10",
      shade: "Medium Neutral",
      coverage: "Full",
      finish: "Matte",
      favorite: false,
    },
    {
      id: 3,
      name: "Daily Wear",
      date: "2024-01-05",
      shade: "Medium Warm",
      coverage: "Medium",
      finish: "Natural",
      favorite: true,
    },
  ]);

  const filteredFormulas = formulas.filter((formula) =>
    formula.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Your Library
              </h1>
              <p className="text-muted-foreground">Manage your custom foundation formulas</p>
            </div>
            <Button variant="elegant" size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              New Formula
            </Button>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search formulas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-border focus:border-primary"
              />
            </div>
          </div>

          {/* Formula Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFormulas.map((formula) => (
              <Card
                key={formula.id}
                className="group border-border hover:shadow-[var(--shadow-elegant)] transition-all duration-300 overflow-hidden"
              >
                <div className="h-40 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 relative">
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 rounded-full shadow-sm"
                    >
                      {formula.favorite ? (
                        <Heart className="w-4 h-4 fill-primary text-primary" />
                      ) : (
                        <Heart className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button variant="secondary" size="sm" className="gap-2">
                      <Edit className="w-4 h-4" />
                      Edit
                    </Button>
                  </div>
                </div>
                <CardContent className="p-5 space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {formula.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Created {new Date(formula.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="space-y-2 pt-2 border-t border-border">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shade:</span>
                      <span className="font-medium text-foreground">{formula.shade}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Coverage:</span>
                      <span className="font-medium text-foreground">{formula.coverage}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Finish:</span>
                      <span className="font-medium text-foreground">{formula.finish}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredFormulas.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No formulas found. Try a different search term.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Library;
