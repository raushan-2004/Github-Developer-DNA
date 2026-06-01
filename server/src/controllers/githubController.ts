import { Request, Response, NextFunction } from 'express';
import { fetchUserProfile, fetchUserRepos, calculateUserStats } from '../services/githubService';
import { sendSuccess } from '../utils/apiResponse';
import { AppError } from '../utils/errors';

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;
    if (!username) {
      throw new AppError('Username parameter is required', 400);
    }

    const userProfile = await fetchUserProfile(username);
    return sendSuccess(res, userProfile, 'User retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getRepos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;
    if (!username) {
      throw new AppError('Username parameter is required', 400);
    }

    const repos = await fetchUserRepos(username);
    return sendSuccess(res, repos, 'Repositories retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.params;
    if (!username) {
      throw new AppError('Username parameter is required', 400);
    }

    const stats = await calculateUserStats(username);
    return sendSuccess(res, stats, 'User stats retrieved successfully');
  } catch (error) {
    next(error);
  }
};
