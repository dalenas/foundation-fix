import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, Heart, Edit, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import { toast } from "sonner";

interface Formula {
  id: number;
  name: string;
  date: string;
  shade: string;
  coverage: string;
  finish: string;
  favorite: boolean;
}

const PROFILE_STORAGE_KEY = "foundation-fix-profile";
const FORMULA_STORAGE_PREFIX = "foundation-fix-formulas-";

const Library = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [formulas, setFormulas] = useState<Formula[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [profileKey, setProfileKey] = useState<string | null>(null);

  const [draft, setDraft] = useState<Omit<Formula, "id" | "date">>({
    name: "",
    shade: "",
    coverage: "",
    finish: "",
    favorite: false,
  });

  // Determine profile key (based on profile email) and load formulas for that profile
  useEffect(() => {
    if (typeof window === "undefined") return;

    let key = "guest";

    const savedProfile = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        if (parsed?.email) {
          key = String(parsed.email).toLowerCase();
        }
      } catch (e) {
        console.error("Failed to parse profile for formulas", e);
      }
    }

    setProfileKey(key);

    const savedFormulas = window.localStorage.getItem(
      FORMULA_STORAGE_PREFIX + key
    );
    if (savedFormulas) {
      try {
        const parsed: Formula[] = JSON.parse(savedFormulas);
        setFormulas(parsed);
      } catch (e) {
        console.error("Failed to parse saved formulas", e);
      }
    }
  }, []);

  // Persist formulas whenever they change for this profile
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!profileKey) return;

    window.localStorage.setItem(
      FORMULA_STORAGE_PREFIX + profileKey,
      JSON.stringify(formulas)
    );
  }, [formulas, profileKey]);

  const startNewFormula = () => {
    setIsEditing(true);
    setEditingId(null);
    setDraft({
      name: "",
      shade: "",
      coverage: "",
      finish: "",
      favorite: false,
    });
  };

  const startEditFormula = (formula: Formula) => {
    setIsEditing(true);
    setEditingId(formula.id);
    setDraft({
      name: formula.name,
      shade: formula.shade,
      coverage: formula.coverage,
      finish: formula.finish,
      favorite: formula.favorite,
    });
  };

  const handleSaveDraft = () => {
    if (!draft.name.trim()) {
      toast.error("Please give your formula a name.");
      return;
    }

    const now = new Date().toISOString();

    if (editingId === null) {
      // create new
      const newFormula: Formula = {
        id: Date.now(),
        date: now,
        ...draft,
      };
      setFormulas((prev) => [newFormula, ...prev]);
      toast.success("New formula created!");
    } else {
      // update existing
      setFormulas((prev) =>
        prev.map((f) =>
          f.id === editingId
            ? {
                ...f,
                name: draft.name,
                shade: draft.shade,
                coverage: draft.coverage,
                finish: draft.finish,
                favorite: draft.favorite,
              }
            : f
        )
      );
      toast.success("Formula updated!");
    }

    setIsEditing(false);
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
  };

  const toggleFavorite = (id: number) => {
    setFormulas((prev) =>
      prev.map((f) => (f.id === id ? { ...f, favorite: !f.favorite } : f))
    );
  };

  const deleteFormula = (id: number) => {
    setFormulas((prev) => prev.filter((f) => f.id !== id));
    toast.success("Formula deleted.");
  };

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
              <p className="text-muted-foreground">
                Manage your custom foundation formulas
              </p>
            </div>
            <Button
              variant="elegant"
              size="lg"
              className="gap-2"
              type="button"
              onClick={startNewFormula}
            >
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

          {/* Editor Card (create/edit) */}
          {isEditing && (
            <div className="mb-8">
              <Card className="border-border shadow-[var(--shadow-soft)]">
                <CardContent className="p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-foreground">
                      {editingId === null ? "New Formula" : "Edit Formula"}
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1">
                        Name
                      </label>
                      <Input
                        value={draft.name}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, name: e.target.value }))
                        }
                        className="border-border focus:border-primary"
                        placeholder="e.g. Summer Glow"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1">
                        Shade
                      </label>
                      <Input
                        value={draft.shade}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, shade: e.target.value }))
                        }
                        className="border-border focus:border-primary"
                        placeholder="e.g. Medium Neutral"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1">
                        Coverage
                      </label>
                      <Input
                        value={draft.coverage}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, coverage: e.target.value }))
                        }
                        className="border-border focus:border-primary"
                        placeholder="Light / Medium / Full"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground block mb-1">
                        Finish
                      </label>
                      <Input
                        value={draft.finish}
                        onChange={(e) =>
                          setDraft((d) => ({ ...d, finish: e.target.value }))
                        }
                        className="border-border focus:border-primary"
                        placeholder="Matte / Dewy / Natural"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      type="button"
                      variant={draft.favorite ? "elegant" : "outline"}
                      size="sm"
                      className="gap-2"
                      onClick={() =>
                        setDraft((d) => ({ ...d, favorite: !d.favorite }))
                      }
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          draft.favorite ? "fill-primary text-primary" : ""
                        }`}
                      />
                      {draft.favorite ? "Marked as Favorite" : "Mark Favorite"}
                    </Button>

                    <div className="ml-auto flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        variant="elegant"
                        onClick={handleSaveDraft}
                      >
                        Save Formula
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Formula Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFormulas.map((formula) => (
              <Card
                key={formula.id}
                className="group border-border hover:shadow-[var(--shadow-elegant)] transition-all duration-300 overflow-hidden"
              >
                <div className="h-40 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 relative">
                  {/* TOP-RIGHT BUTTONS ABOVE OVERLAY */}
                  <div className="absolute top-3 right-3 flex gap-2 z-10">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 rounded-full shadow-sm"
                      type="button"
                      onClick={() => toggleFavorite(formula.id)}
                    >
                      {formula.favorite ? (
                        <Heart className="w-4 h-4 fill-primary text-primary" />
                      ) : (
                        <Heart className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8 rounded-full shadow-sm"
                      type="button"
                      onClick={() => deleteFormula(formula.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* HOVER OVERLAY, IGNORE CLICKS EXCEPT BUTTON */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="gap-2 pointer-events-auto"
                      type="button"
                      onClick={() => startEditFormula(formula)}
                    >
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
                      <span className="font-medium text-foreground">
                        {formula.shade}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Coverage:</span>
                      <span className="font-medium text-foreground">
                        {formula.coverage}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Finish:</span>
                      <span className="font-medium text-foreground">
                        {formula.finish}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredFormulas.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No formulas yet for this profile. Click &quot;New Formula&quot;
                to create your first custom blend.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Library;
