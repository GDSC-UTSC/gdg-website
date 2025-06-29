import { TEAM_ROLES, TeamMember } from "@/app/types/team";

// dummy data, will be changed to fetch from database in the future
  export const teamMembers: TeamMember[] = [
    {
      id: "1",
      name: "John Doe",
      role: TEAM_ROLES.CO_LEADS,
      bio: "Passionate about building innovative solutions and fostering a collaborative developer community.",
      image:
        "https://media.licdn.com/dms/image/v2/D4E03AQF1tA59FujGDw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1727638440885?e=2147483647&v=beta&t=v3DpWVQgRscp1vvwZJLCjb4Xagt5-Tp8nKg89LEw-Co",
      linkedin: "https://linkedin.com/in/johndoe",
      github: "https://github.com/johndoe",
      order: 1,
    },
    {
      id: "2",
      name: "Jane Smith",
      role: TEAM_ROLES.VICE_LEADS,
      bio: "Experienced in full-stack development with a focus on user experience and accessibility.",
      image:
        "https://media.licdn.com/dms/image/v2/D4E03AQF1tA59FujGDw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1727638440885?e=2147483647&v=beta&t=v3DpWVQgRscp1vvwZJLCjb4Xagt5-Tp8nKg89LEw-Co",
      linkedin: "https://linkedin.com/in/janesmith",
      github: "https://github.com/janesmith",
      order: 1,
    },
    {
      id: "3",
      name: "Mike Johnson",
      role: TEAM_ROLES.TECHNOLOGY,
      image:
        "https://media.licdn.com/dms/image/v2/D4E03AQF1tA59FujGDw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1727638440885?e=2147483647&v=beta&t=v3DpWVQgRscp1vvwZJLCjb4Xagt5-Tp8nKg89LEw-Co",
      bio: "Specialized in cloud architecture and DevOps practices.",
      github: "https://github.com/mikejohnson",
      order: 1,
    },
    {
      id: "4",
      name: "Sarah Wilson",
      role: TEAM_ROLES.MARKETING,
      image:
        "https://media.licdn.com/dms/image/v2/D4E03AQF1tA59FujGDw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1727638440885?e=2147483647&v=beta&t=v3DpWVQgRscp1vvwZJLCjb4Xagt5-Tp8nKg89LEw-Co",
      bio: "Creating memorable tech events and workshops for the community.",
      linkedin: "https://linkedin.com/in/sarahwilson",
      order: 1,
    },
    {
      id: "5",
      name: "Alex Chen",
      role: TEAM_ROLES.OPERATIONS,
      image:
        "https://media.licdn.com/dms/image/v2/D4E03AQF1tA59FujGDw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1727638440885?e=2147483647&v=beta&t=v3DpWVQgRscp1vvwZJLCjb4Xagt5-Tp8nKg89LEw-Co",
      bio: "Ensuring smooth operations and logistics for all GDG events and activities.",
      linkedin: "https://linkedin.com/in/alexchen",
      order: 1,
    },
    {
      id: "6",
      name: "Dr. Emily Rodriguez",
      role: TEAM_ROLES.ADVISOR,
      image:
        "https://media.licdn.com/dms/image/v2/D4E03AQF1tA59FujGDw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1727638440885?e=2147483647&v=beta&t=v3DpWVQgRscp1vvwZJLCjb4Xagt5-Tp8nKg89LEw-Co",
      bio: "Faculty advisor providing guidance and support for GDG initiatives and academic integration.",
      linkedin: "https://linkedin.com/in/emilyrodriguez",
      order: 1,
    },
    {
      id: "7",
      name: "David Kim",
      role: TEAM_ROLES.ACADEMICS,
      image:
        "https://media.licdn.com/dms/image/v2/D4E03AQF1tA59FujGDw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1727638440885?e=2147483647&v=beta&t=v3DpWVQgRscp1vvwZJLCjb4Xagt5-Tp8nKg89LEw-Co",
      bio: "Coordinating academic partnerships and educational content development.",
      github: "https://github.com/davidkim",
      linkedin: "https://linkedin.com/in/davidkim",
      order: 1,
    },
    {
      id: "8",
      name: "Lisa Thompson",
      role: TEAM_ROLES.AMBASSADORS,
      image:
      "https://media.licdn.com/dms/image/v2/D4E03AQF1tA59FujGDw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1727638440885?e=2147483647&v=beta&t=v3DpWVQgRscp1vvwZJLCjb4Xagt5-Tp8nKg89LEw-Co",
      bio: "Representing GDG at university events and building community partnerships.",
      linkedin: "https://linkedin.com/in/lisathompson",
      order: 1,
    },
    {
      id: "9",
      name: "Ryan Park",
      role: TEAM_ROLES.TECHNOLOGY,
      image:
      "https://media.licdn.com/dms/image/v2/D4E03AQF1tA59FujGDw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1727638440885?e=2147483647&v=beta&t=v3DpWVQgRscp1vvwZJLCjb4Xagt5-Tp8nKg89LEw-Co",
      bio: "Full-stack developer passionate about React, Node.js, and emerging technologies.",
      github: "https://github.com/ryanpark",
      linkedin: "https://linkedin.com/in/ryanpark",
      order: 2,
    },
    {
      id: "10",
      name: "Maria Garcia",
      role: TEAM_ROLES.MARKETING,
      image:
      "https://media.licdn.com/dms/image/v2/D4E03AQF1tA59FujGDw/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1727638440885?e=2147483647&v=beta&t=v3DpWVQgRscp1vvwZJLCjb4Xagt5-Tp8nKg89LEw-Co",
      bio: "Creative marketing specialist focused on social media and community engagement.",
      linkedin: "https://linkedin.com/in/mariagarcia",
      order: 2,
    },
  ];
