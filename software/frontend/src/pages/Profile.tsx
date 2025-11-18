import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Camera, User, Save } from "lucide-react";
import Header from "@/components/Header";
import { toast } from "sonner";

const LOCAL_STORAGE_KEY = "foundation-fix-profile"; // current active profile (for Library)
const PROFILES_KEY = "foundation-fix-profiles"; // all profiles map
const FORMULA_STORAGE_PREFIX = "foundation-fix-formulas-"; // per-profile formulas

type ProfileData = {
  name: string;
  email: string;
  skinType: string;
  preferences: string;
  imageDataUrl: string | null;
};

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    skinType: "",
    preferences: "",
  });

  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [profiles, setProfiles] = useState<Record<string, ProfileData>>({});
  const [activeEmailKey, setActiveEmailKey] = useState<string>("");

  // Load all profiles + current active profile on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    let storedProfiles: Record<string, ProfileData> = {};

    // Load saved profiles map
    const profilesJson = window.localStorage.getItem(PROFILES_KEY);
    if (profilesJson) {
      try {
        storedProfiles = JSON.parse(profilesJson);
      } catch (e) {
        console.error("Failed to parse profiles", e);
      }
    }

    // Load current profile (backwards compatible with old single-profile version)
    const currentJson = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    let activeKey = "";

    if (currentJson) {
      try {
        const current = JSON.parse(currentJson);
        const emailKey = current.email
          ? String(current.email).toLowerCase()
          : "";
        if (emailKey) {
          storedProfiles[emailKey] = {
            name: current.name || "",
            email: current.email || "",
            skinType: current.skinType || "",
            preferences: current.preferences || "",
            imageDataUrl: current.imageDataUrl || null,
          };
          activeKey = emailKey;
        }
      } catch (e) {
        console.error("Failed to parse current profile", e);
      }
    }

    // If no explicit active profile but we have profiles, pick the first one
    const keys = Object.keys(storedProfiles);
    if (!activeKey && keys.length > 0) {
      activeKey = keys[0];
    }

    setProfiles(storedProfiles);
    setActiveEmailKey(activeKey);

    if (activeKey && storedProfiles[activeKey]) {
      const p = storedProfiles[activeKey];
      setFormData({
        name: p.name,
        email: p.email,
        skinType: p.skinType,
        preferences: p.preferences,
      });
      setImageDataUrl(p.imageDataUrl);
    }
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const trimmedEmail = formData.email.trim();
    const emailKey = trimmedEmail.toLowerCase();

    if (!trimmedEmail) {
      toast.error("Please enter an email for this profile.");
      return;
    }

    const profile: ProfileData = {
      name: formData.name.trim(),
      email: trimmedEmail,
      skinType: formData.skinType.trim(),
      preferences: formData.preferences.trim(),
      imageDataUrl,
    };

    // Update profiles map
    const updatedProfiles = { ...profiles };

    // If we renamed the email, drop the old key
    if (activeEmailKey && activeEmailKey !== emailKey) {
      delete updatedProfiles[activeEmailKey];
      // also delete old formulas if we changed email? up to you.
      // window.localStorage.removeItem(FORMULA_STORAGE_PREFIX + activeEmailKey);
    }

    updatedProfiles[emailKey] = profile;

    setProfiles(updatedProfiles);
    setActiveEmailKey(emailKey);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        PROFILES_KEY,
        JSON.stringify(updatedProfiles)
      );
      // Keep this as the "current profile" so Library can pick up the correct email
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
    }

    toast.success("Profile saved!");
  };

  const handleSwitchProfile = (emailKey: string) => {
    setActiveEmailKey(emailKey);
    const selected = profiles[emailKey];
    if (!selected) return;

    setFormData({
      name: selected.name,
      email: selected.email,
      skinType: selected.skinType,
      preferences: selected.preferences,
    });
    setImageDataUrl(selected.imageDataUrl);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(selected));
    }
  };

  const startNewProfile = () => {
    setActiveEmailKey("");
    setFormData({
      name: "",
      email: "",
      skinType: "",
      preferences: "",
    });
    setImageDataUrl(null);
  };

  const handleDeleteActiveProfile = () => {
    if (!activeEmailKey) {
      toast.error("No active profile to delete.");
      return;
    }

    const confirmDelete =
      typeof window !== "undefined"
        ? window.confirm(
            "Delete this profile and its saved formulas? This cannot be undone."
          )
        : true;

    if (!confirmDelete) return;

    const updatedProfiles = { ...profiles };
    const deletedKey = activeEmailKey;
    delete updatedProfiles[deletedKey];

    setProfiles(updatedProfiles);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        PROFILES_KEY,
        JSON.stringify(updatedProfiles)
      );
      // delete formulas for this profile
      window.localStorage.removeItem(FORMULA_STORAGE_PREFIX + deletedKey);
    }

    const remainingKeys = Object.keys(updatedProfiles);

    if (remainingKeys.length > 0) {
      const newKey = remainingKeys[0];
      setActiveEmailKey(newKey);
      const p = updatedProfiles[newKey];
      setFormData({
        name: p.name,
        email: p.email,
        skinType: p.skinType,
        preferences: p.preferences,
      });
      setImageDataUrl(p.imageDataUrl);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(p));
      }
    } else {
      // no profiles left
      setActiveEmailKey("");
      setFormData({
        name: "",
        email: "",
        skinType: "",
        preferences: "",
      });
      setImageDataUrl(null);

      if (typeof window !== "undefined") {
        window.localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }

    toast.success("Profile deleted.");
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
            <p className="text-muted-foreground">
              Manage your personal information and preferences
            </p>
          </div>

          {/* Account switcher */}
          <div className="mb-6 flex flex-wrap items-center gap-4 justify-between">
            {Object.keys(profiles).length > 0 && (
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  Active account
                </p>
                <select
                  className="border border-border rounded-md bg-background px-3 py-2 text-sm text-foreground"
                  value={activeEmailKey}
                  onChange={(e) => handleSwitchProfile(e.target.value)}
                >
                  {Object.entries(profiles).map(([key, p]) => (
                    <option key={key} value={key}>
                      {p.name || p.email || key}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex gap-2 ml-auto">
              <Button type="button" variant="outline" onClick={startNewProfile}>
                New Profile
              </Button>
              <Button
                type="button"
                variant="outline"
                className="border-destructive text-destructive hover:bg-destructive/10"
                onClick={handleDeleteActiveProfile}
                disabled={!activeEmailKey}
              >
                Delete Profile
              </Button>
            </div>
          </div>

          <div className="grid gap-6">
            {/* Profile Picture Card */}
            <Card className="border-border shadow-[var(--shadow-soft)]">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Profile Picture
                </CardTitle>
                <CardDescription>
                  Upload a photo to personalize your account
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-2 border-primary/20 overflow-hidden">
                  {imageDataUrl ? (
                    <img
                      src={imageDataUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-12 h-12 text-primary" />
                  )}
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <Button
                  variant="outline"
                  className="gap-2"
                  type="button"
                  onClick={handleUploadClick}
                >
                  <Camera className="w-4 h-4" />
                  Upload Photo
                </Button>
              </CardContent>
            </Card>

            {/* Personal Information Card */}
            <Card className="border-border shadow-[var(--shadow-soft)]">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Personal Information
                </CardTitle>
                <CardDescription>Update your profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="border-border focus:border-primary"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="border-border focus:border-primary"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skinType" className="text-foreground">
                    Skin Type
                  </Label>
                  <Input
                    id="skinType"
                    value={formData.skinType}
                    onChange={(e) =>
                      setFormData({ ...formData, skinType: e.target.value })
                    }
                    className="border-border focus:border-primary"
                    placeholder="e.g. Oily, Dry, Combination"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Preferences Card */}
            <Card className="border-border shadow-[var(--shadow-soft)]">
              <CardHeader>
                <CardTitle className="text-foreground">
                  Beauty Preferences
                </CardTitle>
                <CardDescription>
                  Tell us about your foundation preferences and skin concerns
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="preferences" className="text-foreground">
                    Notes & Preferences
                  </Label>
                  <Textarea
                    id="preferences"
                    value={formData.preferences}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preferences: e.target.value,
                      })
                    }
                    rows={4}
                    className="border-border focus:border-primary resize-none"
                    placeholder="I prefer lightweight, buildable coverage with a natural finish..."
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                onClick={handleSave}
                variant="elegant"
                size="lg"
                className="gap-2"
                type="button"
              >
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
