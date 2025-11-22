import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Cpu,
  Droplets,
  Image,
  CheckCircle2,
  AlertCircle,
  Camera,
  Trash2,
  Palette,
  User,
} from "lucide-react";
import { toast } from "sonner";

const BACKEND_URL = "http://172.20.10.2:5000";

const Device = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  const isActive = (path: string) => location.pathname === path;

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
        setAnalysisResult(null);
        toast.success("Captured frame from camera.");
      },
      "image/jpeg",
      0.9
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = () => setSelectedImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    setAnalysisResult(null);
  };

  const clearImage = () => {
    setSelectedFile(null);
    setSelectedImagePreview(null);
    setAnalysisResult(null);
    toast.message("Image cleared. Capture or upload a new one.");
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error("Upload an image or capture from camera first.");
      return;
    }

    if (!backendOnline) {
      toast.error("Backend (main.py) is not running on tacobell.local:8080.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch(`${BACKEND_URL}/analyze`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
      } else {
        setAnalysisResult(data.result);
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

  const handleDispense = async () => {
    if (!analysisResult) return;

    if (!backendOnline) {
      toast.error("Backend (main.py) is not running on 172.20.10.2:5000.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/dispense`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lab: analysisResult }),
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

    const killMotors = async () => {
    if (!backendOnline) {
      toast.error("Backend (main.py) is not running on 172.20.10.2:5000.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/killMotors`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      let data;
      if (response.status !== 204) {
        data = await response.json();
      }

      if (data?.error) toast.error(data.error);
      else toast.success(`Killed syringe motors.`);
    } catch (err) {
      console.error("Motor error:", err);
      toast.error("Error connecting to backend (main.py).");
      setBackendOnline(false);
      setIsConnected(false);
    }
  };

  const handleExtractWhite = async () => {
    if (!backendOnline) {
      toast.error("Backend (main.py) is not running on 172.20.10.2:5000.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/extractWhite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      let data;
      if (response.status !== 204) {
        data = await response.json();
      }

      if (data?.error) toast.error(data.error);
      else toast.success(`Extracting started for white syringe.`);
    } catch (err) {
      console.error("Extract error:", err);
      toast.error("Error connecting to backend (main.py).");
      setBackendOnline(false);
      setIsConnected(false);
    }
  };

    const handleExtractBlack = async () => {
    if (!backendOnline) {
      toast.error("Backend (main.py) is not running on 172.20.10.2:5000.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/extractBlack`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      let data;
      if (response.status !== 204) {
        data = await response.json();
      }

      if (data?.error) toast.error(data.error);
      else toast.success(`Extracting started for black syringe.`);
    } catch (err) {
      console.error("Extract error:", err);
      toast.error("Error connecting to backend (main.py).");
      setBackendOnline(false);
      setIsConnected(false);
    }
  };

    const handleExtractRed = async () => {
    if (!backendOnline) {
      toast.error("Backend (main.py) is not running on 172.20.10.2:5000.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/extractRed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      let data;
      if (response.status !== 204) {
        data = await response.json();
      }

      if (data?.error) toast.error(data.error);
      else toast.success(`Extracting started for red syringe.`);
    } catch (err) {
      console.error("Extract error:", err);
      toast.error("Error connecting to backend (main.py).");
      setBackendOnline(false);
      setIsConnected(false);
    }
  };

    const handleExtractBlue = async () => {
    if (!backendOnline) {
      toast.error("Backend (main.py) is not running on 172.20.10.2:5000.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/extractBlue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      let data;
      if (response.status !== 204) {
        data = await response.json();
      }

      if (data?.error) toast.error(data.error);
      else toast.success(`Extracting started for blue syringe.`);
    } catch (err) {
      console.error("Extract error:", err);
      toast.error("Error connecting to backend (main.py).");
      setBackendOnline(false);
      setIsConnected(false);
    }
  };

    const handleExtractYellow = async () => {
    if (!backendOnline) {
      toast.error("Backend (main.py) is not running on 172.20.10.2:5000.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/extractYellow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      let data;
      if (response.status !== 204) {
        data = await response.json();
      }

      if (data?.error) toast.error(data.error);
      else toast.success(`Extracting started for yellow syringe.`);
    } catch (err) {
      console.error("Extract error:", err);
      toast.error("Error connecting to backend (main.py).");
      setBackendOnline(false);
      setIsConnected(false);
    }
  };

  const handleExtractWhiteHalf = async () => {
    if (!backendOnline) {
      toast.error("Backend (main.py) is not running on 172.20.10.2:5000.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/extractWhiteHalf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      let data;
      if (response.status !== 204) {
        data = await response.json();
      }

      if (data?.error) toast.error(data.error);
      else toast.success(`Extracting started for white syringe.`);
    } catch (err) {
      console.error("Extract error:", err);
      toast.error("Error connecting to backend (main.py).");
      setBackendOnline(false);
      setIsConnected(false);
    }
  };

    const handleExtractBlackHalf = async () => {
    if (!backendOnline) {
      toast.error("Backend (main.py) is not running on 172.20.10.2:5000.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/extractBlackHalf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      let data;
      if (response.status !== 204) {
        data = await response.json();
      }

      if (data?.error) toast.error(data.error);
      else toast.success(`Extracting started for black syringe.`);
    } catch (err) {
      console.error("Extract error:", err);
      toast.error("Error connecting to backend (main.py).");
      setBackendOnline(false);
      setIsConnected(false);
    }
  };

    const handleExtractRedHalf = async () => {
    if (!backendOnline) {
      toast.error("Backend (main.py) is not running on 172.20.10.2:5000.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/extractRedHalf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      let data;
      if (response.status !== 204) {
        data = await response.json();
      }

      if (data?.error) toast.error(data.error);
      else toast.success(`Extracting started for red syringe.`);
    } catch (err) {
      console.error("Extract error:", err);
      toast.error("Error connecting to backend (main.py).");
      setBackendOnline(false);
      setIsConnected(false);
    }
  };

    const handleExtractBlueHalf = async () => {
    if (!backendOnline) {
      toast.error("Backend (main.py) is not running on 172.20.10.2:5000.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/extractBlueHalf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      let data;
      if (response.status !== 204) {
        data = await response.json();
      }

      if (data?.error) toast.error(data.error);
      else toast.success(`Extracting started for blue syringe.`);
    } catch (err) {
      console.error("Extract error:", err);
      toast.error("Error connecting to backend (main.py).");
      setBackendOnline(false);
      setIsConnected(false);
    }
  };

    const handleExtractYellowHalf = async () => {
    if (!backendOnline) {
      toast.error("Backend (main.py) is not running on 172.20.10.2:5000.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/extractYellowHalf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      let data;
      if (response.status !== 204) {
        data = await response.json();
      }

      if (data?.error) toast.error(data.error);
      else toast.success(`Extracting started for yellow syringe.`);
    } catch (err) {
      console.error("Extract error:", err);
      toast.error("Error connecting to backend (main.py).");
      setBackendOnline(false);
      setIsConnected(false);
    }
  };

    const handleExtractWhiteQuarter = async () => {
    if (!backendOnline) {
      toast.error("Backend (main.py) is not running on 172.20.10.2:5000.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/extractWhiteQuarter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      let data;
      if (response.status !== 204) {
        data = await response.json();
      }

      if (data?.error) toast.error(data.error);
      else toast.success(`Extracting started for white syringe.`);
    } catch (err) {
      console.error("Extract error:", err);
      toast.error("Error connecting to backend (main.py).");
      setBackendOnline(false);
      setIsConnected(false);
    }
  };

    const handleExtractBlackQuarter = async () => {
    if (!backendOnline) {
      toast.error("Backend (main.py) is not running on 172.20.10.2:5000.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/extractBlackQuarter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      let data;
      if (response.status !== 204) {
        data = await response.json();
      }

      if (data?.error) toast.error(data.error);
      else toast.success(`Extracting started for black syringe.`);
    } catch (err) {
      console.error("Extract error:", err);
      toast.error("Error connecting to backend (main.py).");
      setBackendOnline(false);
      setIsConnected(false);
    }
  };

    const handleExtractRedQuarter = async () => {
    if (!backendOnline) {
      toast.error("Backend (main.py) is not running on 172.20.10.2:5000.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/extractRedQuarter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      let data;
      if (response.status !== 204) {
        data = await response.json();
      }

      if (data?.error) toast.error(data.error);
      else toast.success(`Extracting started for red syringe.`);
    } catch (err) {
      console.error("Extract error:", err);
      toast.error("Error connecting to backend (main.py).");
      setBackendOnline(false);
      setIsConnected(false);
    }
  };

    const handleExtractBlueQuarter = async () => {
    if (!backendOnline) {
      toast.error("Backend (main.py) is not running on 172.20.10.2:5000.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/extractBlueQuarter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      let data;
      if (response.status !== 204) {
        data = await response.json();
      }

      if (data?.error) toast.error(data.error);
      else toast.success(`Extracting started for blue syringe.`);
    } catch (err) {
      console.error("Extract error:", err);
      toast.error("Error connecting to backend (main.py).");
      setBackendOnline(false);
      setIsConnected(false);
    }
  };

    const handleExtractYellowQuarter = async () => {
    if (!backendOnline) {
      toast.error("Backend (main.py) is not running on 172.20.10.2:5000.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/extractYellowQuarter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      let data;
      if (response.status !== 204) {
        data = await response.json();
      }

      if (data?.error) toast.error(data.error);
      else toast.success(`Extracting started for yellow syringe.`);
    } catch (err) {
      console.error("Extract error:", err);
      toast.error("Error connecting to backend (main.py).");
      setBackendOnline(false);
      setIsConnected(false);
    }
  };

    const handleExtractWhiteEighth = async () => {
    if (!backendOnline) {
      toast.error("Backend (main.py) is not running on 172.20.10.2:5000.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/extractWhiteEighth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      let data;
      if (response.status !== 204) {
        data = await response.json();
      }

      if (data?.error) toast.error(data.error);
      else toast.success(`Extracting started for white syringe.`);
    } catch (err) {
      console.error("Extract error:", err);
      toast.error("Error connecting to backend (main.py).");
      setBackendOnline(false);
      setIsConnected(false);
    }
  };

    const handleExtractBlackEighth = async () => {
    if (!backendOnline) {
      toast.error("Backend (main.py) is not running on 172.20.10.2:5000.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/extractBlackEighth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      let data;
      if (response.status !== 204) {
        data = await response.json();
      }

      if (data?.error) toast.error(data.error);
      else toast.success(`Extracting started for black syringe.`);
    } catch (err) {
      console.error("Extract error:", err);
      toast.error("Error connecting to backend (main.py).");
      setBackendOnline(false);
      setIsConnected(false);
    }
  };

    const handleExtractRedEighth = async () => {
    if (!backendOnline) {
      toast.error("Backend (main.py) is not running on 172.20.10.2:5000.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/extractRedHalfEighth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      let data;
      if (response.status !== 204) {
        data = await response.json();
      }

      if (data?.error) toast.error(data.error);
      else toast.success(`Extracting started for red syringe.`);
    } catch (err) {
      console.error("Extract error:", err);
      toast.error("Error connecting to backend (main.py).");
      setBackendOnline(false);
      setIsConnected(false);
    }
  };

    const handleExtractBlueEighth = async () => {
    if (!backendOnline) {
      toast.error("Backend (main.py) is not running on 172.20.10.2:5000.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/extractBlueEighth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      let data;
      if (response.status !== 204) {
        data = await response.json();
      }

      if (data?.error) toast.error(data.error);
      else toast.success(`Extracting started for blue syringe.`);
    } catch (err) {
      console.error("Extract error:", err);
      toast.error("Error connecting to backend (main.py).");
      setBackendOnline(false);
      setIsConnected(false);
    }
  };

  const handleExtractYellowEighth = async () => {
    if (!backendOnline) {
      toast.error("Backend (main.py) is not running on 172.20.10.2:5000.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/extractYellowEighth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      let data;
      if (response.status !== 204) {
        data = await response.json();
      }

      if (data?.error) toast.error(data.error);
      else toast.success(`Extracting started for yellow syringe.`);
    } catch (err) {
      console.error("Extract error:", err);
      toast.error("Error connecting to backend (main.py).");
      setBackendOnline(false);
      setIsConnected(false);
    }
  };

      const emptyWhite = async () => {
    if (!backendOnline) {
      toast.error("Backend (main.py) is not running on 172.20.10.2:5000.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/emptyWhite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      let data;
      if (response.status !== 204) {
        data = await response.json();
      }

      if (data?.error) toast.error(data.error);
      else toast.success(`Emptying white syringe.`);
    } catch (err) {
      console.error("Empty error:", err);
      toast.error("Error connecting to backend (main.py).");
      setBackendOnline(false);
      setIsConnected(false);
    }
  };

    const emptyBlack = async () => {
    if (!backendOnline) {
      toast.error("Backend (main.py) is not running on 172.20.10.2:5000.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/emptyBlack`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      let data;
      if (response.status !== 204) {
        data = await response.json();
      }

      if (data?.error) toast.error(data.error);
      else toast.success(`Emptying black syringe.`);
    } catch (err) {
      console.error("Empty error:", err);
      toast.error("Error connecting to backend (main.py).");
      setBackendOnline(false);
      setIsConnected(false);
    }
  };

    const emptyRed = async () => {
    if (!backendOnline) {
      toast.error("Backend (main.py) is not running on 172.20.10.2:5000.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/emptyRed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      let data;
      if (response.status !== 204) {
        data = await response.json();
      }

      if (data?.error) toast.error(data.error);
      else toast.success(`Emptying red syringe.`);
    } catch (err) {
      console.error("Empty error:", err);
      toast.error("Error connecting to backend (main.py).");
      setBackendOnline(false);
      setIsConnected(false);
    }
  };

    const emptyBlue = async () => {
    if (!backendOnline) {
      toast.error("Backend (main.py) is not running on 172.20.10.2:5000.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/emptyBlue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      let data;
      if (response.status !== 204) {
        data = await response.json();
      }

      if (data?.error) toast.error(data.error);
      else toast.success(`Emptying blue syringe.`);
    } catch (err) {
      console.error("Empty error:", err);
      toast.error("Error connecting to backend (main.py).");
      setBackendOnline(false);
      setIsConnected(false);
    }
  };

  const emptyYellow = async () => {
    if (!backendOnline) {
      toast.error("Backend (main.py) is not running on 172.20.10.2:5000.");
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/emptyYellow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      let data;
      if (response.status !== 204) {
        data = await response.json();
      }

      if (data?.error) toast.error(data.error);
      else toast.success(`Emptying yellow syringe.`);
    } catch (err) {
      console.error("Empty error:", err);
      toast.error("Error connecting to backend (main.py).");
      setBackendOnline(false);
      setIsConnected(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
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
            variant={isActive("/device") ? "default" : "ghost"}
            className="gap-2"
            onClick={() => navigate("/device")}
          >
            <Cpu className="w-4 h-4" />
            Raspberry Pi
          </Button>
          <Button 
            variant={isActive("/library") ? "default" : "ghost"}
            className="gap-2"
            onClick={() => navigate("/library")}
          >
            <Image className="w-4 h-4" />
            Library
          </Button>
          <Button 
            variant={isActive("/profile") ? "default" : "ghost"}
            className="gap-2"
            onClick={() => navigate("/profile")}
          >
            <User className="w-4 h-4" />
            Profile
          </Button>
        </div>
      </nav>

      <main className="py-20 px-4">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Foundation Fix Device
          </h1>
          <p className="text-muted-foreground mb-6">
            {backendOnline
              ? "Local backend (main.py) is connected and ready."
              : "Backend is offline. Start main.py on tacobell.local:8080 to analyze."}
          </p>

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

          <Card className="mb-6 border-border shadow-[var(--shadow-soft)]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-primary" /> Foundation Extraction
                  </CardTitle>
                  <CardDescription>Hold a cup under syringe for refill.</CardDescription>
                </div>
              </div>
              <Button className="mt-2" onClick={killMotors}>
                Kill Motors
              </Button>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3 justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="mt-2">White Foundation</Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-40">
                  <DropdownMenuItem onClick={handleExtractWhite}>
                    Full
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExtractWhiteHalf}>
                    Half
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExtractWhiteQuarter}>
                    Quarter
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExtractWhiteEighth}>
                    Eighth
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="mt-2">Black Foundation</Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-40">
                  <DropdownMenuItem onClick={handleExtractBlack}>
                    Full
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExtractBlackHalf}>
                    Half
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExtractBlackQuarter}>
                    Quarter
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExtractBlackEighth}>
                    Eighth
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="mt-2">Red Foundation</Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-40">
                  <DropdownMenuItem onClick={handleExtractRed}>
                    Full
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExtractRedHalf}>
                    Half
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExtractRedQuarter}>
                    Quarter
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExtractRedEighth}>
                    Eighth
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="mt-2">Blue Foundation</Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-40">
                  <DropdownMenuItem onClick={handleExtractBlue}>
                    Full
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExtractBlueHalf}>
                    Half
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExtractBlueQuarter}>
                    Quarter
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExtractBlueEighth}>
                    Eighth
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="mt-2">Yellow Foundation</Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-40">
                  <DropdownMenuItem onClick={handleExtractYellow}>
                    Full
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExtractYellowHalf}>
                    Half
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExtractYellowQuarter}>
                    Quarter
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExtractYellowEighth}>
                    Eighth
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>

          <Card className="mb-6 border-border shadow-[var(--shadow-soft)]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-primary" /> Clear Foundation
                  </CardTitle>
                  <CardDescription>Drop syringes down to empty foundation.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3 justify-center">
              <Button className="mt-2" onClick={emptyWhite}>
                White Foundation
              </Button>
              <Button className="mt-2" onClick={emptyBlack}>
                Black Foundation
              </Button>
              <Button className="mt-2" onClick={emptyRed}>
                Red Foundation
              </Button>
              <Button className="mt-2" onClick={emptyBlue}>
                Blue Foundation
              </Button>
              <Button className="mt-2" onClick={emptyYellow}>
                Yellow Foundation
              </Button>
            </CardContent>
          </Card>

          <Card className="mb-8 border-border shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="w-5 h-5 text-primary" /> Capture or Upload
                Image
              </CardTitle>
              <CardDescription>
                Use your laptop camera or upload a photo to analyze skin tone.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="mt-3 w-full max-w-xl aspect-video bg-black rounded-lg border border-border shadow-sm object-cover"
                  style={{ transform: "scaleX(-1)" }}
                />
              </div>

              <div className="border-t border-border pt-4 space-y-4">
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
