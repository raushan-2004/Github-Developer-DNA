import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/api';

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
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
  // Decorated cache metadata
  cached?: boolean;
  timestamp?: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  topics?: string[];
  updated_at: string;
}

export interface GitHubStats {
  totalStars: number;
  totalCommits: number;
  totalForks: number;
  totalIssues: number;
  totalContributedTo: number;
  topLanguages: Record<string, number>;
  // Decorated cache metadata
  cached?: boolean;
  timestamp?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  cached?: boolean;
  timestamp?: string;
}

export const useGithubUser = (username: string) => {
  return useQuery({
    queryKey: ['githubUser', username],
    queryFn: async () => {
      if (!username) return null;
      const response = await api.get<ApiResponse<GitHubUser>>(`/github/user/${username}`);
      return {
        ...response.data.data,
        cached: response.data.cached,
        timestamp: response.data.timestamp,
      };
    },
    enabled: !!username,
    retry: false,
  });
};

export const useGithubRepos = (username: string) => {
  return useQuery({
    queryKey: ['githubRepos', username],
    queryFn: async () => {
      if (!username) return null;
      const response = await api.get<ApiResponse<GitHubRepo[]>>(`/github/repos/${username}`);
      return response.data.data; // Array of repos
    },
    enabled: !!username,
    retry: false,
  });
};

export const useGithubStats = (username: string) => {
  return useQuery({
    queryKey: ['githubStats', username],
    queryFn: async () => {
      if (!username) return null;
      const response = await api.get<ApiResponse<GitHubStats>>(`/github/stats/${username}`);
      return {
        ...response.data.data,
        cached: response.data.cached,
        timestamp: response.data.timestamp,
      };
    },
    enabled: !!username,
    retry: false,
  });
};
