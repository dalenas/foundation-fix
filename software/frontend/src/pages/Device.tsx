import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import { toast } from "sonner";

const Device = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Handle image upload and convert to Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setSelectedImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Call backend to analyze image
  const handleAnalyze = async () => {
    if (!selectedImage) {
      toast.error("Please upload an image first.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const response = await fetch("http://raspberrypi.local:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: selectedImage })
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setAnalysisResult(data.result);
      toast.success("Analysis complete!");
    } catch (err) {
      console.error(err);
      toast.error("Error connecting to backend.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Raspberry Pi Color Analysis
            </h1>
            <p className="text-muted-foreground">Upload a face image to determine the optimal foundation color.</p>
          </div>

          {/* Image Upload & Analysis */}
          <Card className="mb-8 border-border shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" /> Upload Image
              </CardTitle>
              <CardDescription>Select or take a photo to analyze skin tone.</CardDescription>
            </CardHeader>
            <CardContent>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-4" />

              {selectedImage && (
                <img src={selectedImage} alt="Uploaded" className="rounded-lg shadow-md w-64 mb-4" />
              )}

              <Button onClick={handleAnalyze} disabled={isAnalyzing} className="gap-2">
                {isAnalyzing ? "Analyzing..." : "Analyze Image"}
              </Button>

              {analysisResult && (
                <div className="mt-4 p-4 bg-muted rounded-md">
                  <p className="font-semibold">Hex Code Result:</p>
                  <p>{analysisResult}</p>
                  <div
                    className="mt-2 w-16 h-16 rounded shadow-md border"
                    style={{ backgroundColor: analysisResult }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Device;
