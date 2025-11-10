import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, Power, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import { toast } from "sonner";

// Replace with your Pi LAN IP
const LAN_PI_IP = "172.31.252.9"; 
const LOCALHOST_PI_IP = "127.0.0.1:5000";

// Choose backend URL depending on host
const BACKEND_URL = "http://127.0.0.1:5000"; // points to mock backend running on your PC

const Device = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [piOnline, setPiOnline] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Check if Pi backend is online
  const checkPiConnection = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/ping`);
      setPiOnline(res.ok);
      setIsConnected(res.ok);
    } catch {
      setPiOnline(false);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    checkPiConnection();
    const interval = setInterval(checkPiConnection, 5000); // recheck every 5 seconds
    return () => clearInterval(interval);
  }, []);

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
    if (!piOnline) {
      toast.error("Pi is not connected.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const response = await fetch(`${BACKEND_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: selectedImage })
      });

      const data = await response.json();

      if (data.error) toast.error(data.error);
      else {
        setAnalysisResult(data.result);
        toast.success("Analysis complete!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error connecting to backend.");
      setPiOnline(false);
      setIsConnected(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDispense = async () => {
    if (!analysisResult) return;
    if (!piOnline) {
      toast.error("Pi is not connected.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/dispense`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ color: analysisResult })
      });
      const data = await response.json();
      if (data.error) toast.error(data.error);
      else toast.success(`Dispensing started for ${analysisResult}`);
    } catch (err) {
      console.error(err);
      toast.error("Error connecting to backend.");
      setPiOnline(false);
      setIsConnected(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-6 max-w-4xl">

          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Foundation Fix Pi
            </h1>
            <p className="text-muted-foreground">
              {piOnline ? "Pi is connected and ready." : "Pi is offline. Connect Pi to use analysis and dispense."}
            </p>
          </div>

          {/* Pi Connection Card */}
          <Card className="mb-6 border-border shadow-[var(--shadow-soft)]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-primary" /> Foundation Fix Pi
                  </CardTitle>
                  <CardDescription>Model: RPi-4B-PRO</CardDescription>
                </div>
                <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                  isConnected ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                }`}>
                  {isConnected ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm font-medium">Connected</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">Not Connected</span>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Image upload & analyze */}
          <Card className="mb-8 border-border shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" /> Upload Image
              </CardTitle>
              <CardDescription>Select a photo to analyze skin tone.</CardDescription>
            </CardHeader>
            <CardContent>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-4" />
              {selectedImage && (
                <img src={selectedImage} alt="Uploaded" className="rounded-lg shadow-md w-64 mb-4" />
              )}
              <Button onClick={handleAnalyze} disabled={isAnalyzing || !piOnline} className="gap-2 mb-2">
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
                  <Button onClick={handleDispense} disabled={!piOnline} className="mt-2 gap-2">
                    Dispense Foundation
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Device info & cartridges */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-border shadow-[var(--shadow-soft)]">
              <CardHeader>
                <CardTitle className="text-foreground text-lg">Device Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground">Power</p>
                  <span className="text-sm text-muted-foreground">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="font-medium text-foreground">Network</p>
                  <span className="text-sm text-muted-foreground">{piOnline ? "Connected" : "Offline"}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-[var(--shadow-soft)]">
              <CardHeader>
                <CardTitle className="text-foreground text-lg">Formula Cartridges</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {["Light Base", "Medium Base", "Dark Base", "Neutral Tone", "Warm Tone", "Cool Tone"].map((cartridge, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{cartridge}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-primary/80"
                          style={{ width: `${Math.floor(Math.random() * 30) + 60}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-8">
                        {Math.floor(Math.random() * 30) + 60}%
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Device;
