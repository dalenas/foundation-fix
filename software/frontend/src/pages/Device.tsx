import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, Image as ImageIcon, Upload, CheckCircle2, AlertCircle, Power } from "lucide-react";
import Header from "@/components/Header";
import { toast } from "sonner";

const Device = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isDispensing, setIsDispensing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setSelectedImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      toast.error("Please upload an image first.");
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await fetch("http://raspberrypi.local:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: selectedImage })
      });

      const data = await response.json();
      setAnalysisResult(data.result || "Optimal match calculated.");
      toast.success("Analysis complete!");
    } catch {
      toast.error("Error analyzing image.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDispense = async () => {
    if (!analysisResult) {
      toast.error("Please analyze an image first.");
      return;
    }

    setIsDispensing(true);

    try {
      const response = await fetch("http://raspberrypi.local:5000/dispense", {
        method: "POST"
      });

      if (!response.ok) throw new Error();

      toast.success("Dispensing foundation...");
    } catch {
      toast.error("Error dispensing foundation.");
    } finally {
      setIsDispensing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Raspberry Pi Status
            </h1>
            <p className="text-muted-foreground">Raspberry Pi is locally hosted and automatically connected.</p>
          </div>

          {/* Connected Pi Card */}
          <Card className="mb-6 border-border shadow-[var(--shadow-soft)]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-primary" />
                    Foundation Fix Pi
                  </CardTitle>
                  <CardDescription>Model: RPi-4B-PRO</CardDescription>
                </div>
                <div className="px-4 py-2 rounded-full flex items-center gap-2 bg-green-500/10 text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Connected</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Device is running locally. No pairing is required.
              </p>
            </CardContent>
          </Card>

          {/* Image Upload & Analysis */}
          <Card className="mb-8 border-border shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" /> Upload Image
              </CardTitle>
              <CardDescription>Select or take a photo to analyze optimal foundation mix.</CardDescription>
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
                  <p className="font-semibold">Analysis Result:</p>
                  <p>{analysisResult}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dispense Section */}
          <Card className="border-border shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle className="text-foreground text-lg">Dispense Foundation</CardTitle>
              <CardDescription>Send command to Raspberry Pi to dispense the calculated mix.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleDispense}
                disabled={isDispensing || !analysisResult}
                className="gap-2"
              >
                {isDispensing ? "Dispensing..." : "Dispense"}
              </Button>

              {!analysisResult && (
                <p className="mt-2 flex items-center text-red-600 text-sm gap-2">
                  <AlertCircle className="h-4 w-4" /> Analyze image before dispensing
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Device;
import { useNavigate } from "react-router-dom";