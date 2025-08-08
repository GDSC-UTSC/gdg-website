"use client";

import { Team } from "@/app/types/team";
import { UserData } from "@/app/types/userdata";
import AddTeamMemberComponent from "@/components/admin/AddTeamMemberComponent";
import CreateTeamComponent from "@/components/admin/CreateTeamComponent";
import PageTitle from "@/components/ui/PageTitle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { Timestamp } from "firebase/firestore";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminTeamPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const { user } = useAuth();

  // Dialog states
  const [teamDialogOpen, setTeamDialogOpen] = useState(false);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState("");

  // Form data
  const [teamFormData, setTeamFormData] = useState({
    name: "",
    description: "",
  });

  const [memberFormData, setMemberFormData] = useState({
    email: "",
    position: "",
  });

  // Load teams and users
  useEffect(() => {
    const loadData = async () => {
      try {
        const [teamsData, usersData] = await Promise.all([
          Team.readAll(),
          UserData.readAll()
        ]);
        setTeams(teamsData);
        setAllUsers(usersData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const team = new Team({
        id: crypto.randomUUID(),
        name: teamFormData.name,
        description: teamFormData.description,
        members: [],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      await team.create();

      // Refresh teams list
      const updatedTeams = await Team.readAll();
      setTeams(updatedTeams);
      setTeamDialogOpen(false);
      setTeamFormData({ name: "", description: "" });
      toast.success("Team created successfully");
    } catch (error) {
      console.error("Error creating team:", error);
      toast.error("Failed to create team");
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTeamId || !memberFormData.email || !memberFormData.position) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (!user) {
        toast.error("User not authenticated");
        return;
      }

      const selectedTeam = teams.find((t) => t.id === selectedTeamId);
      if (!selectedTeam) {
        toast.error("Team not found");
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
          email: memberFormData.email,
          teamName: selectedTeam.name,
          position: memberFormData.position,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error || "Failed to add team member");
        return;
      }

      // Refresh teams list
      const updatedTeams = await Team.readAll();
      setTeams(updatedTeams);
      setMemberDialogOpen(false);
      setMemberFormData({ email: "", position: "" });
      toast.success("Team member added successfully");
    } catch (error) {
      console.error("Error adding team member:", error);
      toast.error("Failed to add team member");
    }
  };

  const handleRemoveMember = async (teamId: string, userId: string) => {
    try {
      const team = teams.find((t) => t.id === teamId);
      if (!team) return;

      if (confirm("Are you sure you want to remove this team member?")) {
        team.removeMember(userId);
        await team.update();

        // Refresh teams list and update member users if needed
        const updatedTeams = await Team.readAll();
        setTeams(updatedTeams);
        toast.success("Team member removed successfully");
      }
    } catch (error) {
      console.error("Error removing team member:", error);
      toast.error("Failed to remove team member");
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    try {
      const team = teams.find((t) => t.id === teamId);
      if (!team) return;

      if (confirm("Are you sure you want to delete this entire team? This action cannot be undone.")) {
        await team.delete();

        // Refresh teams list
        const updatedTeams = await Team.readAll();
        setTeams(updatedTeams);
        toast.success("Team deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting team:", error);
      toast.error("Failed to delete team");
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <PageTitle title="Team Management" description="Manage teams and their members" />

          <div className="flex gap-2">
            <CreateTeamComponent />
            <AddTeamMemberComponent />
          </div>
        </div>

        <div className="grid gap-6">
          {teams.map((team) => {
            const sortedMembers = team.getSortedMembers();

            return (
              <Card key={team.id} className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">{team.name}</h2>
                    {team.description && <p className="text-muted-foreground mt-1">{team.description}</p>}
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteTeam(team.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {sortedMembers.length === 0 ? (
                  <p className="text-muted-foreground">No team members assigned</p>
                ) : (
                  <div className="space-y-3">
                    {sortedMembers.map((member) => {
                      const user = allUsers.find(u => u.id === member.userId);
                      return (
                        <div
                          key={member.userId}
                          className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{user?.publicName || "Unknown User"}</p>
                            <p className="text-sm text-muted-foreground">{member.position}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoveMember(team.id, member.userId)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
