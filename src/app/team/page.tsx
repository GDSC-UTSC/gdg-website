import { ROLES, Role, TEAMS, TeamAssignment } from "@/app/types/team";
import { UserData } from "@/app/types/userdata";
import PageTitle from "@/components/ui/PageTitle";
import { Card } from "@/components/ui/card";
import { Github, Linkedin } from "lucide-react";
import Image from "next/image";

export default async function TeamPage() {
  let assignments: TeamAssignment[] = [];
  let users: UserData[] = [];

  try {
    const [fetchedAssignments, fetchedUsers] = await Promise.all([
      TeamAssignment.readAllActive({ server: true }),
      UserData.readAll({ server: true }),
    ]);

    assignments = fetchedAssignments;
    users = fetchedUsers;
  } catch (error) {
    console.error("Error fetching team data:", error);
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <PageTitle
          title="Our Team"
          description="Meet the amazing people behind GDG @ UTSC"
        />

        <div className="grid gap-12">
          {Object.values(TEAMS).map((team) => {
            const teamAssignments = assignments.filter((a) => a.team === team);

            // Define role order for each team type
            const getRoleOrder = (team: string): Role[] => {
              if (team === TEAMS.EXECUTIVE) {
                return [ROLES.PRESIDENT, ROLES.VICE_PRESIDENT];
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
              <section key={team}>
                <h2 className="text-3xl font-bold mb-8 text-center">{team}</h2>

                {sortedAssignments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No team members assigned yet.
                  </p>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {sortedAssignments.map((assignment) => {
                      const user = users.find(
                        (u) => u.id === assignment.userId
                      );
                      if (!user) return null;

                      return (
                        <Card key={assignment.id} className="p-6">
                          <div className="flex flex-col items-center text-center">
                            <div className="relative w-32 h-32 mb-4">
                              {user.profileImageUrl ? (
                                <Image
                                  src={user.profileImageUrl}
                                  alt={user.publicName || "Team member"}
                                  fill
                                  className="rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full rounded-full bg-muted flex items-center justify-center text-4xl font-bold text-muted-foreground">
                                  {(user.publicName || "?")[0].toUpperCase()}
                                </div>
                              )}
                            </div>

                            <h4 className="text-xl font-semibold mb-1">
                              {user.publicName}
                            </h4>
                            <p className="text-muted-foreground mb-4">
                              {assignment.role}
                            </p>

                            {user.bio && (
                              <p className="text-sm text-muted-foreground mb-4">
                                {user.bio}
                              </p>
                            )}

                            <div className="flex gap-4">
                              {user.github && (
                                <a
                                  href={user.github}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  <Github className="w-5 h-5" />
                                </a>
                              )}
                              {user.linkedin && (
                                <a
                                  href={user.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  <Linkedin className="w-5 h-5" />
                                </a>
                              )}
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
