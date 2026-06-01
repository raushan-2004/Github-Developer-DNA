import { fetchUserProfile, fetchUserRepos, calculateUserStats } from './githubService';
import { cacheService } from './cacheService';
import { GitHubUser, GitHubRepo, GitHubStats } from '../types/github';

export interface CachedResponse<T> {
  data: T;
  cached: boolean;
  timestamp: string;
}

export const getCachedUserProfile = async (username: string): Promise<CachedResponse<GitHubUser>> => {
  const cacheKey = `user:${username.toLowerCase()}`;
  const cachedData = cacheService.get<GitHubUser>(cacheKey);

  if (cachedData) {
    return {
      data: cachedData.data,
      cached: true,
      timestamp: cachedData.timestamp,
    };
  }

  const freshData = await fetchUserProfile(username);
  cacheService.set(cacheKey, freshData);

  return {
    data: freshData,
    cached: false,
    timestamp: new Date().toISOString(),
  };
};

export const getCachedUserRepos = async (username: string): Promise<CachedResponse<GitHubRepo[]>> => {
  const cacheKey = `repos:${username.toLowerCase()}`;
  const cachedData = cacheService.get<GitHubRepo[]>(cacheKey);

  if (cachedData) {
    return {
      data: cachedData.data,
      cached: true,
      timestamp: cachedData.timestamp,
    };
  }

  const freshData = await fetchUserRepos(username);
  cacheService.set(cacheKey, freshData);

  return {
    data: freshData,
    cached: false,
    timestamp: new Date().toISOString(),
  };
};

export const getCachedUserStats = async (username: string): Promise<CachedResponse<GitHubStats>> => {
  const cacheKey = `stats:${username.toLowerCase()}`;
  const cachedData = cacheService.get<GitHubStats>(cacheKey);

  if (cachedData) {
    return {
      data: cachedData.data,
      cached: true,
      timestamp: cachedData.timestamp,
    };
  }

  const freshData = await calculateUserStats(username);
  cacheService.set(cacheKey, freshData);

  return {
    data: freshData,
    cached: false,
    timestamp: new Date().toISOString(),
  };
};
