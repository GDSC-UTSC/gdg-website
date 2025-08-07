import { Timestamp } from "firebase-admin/firestore";

// Event Types
export type QuestionType = {
  type: "text" | "textarea" | "select" | "checkbox" | "file";
  label: string;
  options?: string[];
  required?: boolean;
};

export interface EventType {
  id: string;
  title: string;
  description: string;
  eventDate: Timestamp;
  startTime?: string;
  endTime?: string;
  location?: string;
  registrationDeadline?: Timestamp;
  status: "upcoming" | "ongoing" | "completed" | "cancelled" | "closed";
  tags?: string[];
  organizers?: string[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  imageUrls?: string[];
  link?: string;
  questions?: QuestionType[];
}

// Position Types
export type PositionType = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  status: "draft" | "active" | "inactive";
  questions: QuestionType[];
};

// Project Types
export interface ProjectType {
  id: string;
  title: string;
  description: string;
  languages?: string[];
  contributors?: string[];
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  imageUrls?: string[];
  link?: string;
}

// Application Types
export type ApplicationType = {
  id: string;
  name: string;
  email: string;
  questions: Record<string, string>;
  status: "pending" | "accepted" | "rejected";
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

// Registration Types
export type RegistrationType = {
  id: string;
  name: string;
  email: string;
  questions: Record<string, string>;
  status: "registered" | "cancelled";
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

// User Types
export const USER_ROLES = {
  SUPERADMIN: "superadmin",
  ADMIN: "admin",
  MEMBER: "member",
} as const;

export type Role = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface UserDataType {
  id: string;
  publicName?: string;
  updatedAt: Timestamp;
  profileImageUrl?: string;
  bio?: string;
  linkedin?: string;
  github?: string;
  role?: Role;
  associations?: {
    applications?: string[];
    registrations?: string[];
    collaborations?: string[];
  };
}