"use client";

import { ROLES, Role, TEAMS, TeamAssignment } from "@/app/types/team";
import { UserData } from "@/app/types/userdata";
import PageTitle from "@/components/ui/PageTitle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useDebounce from "@/hooks/useDebounce";
import { Timestamp } from "firebase/firestore";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminTeamPage() {
  const [input, setInput] = useState("");
  const debouncedQuery = useDebounce(input, 300);
  const [users, setUsers] = useState<UserData[]>([]);

  useEffect(() => {
    if (debouncedQuery === "") {
      setUsers([]);
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/getUsers", {
          method: "POST",
          body: JSON.stringify({ query: debouncedQuery }),
        });
        const userData = await res.json();
        setUsers(userData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [debouncedQuery]);

  const [assignments, setAssignments] = useState<TeamAssignment[]>([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    userId: "",
    team: Object.values(TEAMS)[0],
    role: Object.values(ROLES)[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Check if user already has an assignment for this team and role
      const existingAssignment = assignments.find(
        (a) =>
          a.userId === formData.userId &&
          a.team === formData.team &&
          a.role === formData.role
      );

      if (existingAssignment) {
        toast.error("User already has an assignment for this team and role");
        return;
      }

      const assignmentId = crypto.randomUUID();
      const assignment = new TeamAssignment({
        id: assignmentId,
        userId: formData.userId,
        team: formData.team as any,
        role: formData.role as any,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      await assignment.create();

      // Refresh the assignments list
      const updatedAssignments = await TeamAssignment.readAll();
      setAssignments(updatedAssignments);
      setDialogOpen(false);
      setFormData({
        userId: "",
        team: Object.values(TEAMS)[0],
        role: Object.values(ROLES)[0],
      });
      toast.success("Team member assigned successfully");
    } catch (error) {
      console.error("Error assigning team member:", error);
      toast.error("Failed to assign team member");
    }
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    try {
      const assignment = assignments.find((a) => a.id === assignmentId);
      if (!assignment) return;

      if (confirm("Are you sure you want to remove this team member?")) {
        await assignment.delete();

        setAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
        toast.success("Team member removed successfully");
      }
    } catch (error) {
      console.error("Error removing team member:", error);
      toast.error("Failed to remove team member");
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <PageTitle
            title="Team Management"
            description="Manage executive team members and their roles"
          />

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>Assign Team Member</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Team Member</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userId">Team Member</Label>
                  <Command>
                    <CommandInput
                      placeholder="Search for a member"
                      value={input}
                      onValueChange={setInput}
                    />
                    <CommandList className="max-h-[100px] overflow-y-auto">
                      {users
                        .filter((user) => user.publicName)
                        .map((user) => (
                          <CommandItem
                            key={user.id}
                            value={user.publicName}
                            onSelect={() => {
                              setFormData((prev) => ({
                                ...prev,
                                userId: user.id,
                              }));
                              setInput(user.publicName || "");
                            }}
                          >
                            {user.publicName}
                          </CommandItem>
                        ))}
                    </CommandList>
                  </Command>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="team">Team</Label>
                  <Select
                    value={formData.team}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, team: value as any }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a team" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(TEAMS).map((team) => (
                        <SelectItem key={team} value={team}>
                          {team}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, role: value as any }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ROLES).map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full">
                  Assign Role
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {Object.values(TEAMS).map((team) => {
            const teamAssignments = assignments.filter((a) => a.team === team);

            // Define role order for each team type
            const getRoleOrder = (team: string): Role[] => {
              if (team === TEAMS.EXECUTIVE) {
                return [ROLES.PRESIDENT];
              } else {
                return [ROLES.VICE_LEADER, ROLES.DIRECTOR, ROLES.ASSOCIATE];
              }
            };

            // Sort assignments by role hierarchy
            const sortedAssignments = teamAssignments.sort((a, b) => {
              const roleOrder = getRoleOrder(team);
              const aIndex = roleOrder.indexOf(a.role as any);
              const bIndex = roleOrder.indexOf(b.role as any);
              return aIndex - bIndex;
            });

            return (
              <Card key={team} className="p-6">
                <h2 className="text-2xl font-bold mb-6">{team}</h2>

                {sortedAssignments.length === 0 ? (
                  <p className="text-muted-foreground">
                    No team members assigned
                  </p>
                ) : (
                  <div className="space-y-3">
                    {sortedAssignments.map((assignment) => {
                      const user = users.find(
                        (u) => u.id === assignment.userId
                      );
                      return (
                        <div
                          key={assignment.id}
                          className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">
                              {user?.publicName || user?.id || "Unknown User"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {assignment.role}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                handleDeleteAssignment(assignment.id)
                              }
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
