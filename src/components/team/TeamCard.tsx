import { TeamAssignment } from "@/app/types/team";
import { TeamMember } from "@/app/types/team/team";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Linkedin } from "lucide-react";

interface TeamCardProps {
  member: TeamMember;
  assignment: TeamAssignment;
  index: number;
}

const TeamCard = ({ member, assignment, index }: TeamCardProps) => {
  return (
    <Card className="bg-card/20 backdrop-blur-sm border-border hover:bg-card/80 transition-all duration-300 h-full">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={member.profileImageUrl || member.image} alt={member.publicName} />
            <AvatarFallback className="text-lg font-semibold">
              {member.publicName?.charAt(0).toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-xl">{member.publicName}</CardTitle>
        <p className="text-primary font-medium">{assignment.role}</p>
      </CardHeader>
      <CardContent className="text-center">
        {member.bio && (
          <p className="text-muted-foreground mb-4 text-sm">{member.bio}</p>
        )}

        <div className="flex justify-center gap-2">
          {member.linkedin && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </Button>
          )}
          {member.github && (
            <Button variant="outline" size="sm" asChild>
              <a href={member.github} target="_blank" rel="noopener noreferrer">
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
