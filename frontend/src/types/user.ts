export interface Project {
  id: string;
  title: string;
  description: string;
  techs: string[];
  repoUrl?: string;
  liveUrl?: string;
  isPrivate: boolean;
  userId: string;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  socials: {
    github?: string;
    linkedin?: string;
  };
  techStack: {
    systems: string[];
    languages: string[];
    tools: string[];
  };
  projects: Project[];
}