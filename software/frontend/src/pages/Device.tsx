import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bluetooth, Power, Wifi, Battery, CheckCircle2, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import { toast } from "sonner";

const Device = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Simulate connection process
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
      toast.success("Successfully connected to ChromaBlend Device!");
    }, 2000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    toast.info("Disconnected from device");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Device Connection
            </h1>
            <p className="text-muted-foreground">Connect to your ChromaBlend foundation machine</p>
          </div>

          {/* Connection Status Card */}
          <Card className="mb-6 border-border shadow-[var(--shadow-soft)]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Bluetooth className="w-5 h-5 text-primary" />
                    ChromaBlend Pro
                  </CardTitle>
                  <CardDescription>Model: CB-2024-PRO</CardDescription>
                </div>
                <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                  isConnected 
                    ? "bg-green-500/10 text-green-600" 
                    : "bg-muted text-muted-foreground"
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
            <CardContent>
              <div className="flex justify-center py-4">
                {!isConnected ? (
                  <Button
                    onClick={handleConnect}
                    disabled={isConnecting}
                    variant="elegant"
                    size="lg"
                    className="gap-2"
                  >
                    <Bluetooth className="w-5 h-5" />
                    {isConnecting ? "Connecting..." : "Connect Device"}
                  </Button>
                ) : (
                  <Button
                    onClick={handleDisconnect}
                    variant="outline"
                    size="lg"
                    className="gap-2"
                  >
                    <Power className="w-5 h-5" />
                    Disconnect
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Device Information */}
          {isConnected && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-border shadow-[var(--shadow-soft)]">
                <CardHeader>
                  <CardTitle className="text-foreground text-lg">Device Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <Power className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Power</p>
                        <p className="text-sm text-muted-foreground">Active</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Battery className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Battery</p>
                        <p className="text-sm text-muted-foreground">85%</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Wifi className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Signal</p>
                        <p className="text-sm text-muted-foreground">Excellent</p>
                      </div>
                    </div>
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
          )}
        </div>
      </main>
    </div>
  );
};

export default Device;
