import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Cpu,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Camera,
  Trash2,
} from "lucide-react";
import Header from "@/components/Header";
import { toast } from "sonner";

const BACKEND_URL = "http://127.0.0.1:5000";

const Device = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState<
    string | null
  >(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Camera state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  // ---------------- BACKEND HEALTH CHECK ----------------
  const checkBackendConnection = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/ping`);
      setBackendOnline(res.ok);
      setIsConnected(res.ok);
    } catch (err) {
      console.error("Ping failed:", err);
      setBackendOnline(false);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    checkBackendConnection();
    const interval = setInterval(checkBackendConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  // ---------------- CAMERA CONTROLS ----------------
  const startCamera = async () => {
    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      toast.error("Camera API not supported in this browser/context.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });

      const video = videoRef.current;
      if (!video) {
        toast.error("Video element not ready.");
        return;
      }

      (video as any).srcObject = stream;

      const playVideo = () =>
        video
          .play()
          .then(() => {
            setCameraStream(stream);
            setCameraActive(true);
            toast.success("Camera started.");
          })
          .catch((e) => {
            console.error("video.play() error:", e);
            toast.error(
              "Camera started but could not show video (autoplay issues)."
            );
          });

      if (video.readyState >= 2) {
        await playVideo();
      } else {
        video.onloadedmetadata = () => {
          playVideo();
        };
      }
    } catch (err: any) {
      console.error("getUserMedia error:", err);

      if (err.name === "NotAllowedError") {
        toast.error("Camera permission denied. Check browser site settings.");
      } else if (err.name === "NotFoundError") {
        toast.error("No camera device found.");
      } else {
        toast.error("Could not access your camera.");
      }
    }
  };

  const stopCamera = () => {
    cameraStream?.getTracks().forEach((t) => t.stop());
    setCameraStream(null);
    setCameraActive(false);
    toast.message("Camera stopped.");
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cameraStream?.getTracks().forEach((t) => t.stop());
    };
  }, [cameraStream]);

  const captureFromCamera = () => {
    const video = videoRef.current;
    if (!video) {
      toast.error("Camera is not ready yet.");
      return;
    }

    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;

    if (!w || !h) {
      toast.error("Camera frame not ready yet, wait a second then try again.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      toast.error("Could not create drawing context.");
      return;
    }

    // Mirror horizontally so the captured image matches the mirrored preview
    ctx.save();
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, w, h);
    ctx.restore();

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          toast.error("Failed to capture frame.");
          return;
        }
        const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
        setSelectedFile(file);
        setSelectedImagePreview(URL.createObjectURL(blob));
        setAnalysisResult(null); // clear old result on new capture
        toast.success("Captured frame from camera.");
      },
      "image/jpeg",
      0.9
    );
  };

  // ---------------- FILE UPLOAD ----------------
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = () => setSelectedImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    setAnalysisResult(null); // clear old result
  };

  const clearImage = () => {
    setSelectedFile(null);
    setSelectedImagePreview(null);
    setAnalysisResult(null);
    toast.message("Image cleared. Capture or upload a new one.");
  };

  // ---------------- ANALYZE ----------------
  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error("Upload an image or capture from camera first.");
      return;
    }

    if (!backendOnline) {
      toast.error("Backend (main.py) is not running on 127.0.0.1:5000.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile); // field name matches main.py

      const response = await fetch(`${BACKEND_URL}/analyze`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
      } else {
        setAnalysisResult(data.result); // hex / shade from your algo
        toast.success("Analysis complete!");
      }
    } catch (err) {
      console.error("Analyze error:", err);
      toast.error("Error connecting to backend (main.py).");
      setBackendOnline(false);
      setIsConnected(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ---------------- DISPENSE ----------------
  const handleDispense = async () => {
    if (!analysisResult) return;

    if (!backendOnline) {
      toast.error("Backend (main.py) is not running on 127.0.0.1:5000.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/dispense`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ color: analysisResult }),
      });

      const data = await response.json();
      if (data.error) toast.error(data.error);
      else toast.success(`Dispensing started for ${analysisResult}`);
    } catch (err) {
      console.error("Dispense error:", err);
      toast.error("Error connecting to backend (main.py).");
      setBackendOnline(false);
      setIsConnected(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Foundation Fix Device
          </h1>
          <p className="text-muted-foreground">
            {backendOnline
              ? "Local backend (main.py) is connected and ready."
              : "Backend is offline. Start main.py on 127.0.0.1:5000 to analyze."}
          </p>

          {/* Connection card */}
          <Card className="mb-6 border-border shadow-[var(--shadow-soft)]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-primary" /> Local Processing
                    Node
                  </CardTitle>
                  <CardDescription>Endpoint: {BACKEND_URL}</CardDescription>
                </div>
                <div
                  className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                    isConnected
                      ? "bg-green-500/10 text-green-600"
                      : "bg-red-500/10 text-red-600"
                  }`}
                >
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

          {/* Camera + Upload + Analyze */}
          <Card className="mb-8 border-border shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-primary" /> Capture or Upload
                Image
              </CardTitle>
              <CardDescription>
                Use your laptop camera or upload a photo to analyze skin tone.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Camera controls */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant={cameraActive ? "outline" : "default"}
                    onClick={cameraActive ? stopCamera : startCamera}
                    className="gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    {cameraActive ? "Stop Camera" : "Start Camera"}
                  </Button>
                  {cameraActive && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={captureFromCamera}
                    >
                      Capture Frame
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Camera active: {cameraActive ? "yes" : "no"}
                </p>
                {/* Bigger, mirrored video box */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="mt-3 w-full max-w-xl aspect-video bg-black rounded-lg border border-border shadow-sm object-cover"
                  style={{ transform: "scaleX(-1)" }} // mirror effect in preview
                />
              </div>

              <div className="border-t border-border pt-4 space-y-4">
                {/* File upload + preview + clear */}
                <div className="flex flex-col gap-2 max-w-xl">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />

                  {selectedImagePreview && (
                    <div className="space-y-2">
                      <img
                        src={selectedImagePreview}
                        alt="Selected"
                        className="rounded-lg shadow-md w-full max-w-xl my-2"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={clearImage}
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove Image
                      </Button>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !selectedFile}
                >
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
                    <Button className="mt-2" onClick={handleDispense}>
                      Dispense Foundation
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Device;
