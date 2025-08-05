import { TeamMember } from "@/app/types/team";
import { UserData } from "@/app/types/userdata";
import { ScaleIn } from "@/components/animations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Linkedin } from "lucide-react";
import Image from "next/image";

interface TeamCardProps {
  member: TeamMember;
  user: UserData;
  index: number;
}

const TeamCard = ({ member, user, index }: TeamCardProps) => {
  return (
    <ScaleIn hover className="w-full">
      <Card className="bg-card/20 backdrop-blur-sm border-border hover:bg-card/80 transition-all duration-300 w-full h-full flex flex-col">
        <CardHeader className="text-center flex-shrink-0 pb-4">
          <div className="flex justify-center mb-6">
            <div className="relative h-24 w-24 rounded-full overflow-hidden bg-muted">
              {user.profileImageUrl ? (
                <Image
                  src={user.profileImageUrl}
                  alt={user.publicName || "Unknown"}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full text-xl font-semibold text-muted-foreground">
                  {user.publicName?.charAt(0).toUpperCase() || "?"}
                </div>
              )}
            </div>
          </div>
          <CardTitle className="text-lg line-clamp-1 mb-2">{user.publicName || "Unknown"}</CardTitle>
          <p className="text-primary font-medium text-sm">{member.position}</p>
        </CardHeader>
        <CardContent className="text-center flex-1 flex flex-col justify-between px-4 pb-6">
          <div className="flex-1 flex items-center justify-center min-h-[60px]">
            {user.bio ? (
              <p className="text-muted-foreground text-xs line-clamp-4 leading-relaxed">{user.bio}</p>
            ) : (
              <p className="text-muted-foreground text-xs italic">No bio available</p>
            )}
          </div>

          <div className="flex justify-center gap-2 mt-4">
            {user.linkedin && (
              <Button variant="outline" size="sm" asChild className="h-8 w-8 p-0">
                <a
                  href={user.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="h-3 w-3" />
                </a>
              </Button>
            )}
            {user.github && (
              <Button variant="outline" size="sm" asChild className="h-8 w-8 p-0">
                <a href={user.github} target="_blank" rel="noopener noreferrer">
                  <Github className="h-3 w-3" />
                </a>
              </Button>
            )}
            {(!user.linkedin && !user.github) && (
              <div className="text-xs text-muted-foreground opacity-50">No links</div>
            )}
          </div>
        </CardContent>
      </Card>
    </ScaleIn>
  );
};

export default TeamCard;
