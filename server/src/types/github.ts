export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string;
  company: string;
  blog: string;
  location: string;
  email: string | null;
  bio: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  fork: boolean;
  url: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  stargazers_count: number;
  watchers_count: number;
  language: string;
  forks_count: number;
  open_issues_count: number;
  topics: string[];
}

export interface GitHubStats {
  totalStars: number;
  totalCommits: number;
  totalForks: number;
  totalIssues: number;
  totalContributedTo: number;
  topLanguages: Record<string, number>;
}

export type DeveloperType = 
  | 'Frontend Engineer'
  | 'Backend Engineer'
  | 'Full Stack Engineer'
  | 'AI Engineer'
  | 'Open Source Contributor';

export interface DeveloperDNA {
  developerType: DeveloperType;
  confidence: number;
  strengths: string[];
  recommendations: string[];
}
