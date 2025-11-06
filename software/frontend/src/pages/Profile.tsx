import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, User, Mail, Save } from "lucide-react";
import Header from "@/components/Header";
import { toast } from "sonner";

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "Sarah Mitchell",
    email: "sarah.mitchell@example.com",
    skinType: "Combination",
    preferences: "I prefer lightweight, buildable coverage with a natural finish. Sensitive to fragrances.",
  });

  const handleSave = () => {
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Your Profile
            </h1>
            <p className="text-muted-foreground">Manage your personal information and preferences</p>
          </div>

          <div className="grid gap-6">
            {/* Profile Picture Card */}
            <Card className="border-border shadow-[var(--shadow-soft)]">
              <CardHeader>
                <CardTitle className="text-foreground">Profile Picture</CardTitle>
                <CardDescription>Upload a photo to personalize your account</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-2 border-primary/20">
                  <User className="w-12 h-12 text-primary" />
                </div>
                <Button variant="outline" className="gap-2">
                  <Camera className="w-4 h-4" />
                  Upload Photo
                </Button>
              </CardContent>
            </Card>

            {/* Personal Information Card */}
            <Card className="border-border shadow-[var(--shadow-soft)]">
              <CardHeader>
                <CardTitle className="text-foreground">Personal Information</CardTitle>
                <CardDescription>Update your profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="border-border focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border-border focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skinType" className="text-foreground">Skin Type</Label>
                  <Input
                    id="skinType"
                    value={formData.skinType}
                    onChange={(e) => setFormData({ ...formData, skinType: e.target.value })}
                    className="border-border focus:border-primary"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preferences Card */}
            <Card className="border-border shadow-[var(--shadow-soft)]">
              <CardHeader>
                <CardTitle className="text-foreground">Beauty Preferences</CardTitle>
                <CardDescription>Tell us about your foundation preferences and skin concerns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="preferences" className="text-foreground">Notes & Preferences</Label>
                  <Textarea
                    id="preferences"
                    value={formData.preferences}
                    onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
                    rows={4}
                    className="border-border focus:border-primary resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={handleSave} variant="elegant" size="lg" className="gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
