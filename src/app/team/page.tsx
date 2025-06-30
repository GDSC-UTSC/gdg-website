"use client";
import { ROLE_ORDER, TeamMember } from "@/app/types/team/team";
import TeamCard from "@/components/team/TeamCard";
import PageTitle from "@/components/ui/PageTitle";
import { motion } from "framer-motion";
import { teamMembers } from "./team";

const TeamPage = () => {
  // Group team members by role
  const groupByRole = (members: TeamMember[]) => {
    const grouped = members.reduce((acc, member) => {
      if (!acc[member.role]) {
        acc[member.role] = [];
      }
      acc[member.role].push(member);
      return acc;
    }, {} as Record<string, TeamMember[]>);

    // Sort members within each role by their order
    Object.keys(grouped).forEach((role) => {
      grouped[role].sort((a, b) => (a.order || 0) - (b.order || 0));
    });

    return grouped;
  };

  // Sort roles by their defined order
  const sortRoles = (roles: string[]) => {
    return roles.sort(
      (a, b) =>
        ROLE_ORDER[a as keyof typeof ROLE_ORDER] -
        ROLE_ORDER[b as keyof typeof ROLE_ORDER]
    );
  };

  const groupedMembers = groupByRole(teamMembers);
  const sortedRoles = sortRoles(Object.keys(groupedMembers));

  return (
    <div className="min-h-screen gradient-bg pt-20">
      <div className="container mx-auto px-4 py-20">
        {/* Page Header */}
        <PageTitle 
          title="Our Team"
          description="Meet the passionate individuals driving innovation and community growth at GDG @ UTSC."
          className="mb-16"
        />

        {/* Team Sections */}
        {sortedRoles.map((role, roleIndex) => (
          <motion.section
            key={role}
            className="mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: roleIndex * 0.2 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{role}</h2>
              <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {groupedMembers[role].map((member, memberIndex) => (
                <TeamCard key={member.id} member={member} index={memberIndex} />
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
};

export default TeamPage;
