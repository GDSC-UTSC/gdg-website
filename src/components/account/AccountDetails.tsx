"use client";

import { UserData } from "@/app/types/userdata";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Edit, Save, X } from "lucide-react";
import { useEffect, useState } from "react";

interface AccountDetailsProps {
  userData: UserData | null;
  onUpdate: (updatedUserData: UserData) => void;
}

export function AccountDetails({ userData, onUpdate }: AccountDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    bio: userData?.bio || "",
    linkedin: userData?.linkedin || "",
    github: userData?.github || "",
    publicName: userData?.publicName || "",
  });

  // Update form data when userData changes
  useEffect(() => {
    setFormData({
      bio: userData?.bio || "",
      linkedin: userData?.linkedin || "",
      github: userData?.github || "",
      publicName: userData?.publicName || "",
    });
  }, [userData]);
  const { toast } = useToast();

  const handleEdit = () => {
    setFormData({
      bio: userData?.bio || "",
      linkedin: userData?.linkedin || "",
      github: userData?.github || "",
      publicName: userData?.publicName || "",
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      publicName: userData?.publicName || "",
      bio: userData?.bio || "",
      linkedin: userData?.linkedin || "",
      github: userData?.github || "",
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!userData) return;

    setIsSaving(true);
    try {
      // Update the userData instance
      userData.publicName = formData.publicName || undefined;
      userData.bio = formData.bio || undefined;
      userData.linkedin = formData.linkedin || undefined;
      userData.github = formData.github || undefined;

      // Save to database
      await userData.update();

      // Update parent component
      onUpdate(userData);
      setIsEditing(false);

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!userData) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Account Details</h3>
        </div>
        <p className="text-muted-foreground">Loading profile information...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Account Details</h3>
        {!isEditing ? (
          <Button onClick={handleEdit} variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm" disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              size="sm"
              disabled={isSaving}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <p className="text-sm text-muted-foreground">{userData.email}</p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="role">Role</Label>
          <p className="text-sm text-muted-foreground capitalize">
            {userData.role}
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="publicName">Public Name</Label>
          {isEditing ? (
            <Input
              id="publicName"
              value={formData.publicName}
              onChange={(e) => handleInputChange("publicName", e.target.value)}
              placeholder="Your display name"
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              {userData.publicName || "No public name provided"}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="bio">Bio</Label>
          {isEditing ? (
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              placeholder="Tell us about yourself"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              rows={3}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              {userData.bio || "No bio provided"}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="linkedin">LinkedIn</Label>
          {isEditing ? (
            <Input
              id="linkedin"
              value={formData.linkedin}
              onChange={(e) => handleInputChange("linkedin", e.target.value)}
              placeholder="LinkedIn profile URL"
              type="url"
            />
          ) : (
            <p className="text-sm">
              {userData.linkedin ? (
                <a
                  href={userData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {userData.linkedin}
                </a>
              ) : (
                <span className="text-muted-foreground">Not provided</span>
              )}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="github">GitHub</Label>
          {isEditing ? (
            <Input
              id="github"
              value={formData.github}
              onChange={(e) => handleInputChange("github", e.target.value)}
              placeholder="GitHub profile URL"
              type="url"
            />
          ) : (
            <p className="text-sm">
              {userData.github ? (
                <a
                  href={userData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {userData.github}
                </a>
              ) : (
                <span className="text-muted-foreground">Not provided</span>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
