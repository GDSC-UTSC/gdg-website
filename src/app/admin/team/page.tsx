"use client";

import { UserData } from "@/app/types/userdata";
import AddTeamMemberComponent from "@/components/admin/AddTeamMemberComponent";
import CreateTeamComponent from "@/components/admin/CreateTeamComponent";
import PageTitle from "@/components/ui/PageTitle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

// Plain team data interfaces (no dangerous methods)
interface TeamMember {
  userId: string;
  position: string;
  addedAt?: string;
}

interface PlainTeam {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  createdAt: string | null;
  updatedAt: string | null;
}

export default function AdminTeamPage() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<PlainTeam[]>([]);
  const [memberUsers, setMemberUsers] = useState<Map<string, UserData>>(new Map());

  // Load teams function
  const loadTeams = async () => {
    try {
      if (!user) return;
      
      const token = await user.getIdToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_FUNCTIONS_URL}/getTeams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch teams');
      }

      const result = await response.json();
      const teamsData = result.teams;
      setTeams(teamsData);

      // Collect all unique user IDs from all teams
      const allMemberIds = new Set<string>();
      teamsData.forEach((team: PlainTeam) => {
        team.members.forEach(member => {
          allMemberIds.add(member.userId);
        });
      });

      // Load only the users who are team members
      const userPromises = Array.from(allMemberIds).map(async (userId) => {
        try {
          const userData = await UserData.read(userId);
          return { userId, user: userData };
        } catch (error) {
          console.error(`Error loading user ${userId}:`, error);
          return { userId, user: null };
        }
      });

      const userResults = await Promise.all(userPromises);
      const usersMap = new Map<string, UserData>();
      userResults.forEach(({ userId, user: userData }) => {
        if (userData) {
          usersMap.set(userId, userData);
        }
      });

      setMemberUsers(usersMap);
    } catch (error) {
      console.error("Error loading teams:", error);
      toast.error("Failed to load teams");
    }
  };

  // Load teams and then load individual team member users
  useEffect(() => {
    loadTeams();
  }, [user]);


  const handleRemoveMember = async (teamId: string, userId: string) => {
    try {
      if (!user) return;

      if (confirm("Are you sure you want to remove this team member?")) {
        const token = await user.getIdToken();
        const response = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_FUNCTIONS_URL}/removeUserFromTeam`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, teamId, userId }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to remove team member');
        }

        // Refresh teams list and update member users
        await loadTeams();
        toast.success("Team member removed successfully");
      }
    } catch (error) {
      console.error("Error removing team member:", error);
      toast.error("Failed to remove team member");
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    try {
      if (!user) return;

      if (confirm("Are you sure you want to delete this entire team? This action cannot be undone.")) {
        const token = await user.getIdToken();
        const response = await fetch(`${process.env.NEXT_PUBLIC_CLOUD_FUNCTIONS_URL}/deleteTeam`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, teamId }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to delete team');
        }

        // Refresh teams list
        await loadTeams();
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
            const sortedMembers = team.members;

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
