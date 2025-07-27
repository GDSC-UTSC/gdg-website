import { Team } from "@/app/types/team";
import { UserData } from "@/app/types/userdata";
import PageTitle from "@/components/ui/PageTitle";
import TeamCard from "../../components/team/TeamCard";

export default async function TeamPage() {
  let teams: Team[] = [];
  let users: UserData[] = [];

  try {
    const [fetchedTeams, fetchedUsers] = await Promise.all([
      Team.readAll({ server: true, public: true }),
      UserData.readAll({ server: true, public: true }),
    ]);

    teams = fetchedTeams;
    users = fetchedUsers;
  } catch (error) {
    console.error("Error fetching team data:", error);
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <PageTitle title="Our Team" description="Meet the amazing people behind GDG @ UTSC" />

        <div className="grid gap-12">
          {teams.map((team) => {
            const sortedMembers = team.getSortedMembers();

            return (
              <section key={team.id}>
                <h2 className="text-3xl font-bold mb-8 text-center pb-2 border-b border-border border-dashed">
                  {team.name}
                </h2>

                {team.description && <p className="text-muted-foreground text-center mb-8">{team.description}</p>}

                {sortedMembers.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No team members assigned yet.</p>
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {sortedMembers.map((member, index) => {
                      const user = users.find((u) => u.id === member.userId);
                      if (!user) return null;

                      return <TeamCard key={`${team.id}-${member.userId}`} member={member} user={user} index={index} />;
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
