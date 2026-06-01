import axios from 'axios';
import { AppError } from '../utils/errors';
import { GitHubUser, GitHubRepo, GitHubStats } from '../types/github';

const githubClient = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github.v3+json',
  },
});

githubClient.interceptors.request.use((config) => {
  const token = process.env.GITHUB_API_TOKEN;
  if (token) {
    config.headers.Authorization = `token ${token}`;
  }
  return config;
});

const handleGitHubError = (error: any) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || error.message;

    if (status === 404) {
      throw new AppError('GitHub user or resource not found', 404);
    }
    if (status === 403 && message.toLowerCase().includes('rate limit')) {
      throw new AppError('GitHub API rate limit exceeded', 429);
    }
    throw new AppError(`GitHub API Error: ${message}`, status);
  }
  throw new AppError('An unexpected error occurred', 500);
};

export const fetchUserProfile = async (username: string): Promise<GitHubUser> => {
  try {
    const { data } = await githubClient.get<GitHubUser>(`/users/${username}`);
    return data;
  } catch (error) {
    return handleGitHubError(error);
  }
};

export const fetchUserRepos = async (username: string): Promise<GitHubRepo[]> => {
  try {
    const { data } = await githubClient.get<GitHubRepo[]>(`/users/${username}/repos?per_page=100&sort=updated`);
    return data;
  } catch (error) {
    return handleGitHubError(error);
  }
};

export const calculateUserStats = async (username: string): Promise<GitHubStats> => {
  try {
    const repos = await fetchUserRepos(username);

    let totalStars = 0;
    let totalForks = 0;
    let totalIssues = 0;
    const topLanguages: Record<string, number> = {};

    repos.forEach((repo) => {
      totalStars += repo.stargazers_count;
      totalForks += repo.forks_count;
      totalIssues += repo.open_issues_count;

      if (repo.language) {
        if (!topLanguages[repo.language]) {
          topLanguages[repo.language] = 0;
        }
        topLanguages[repo.language] += 1;
      }
    });

    return {
      totalStars,
      totalCommits: 0, 
      totalForks,
      totalIssues,
      totalContributedTo: 0,
      topLanguages,
    };
  } catch (error) {
    return handleGitHubError(error);
  }
};
