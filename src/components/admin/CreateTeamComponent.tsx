"use client";

import { Team } from "@/app/types/team";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Timestamp } from "firebase/firestore";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateTeamComponent() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const team = new Team({
        id: crypto.randomUUID(),
        name: formData.name,
        description: formData.description,
        members: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      await team.create();

      setDialogOpen(false);
      setFormData({ name: "", description: "" });
      toast.success("Team created successfully");
      
      window.location.reload();
    } catch (error) {
      console.error("Error creating team:", error);
      toast.error("Failed to create team");
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Create Team
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Team</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Team Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              placeholder="e.g., Executive Team"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Team description..."
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full">
            Create Team
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}