import { useQuery } from '@tanstack/react-query';
import api from '../../../lib/api';

export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
}

export const useGithubUser = (username: string) => {
  return useQuery({
    queryKey: ['githubUser', username],
    queryFn: async () => {
      if (!username) return null;
      const response = await api.get<{ data: GitHubUser }>(`/github/user/${username}`);
      return response.data.data;
    },
    enabled: !!username,
    retry: false, // Prevents multiple rapid retries on 404
  });
};
