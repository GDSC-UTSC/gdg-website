import { ROLES, Role, TEAMS, TeamAssignment } from "@/app/types/team";
import { UserData } from "@/app/types/userdata";
import PageTitle from "@/components/ui/PageTitle";
import TeamCard from "../../components/team/TeamCard";
import { TeamMember } from "../types/team/team";

export default async function TeamPage() {
  let assignments: TeamAssignment[] = [];
  let users: UserData[] = [];

  try {
    const [fetchedAssignments, fetchedUsers] = await Promise.all([
      TeamAssignment.readAll({ server: true }),
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
                <h2 className="text-3xl font-bold mb-8 text-center pb-2 border-b border-border border-dashed">
                  {team}
                </h2>

                {sortedAssignments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No team members assigned yet.
                  </p>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {sortedAssignments.map((assignment, index) => {
                      const user = users.find(
                        (u) => u.id === assignment.userId
                      );

                      return (
                        <TeamCard
                          key={index}
                          member={user as TeamMember}
                          assignment={assignment}
                          index={index}
                        />
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
