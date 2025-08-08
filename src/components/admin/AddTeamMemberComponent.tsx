"use client";

import { Team } from "@/app/types/team";
import { UserData } from "@/app/types/userdata";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import UserSearch from "@/components/admin/UserSearch";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { toast } from "sonner";

export default function AddTeamMemberComponent() {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamsLoaded, setTeamsLoaded] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [position, setPosition] = useState("");

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

    if (!selectedTeamId || !selectedUser || !position) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to add team members");
      return;
    }

    try {
      const selectedTeam = teams.find(t => t.id === selectedTeamId);
      if (!selectedTeam) {
        toast.error("Selected team not found");
        return;
      }

      const token = await user.getIdToken();

      const response = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_FUNCTIONS_URL}/addUserToTeam`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          userId: selectedUser.id,
          teamName: selectedTeam.name,
          position: position,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Failed to add team member");
        return;
      }

      setDialogOpen(false);
      setSelectedUser(null);
      setPosition("");
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
            <Label htmlFor="user">Select User</Label>
            <UserSearch
              onUserSelect={setSelectedUser}
              placeholder="Search for a user by name"
              value={selectedUser?.publicName || ""}
            />
            {selectedUser && (
              <div className="text-sm text-muted-foreground">
                Selected: {selectedUser.publicName || "Unknown User"}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
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
