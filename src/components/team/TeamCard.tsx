import { TeamMember } from "@/app/types/team";
import { UserData } from "@/app/types/userdata";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Linkedin } from "lucide-react";

interface TeamCardProps {
  member: TeamMember;
  user: UserData;
  index: number;
}

const TeamCard = ({ member, user, index }: TeamCardProps) => {
  return (
    <Card className="bg-card/20 backdrop-blur-sm border-border hover:bg-card/80 transition-all duration-300 h-full">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={user.profileImageUrl || ""}
              alt={user.publicName || "Unknown"}
            />
            <AvatarFallback className="text-lg font-semibold">
              {user.publicName?.charAt(0).toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-xl">{user.publicName || "Unknown"}</CardTitle>
        <p className="text-primary font-medium">{member.position}</p>
      </CardHeader>
      <CardContent className="text-center">
        {user.bio && (
          <p className="text-muted-foreground mb-4 text-sm">{user.bio}</p>
        )}

        <div className="flex justify-center gap-2">
          {user.linkedin && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={user.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </Button>
          )}
          {user.github && (
            <Button variant="outline" size="sm" asChild>
              <a href={user.github} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamCard;
