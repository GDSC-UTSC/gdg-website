import { Team } from "@/app/types/team";
import { UserData } from "@/app/types/userdata";
import { FadeInOnScroll, StaggerContainer } from "@/components/animations";
import TeamCard from "@/components/team/TeamCard";
import PageTitle from "@/components/ui/PageTitle";

export default async function TeamPageContent() {
  let teams: Team[] = [];
  let users: UserData[] = [];

  try {
    // First load all teams
    teams = await Team.readAll({ server: true, public: true });

    // Collect all unique user IDs from all teams
    const allMemberIds = new Set<string>();
    // put execs on top and tech second
    const firstTeam = teams[0];
    const secondTeam = teams[1];
    const techTeam = teams.find((team) => team.name === "Technology");
    const execTeam = teams.find((team) => team.name === "Executive");

    const techTeamIdx = teams.indexOf(techTeam!);
    const execTeamIdx = teams.indexOf(execTeam!);

    teams[0] = execTeam!;
    teams[1] = techTeam!;
    teams[techTeamIdx] = firstTeam;
    teams[execTeamIdx] = secondTeam;
    teams.forEach((team) => {
      team.members.forEach((member) => {
        allMemberIds.add(member.userId);
      });
    });

    // Load only the users who are team members
    const userPromises = Array.from(allMemberIds).map(async (userId) => {
      try {
        return await UserData.read(userId, { server: true, public: true });
      } catch (error) {
        console.error(`Error loading user ${userId}:`, error);
        return null;
      }
    });

    const userResults = await Promise.all(userPromises);
    users = userResults.filter((user): user is UserData => user !== null);
  } catch (error) {
    console.error("Error fetching team data:", error);
  }

  return (
    <>
      <PageTitle title="Our Team" description="Meet the amazing people behind GDG @ UTSC" />

      <div className="grid gap-12 w-full">
        {teams.map((team, teamIndex) => {
          const sortedMembers = team.getSortedMembers();

          return (
            <FadeInOnScroll key={team.id} delay={teamIndex * 0.2} once={false}>
              <section>
                <h2 className="text-3xl font-bold mb-8 text-center pb-2 border-b border-border border-dashed">
                  {team.name}
                </h2>

                {team.description && <p className="text-muted-foreground text-center mb-8">{team.description}</p>}

                {sortedMembers.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No team members assigned yet.</p>
                ) : (
                  <StaggerContainer className="flex flex-wrap gap-8 justify-center items-start">
                    {sortedMembers.map((member, index) => {
                      const user = users.find((u) => u.id === member.userId);
                      if (!user) return null;

                      return (
                        <FadeInOnScroll key={`${team.id}-${member.userId}`} delay={index * 0.1} once={false}>
                          <div className="w-72 h-72">
                            <TeamCard member={member} user={user} index={index} />
                          </div>
                        </FadeInOnScroll>
                      );
                    })}
                  </StaggerContainer>
                )}
              </section>
            </FadeInOnScroll>
          );
        })}
      </div>
    </>
  );
}
