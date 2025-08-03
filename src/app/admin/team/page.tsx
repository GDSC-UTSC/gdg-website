"use client";

import { Team } from "@/app/types/team";
import { UserData } from "@/app/types/userdata";
import AddTeamMemberComponent from "@/components/admin/AddTeamMemberComponent";
import CreateTeamComponent from "@/components/admin/CreateTeamComponent";
import PageTitle from "@/components/ui/PageTitle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminTeamPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [memberUsers, setMemberUsers] = useState<Map<string, UserData>>(new Map());

  // Load teams and then load individual team member users
  useEffect(() => {
    const loadData = async () => {
      try {
        const teamsData = await Team.readAll();
        setTeams(teamsData);
        
        // Collect all unique user IDs from all teams
        const allMemberIds = new Set<string>();
        teamsData.forEach(team => {
          team.members.forEach(member => {
            allMemberIds.add(member.userId);
          });
        });
        
        // Load only the users who are team members
        const userPromises = Array.from(allMemberIds).map(async (userId) => {
          try {
            const user = await UserData.read(userId);
            return { userId, user };
          } catch (error) {
            console.error(`Error loading user ${userId}:`, error);
            return { userId, user: null };
          }
        });
        
        const userResults = await Promise.all(userPromises);
        const usersMap = new Map<string, UserData>();
        userResults.forEach(({ userId, user }) => {
          if (user) {
            usersMap.set(userId, user);
          }
        });
        
        setMemberUsers(usersMap);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, []);


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
        
        // Remove the user from memberUsers map if they're no longer in any team
        const allCurrentMemberIds = new Set<string>();
        updatedTeams.forEach(team => {
          team.members.forEach(member => {
            allCurrentMemberIds.add(member.userId);
          });
        });
        
        setMemberUsers(prev => {
          const updated = new Map(prev);
          for (const [id] of prev) {
            if (!allCurrentMemberIds.has(id)) {
              updated.delete(id);
            }
          }
          return updated;
        });
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
                      const user = memberUsers.get(member.userId);
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
