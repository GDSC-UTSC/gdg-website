// Define fixed role options with ordering
export const TEAM_ROLES = {
  CO_LEADS: "Co Lead",
  VICE_LEADS: "Vice Lead",
  TECHNOLOGY: "Technology",
  ADVISOR: "Advisor",
  ACADEMICS: "Academics",
  MARKETING: "Marketing",
  OPERATIONS: "Operations",
} as const;

// Role ordering for display (lower number = higher priority)
export const ROLE_ORDER = {
  [TEAM_ROLES.CO_LEADS]: 1,
  [TEAM_ROLES.VICE_LEADS]: 2,
  [TEAM_ROLES.TECHNOLOGY]: 3,
  [TEAM_ROLES.ADVISOR]: 4,
  [TEAM_ROLES.ACADEMICS]: 5,
  [TEAM_ROLES.MARKETING]: 6,
  [TEAM_ROLES.OPERATIONS]: 7,
} as const;

export type TeamRole = (typeof TEAM_ROLES)[keyof typeof TEAM_ROLES];

export interface TeamMember {
  id: string;
  name: string;
  role: TeamRole;
  bio?: string;
  image?: string;
  linkedin?: string;
  github?: string;
  order?: number; // Optional custom ordering within role
}
