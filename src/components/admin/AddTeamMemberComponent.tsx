"use client";

import { Team } from "@/app/types/team";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { toast } from "sonner";

export default function AddTeamMemberComponent() {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamsLoaded, setTeamsLoaded] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    position: "",
  });

  const loadTeams = async () => {
    if (teamsLoaded) return;

    try {
      const teamsData = await Team.readAll();
      setTeams(teamsData);
      setTeamsLoaded(true);
    } catch (error) {
      console.error("Error loading teams:", error);
      toast.error("Failed to load teams");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTeamId || !formData.email || !formData.position) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to add team members");
      return;
    }

    try {
      const token = await user.getIdToken();

      const response = await fetch("/api/teams/addMember", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          teamId: selectedTeamId,
          position: formData.position,
         }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Failed to add team member");
        return;
      }

      setDialogOpen(false);
      setFormData({ email: "", position: "" });
      setSelectedTeamId("");
      toast.success("Team member added successfully");

      window.location.reload();
    } catch (error) {
      console.error("Error adding team member:", error);
      toast.error("Failed to add team member");
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>Add Team Member</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Team Member</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="team">Team</Label>
            <Select
              value={selectedTeamId}
              onValueChange={setSelectedTeamId}
              onOpenChange={(open) => {
                if (open) {
                  loadTeams();
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a team" />
              </SelectTrigger>
              <SelectContent>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">User Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              placeholder="user@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  position: e.target.value,
                }))
              }
              placeholder="e.g., Co-Lead, Director, Associate"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Add Member
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
