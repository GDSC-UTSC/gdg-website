import { UserData } from "@/app/types/userdata";
import { StaggerContainer, FadeInOnScroll } from "@/components/animations";
import PageTitle from "@/components/ui/PageTitle";
import TeamCard from "@/components/team/TeamCard";

// Plain team interface (no dangerous methods)
interface PlainTeam {
  id: string;
  name: string;
  description: string;
  members: Array<{ userId: string; position: string; addedAt?: string; }>;
  createdAt: any;
  updatedAt: any;
}

export default async function TeamPageContent() {
  let teams: PlainTeam[] = [];
  let users: UserData[] = [];

  try {
    // Import server-side Firebase functions
    const { getDocuments } = await import("@/lib/firebase/server/firestore");
    
    // First load all teams using server-side Firebase (safe, no class methods)
    const serverTeams = await getDocuments("teams", {
      toFirestore: () => ({}),
      fromFirestore: (snapshot: any) => ({
        id: snapshot.id,
        name: snapshot.data().name,
        description: snapshot.data().description,
        members: snapshot.data().members || [],
        createdAt: snapshot.data().createdAt,
        updatedAt: snapshot.data().updatedAt,
      }),
    }, { public: true });
    
    teams = serverTeams;
    
    // Collect all unique user IDs from all teams
    const allMemberIds = new Set<string>();
    teams.forEach(team => {
      team.members.forEach(member => {
        allMemberIds.add(member.userId);
      });
    });
    
    // Load only the users who are team members
    const userPromises = Array.from(allMemberIds).map(async (userId) => {
      try {
        return await UserData.read(userId, { server: true });
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
          const sortedMembers = team.members;

          return (
            <FadeInOnScroll key={team.id} delay={teamIndex * 0.2} once={false}>
              <section>
                <h2 className="text-3xl font-bold mb-8 text-center pb-2 border-b border-border border-dashed">
                  {team.name}
                </h2>

                {team.description && (
                  <p className="text-muted-foreground text-center mb-8">{team.description}</p>
                )}

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

        {teams.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-white mb-2">No Teams Yet</h3>
            <p className="text-gray-400 mb-6">Check back soon to meet our team!</p>
          </div>
        )}
      </div>
    </>
  );
}